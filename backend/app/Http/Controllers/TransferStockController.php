<?php

namespace App\Http\Controllers;

use App\Models\ProductStock;
use App\Models\TransferStock;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Helpers\AuditHelper;

class TransferStockController extends Controller
{
    public function store(Request $request)
    {
        DB::transaction(function () use ($request) {

            $from = ProductStock::where(
                'product_id',
                $request->product_id
            )
                ->where(
                    'branch_id',
                    $request->from_branch_id
                )
                ->firstOrFail();

            if ($from->stock < $request->qty) {
                abort(422, 'Stok tidak mencukupi');
            }

            $to = ProductStock::firstOrCreate(
                [
                    'product_id' => $request->product_id,
                    'branch_id' => $request->to_branch_id
                ],
                [
                    'stock' => 0
                ]
            );

            $from->decrement(
                'stock',
                $request->qty
            );

            $to->increment(
                'stock',
                $request->qty
            );

            $transfer = TransferStock::create([
                'product_id' => $request->product_id,
                'from_branch_id' => $request->from_branch_id,
                'to_branch_id' => $request->to_branch_id,
                'qty' => $request->qty,
                'user_id' => $request->user_id
            ]);

            $productName = $from->product->name;

            $fromBranchName = $from->branch->name;

            $toBranchName = $to->branch->name;

            AuditHelper::log(
                $request->user_id,
                'TRANSFER',
                'STOCK',
                "Transfer {$request->qty} pcs {$productName} dari {$fromBranchName} ke {$toBranchName}"
            );
        });

        return response()->json([
            'message' => 'Transfer berhasil'
        ]);
    }

    public function index()
    {
        return TransferStock::with([
            'product',
            'fromBranch',
            'toBranch'
        ])
            ->latest()
            ->get();
    }

    public function history(Request $request)
    {
        $branchId = $request->query('branch_id');
        $query = TransferStock::with([
            'product',
            'fromBranch',
            'toBranch',
            'user'
        ]);

        if ($branchId) {
            $query->where(function ($q) use ($branchId) {
                $q->where('from_branch_id', $branchId)
                    ->orWhere('to_branch_id', $branchId);
            });
        }

        return $query->latest()->get();
    }
}
