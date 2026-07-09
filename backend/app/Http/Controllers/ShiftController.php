<?php

namespace App\Http\Controllers;

use App\Models\CashierShift;
use App\Models\DailySettlement;
use App\Models\Sale;
use App\Models\Expense;
use Illuminate\Http\Request;
use App\Helpers\AuditHelper;

class ShiftController extends Controller
{
    public function active(Request $request)
    {
        $userId = $request->query('user_id');
        if (!$userId) {
            return response()->json(['message' => 'User ID wajib diisi'], 400);
        }

        $shift = CashierShift::where('user_id', $userId)
            ->where('status', 'open')
            ->first();

        return response()->json($shift);
    }

    public function open(Request $request)
    {
        $request->validate([
            'user_id' => 'required',
            'branch_id' => 'required',
            'shift_number' => 'required|integer|in:1,2',
            'initial_cash' => 'required|integer|min:0',
        ]);

        // Cek shift yang sedang open
        $activeShift = CashierShift::where('user_id', $request->user_id)
            ->where('status', 'open')
            ->first();

        if ($activeShift) {
            return response()->json([
                'message' => 'Anda masih memiliki shift yang belum ditutup!'
            ], 422);
        }

        // Cek tutup buku hari ini untuk cabang tersebut
        $settled = DailySettlement::where('branch_id', $request->branch_id)
            ->where('date', now()->toDateString())
            ->exists();

        if ($settled) {
            return response()->json([
                'message' => 'Tutup buku harian cabang untuk hari ini sudah dilakukan. Penjualan baru tidak dapat dibuka.'
            ], 422);
        }

        $shift = CashierShift::create([
            'user_id' => $request->user_id,
            'branch_id' => $request->branch_id,
            'shift_number' => $request->shift_number,
            'start_time' => now(),
            'initial_cash' => $request->initial_cash,
            'status' => 'open',
        ]);

        AuditHelper::log(
            $request->user_id,
            'OPEN_SHIFT',
            'SHIFT',
            'Membuka Shift ' . $request->shift_number . ' dengan modal awal Rp ' . number_format($request->initial_cash, 0, ',', '.')
        );

        return response()->json($shift);
    }

    public function close(Request $request)
    {
        $request->validate([
            'user_id' => 'required',
            'actual_cash' => 'required|integer|min:0',
        ]);

        $shift = CashierShift::where('user_id', $request->user_id)
            ->where('status', 'open')
            ->first();

        if (!$shift) {
            return response()->json([
                'message' => 'Tidak ada shift aktif yang ditemukan.'
            ], 404);
        }

        // Hitung total sales kasir ini sejak shift dimulai
        $totalSales = Sale::where('user_id', $request->user_id)
            ->where('branch_id', $shift->branch_id)
            ->where('created_at', '>=', $shift->start_time)
            ->sum('total');

        $shift->update([
            'end_time' => now(),
            'total_sales' => $totalSales,
            'actual_cash' => $request->actual_cash,
            'status' => 'closed',
        ]);

        AuditHelper::log(
            $request->user_id,
            'CLOSE_SHIFT',
            'SHIFT',
            'Menutup Shift ' . $shift->shift_number . ' dengan omzet Rp ' . number_format($totalSales, 0, ',', '.')
        );

        return response()->json($shift);
    }

    public function todaySettlement(Request $request)
    {
        $branchId = $request->query('branch_id');
        if (!$branchId) {
            return response()->json(['message' => 'Branch ID wajib diisi'], 400);
        }

        $settlement = DailySettlement::where('branch_id', $branchId)
            ->where('date', now()->toDateString())
            ->first();

        // Cari semua shift hari ini di cabang tersebut untuk direkap di frontend
        $shifts = CashierShift::with('user:id,name')
            ->where('branch_id', $branchId)
            ->whereDate('created_at', now()->toDateString())
            ->get();

        return response()->json([
            'settlement' => $settlement,
            'shifts' => $shifts,
        ]);
    }

    public function closeDay(Request $request)
    {
        $request->validate([
            'branch_id' => 'required',
            'user_id' => 'required',
        ]);

        // Tutup buku hanya boleh dilakukan setelah pukul 21:00 (jam 9 malam)
        if (now()->hour < 21) {
            return response()->json([
                'message' => 'Tutup buku harian baru bisa dilakukan setelah pukul 21.00.'
            ], 422);
        }

        // Cek apakah sudah tutup buku
        $exists = DailySettlement::where('branch_id', $request->branch_id)
            ->where('date', now()->toDateString())
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'Tutup buku harian cabang untuk hari ini sudah selesai.'
            ], 422);
        }

        // Hitung total sales cabang hari ini
        $totalSales = Sale::where('branch_id', $request->branch_id)
            ->whereDate('created_at', now()->toDateString())
            ->sum('total');

        // Hitung total pengeluaran cabang hari ini
        $totalExpenses = Expense::where('branch_id', $request->branch_id)
            ->whereDate('created_at', now()->toDateString())
            ->sum('amount');

        $settlement = DailySettlement::create([
            'branch_id' => $request->branch_id,
            'date' => now()->toDateString(),
            'closed_by_user_id' => $request->user_id,
            'total_sales' => $totalSales,
            'total_expenses' => $totalExpenses,
            'status' => 'closed',
        ]);

        // Tutup otomatis shift yang masih menggantung/open di cabang tersebut
        CashierShift::where('branch_id', $request->branch_id)
            ->where('status', 'open')
            ->each(function ($shift) {
                $sales = Sale::where('user_id', $shift->user_id)
                    ->where('branch_id', $shift->branch_id)
                    ->where('created_at', '>=', $shift->start_time)
                    ->sum('total');

                $shift->update([
                    'status' => 'closed',
                    'end_time' => now(),
                    'total_sales' => $sales,
                    'actual_cash' => $shift->initial_cash + $sales, // fallback estimate
                ]);
            });

        AuditHelper::log(
            $request->user_id,
            'DAILY_SETTLEMENT',
            'FINANCE',
            'Melakukan Tutup Buku Harian Cabang dengan omzet Rp ' . number_format($totalSales, 0, ',', '.')
        );

        return response()->json($settlement);
    }
}
