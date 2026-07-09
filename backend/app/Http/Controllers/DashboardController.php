<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductStock;
use App\Models\Sale;
use App\Models\TransferStock;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function summary(Request $request)
    {
        $period = max(1, min((int) $request->input('period', 7), 90));
        $branchId = $request->input('branch_id');

        $salesQuery = Sale::query();
        $stockQuery = ProductStock::query();
        $transferQuery = TransferStock::query();

        if ($branchId) {
            $salesQuery->where('branch_id', $branchId);
            $stockQuery->where('branch_id', $branchId);
            $transferQuery->where(function ($query) use ($branchId) {
                $query
                    ->where('from_branch_id', $branchId)
                    ->orWhere('to_branch_id', $branchId);
            });
        }

        $sales = (clone $salesQuery)
            ->select('id', 'total', 'created_at')
            ->where('created_at', '>=', now()->subDays($period))
            ->get();

        $chartData = [];

        for ($i = $period - 1; $i >= 0; $i--) {
            $date = now()->subDays($i);
            $dailySales = $sales->filter(fn ($sale) => $sale->created_at->isSameDay($date));

            $chartData[] = [
                'day' => $date->locale('id')->translatedFormat('d M'),
                'revenue' => $dailySales->sum(fn ($sale) => (float) $sale->total),
                'orders' => $dailySales->count(),
            ];
        }

        $productsQuery = Product::query();
        if ($branchId) {
            $productsQuery->whereHas('stocks', function ($q) use ($branchId) {
                $q->where('branch_id', $branchId);
            });
        }

        $totalProducts = (clone $productsQuery)->count();

        $categoryRows = (clone $productsQuery)
            ->select('category', DB::raw('COUNT(*) as total'))
            ->groupBy('category')
            ->get();

        $colors = ['#1565C0', '#06B6D4', '#3B82F6', '#0EA5E9', '#7DD3FC', '#F59E0B', '#10B981'];

        $categoryData = $categoryRows
            ->values()
            ->map(function ($row, $index) use ($totalProducts, $colors) {
                return [
                    'name' => $row->category ?: 'Lainnya',
                    'value' => $totalProducts > 0 ? round(((int) $row->total / $totalProducts) * 100) : 0,
                    'color' => $colors[$index % count($colors)],
                ];
            });

        $expiringQuery = Product::query()
            ->select('id', 'name', 'image', 'expiry')
            ->whereNotNull('expiry')
            ->whereDate('expiry', '<=', now()->addDays(7))
            ->orderBy('expiry')
            ->limit(10);

        if ($branchId) {
            $expiringQuery->whereHas('stocks', function ($q) use ($branchId) {
                $q->where('branch_id', $branchId)->where('stock', '>', 0);
            });
        }

        $expiringProducts = $expiringQuery->get()
            ->map(function ($product) use ($branchId) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'image' => $product->image,
                    'branch' => $branchId ? 'Cabang ini' : 'Semua cabang',
                    'expiry' => $product->expiry,
                ];
            });

        $lowStockCount = (clone $stockQuery)
            ->where('stock', '<=', 10)
            ->count();

        $branchPerformance = DB::table('branches')
            ->leftJoin('sales', 'branches.id', '=', 'sales.branch_id')
            ->when($branchId, fn ($query) => $query->where('branches.id', $branchId))
            ->select(
                'branches.id',
                'branches.name',
                DB::raw('COALESCE(SUM(sales.total), 0) as revenue')
            )
            ->groupBy('branches.id', 'branches.name')
            ->get();

        $recentTransfers = (clone $transferQuery)
            ->with(['product:id,name', 'fromBranch:id,name', 'toBranch:id,name'])
            ->latest()
            ->limit(5)
            ->get();

        return response()->json([
            'totalProducts' => $totalProducts,
            'totalStocks' => (clone $stockQuery)->sum('stock'),
            'lowStockCount' => $lowStockCount,
            'expiringProducts' => $expiringProducts,
            'expiringCount' => $expiringProducts->count(),
            'todayRevenue' => (clone $salesQuery)->whereDate('created_at', today())->sum('total'),
            'totalRevenue' => $sales->sum(fn ($sale) => (float) $sale->total),
            'chartData' => $chartData,
            'categoryData' => $categoryData,
            'branches' => $branchPerformance,
            'transfers' => $recentTransfers,
            'totalTransfers' => (clone $transferQuery)->count(),
            'todayTransfers' => (clone $transferQuery)->whereDate('created_at', today())->count(),
            'usersCount' => User::count(),
        ]);
    }
}
