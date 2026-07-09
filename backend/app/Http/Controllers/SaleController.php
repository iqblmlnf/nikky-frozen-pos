<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\SaleItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Helpers\AuditHelper;
use App\Models\ProductStock;

class SaleController extends Controller
{
    public function store(Request $request)
    {
        // 1. Cek jam operasional (Tutup pukul 22:00)
        if (now()->hour >= 22) {
            return response()->json([
                'message' => 'Transaksi ditolak. Batas waktu operasional penjualan adalah pukul 22.00.'
            ], 422);
        }

        // 2. Cek apakah hari ini sudah Tutup Buku Harian untuk cabang tersebut
        $settled = \App\Models\DailySettlement::where('branch_id', $request->branch_id)
            ->where('date', now()->toDateString())
            ->exists();

        if ($settled) {
            return response()->json([
                'message' => 'Transaksi ditolak. Cabang ini sudah melakukan Tutup Buku Harian untuk hari ini.'
            ], 422);
        }

        // 3. Cek apakah kasir ini sedang memiliki shift aktif
        $activeShift = \App\Models\CashierShift::where('user_id', $request->user_id)
            ->where('status', 'open')
            ->first();

        if (!$activeShift) {
            return response()->json([
                'message' => 'Transaksi ditolak. Anda harus membuka shift kasir terlebih dahulu untuk melakukan penjualan.'
            ], 422);
        }

        DB::beginTransaction();

        try {

            $sale = Sale::create([
                'invoice_number' => $request->invoice_number ?? ('INV-' . now()->format('YmdHis')),
                'user_id' => $request->user_id,
                'branch_id' => $request->branch_id,
                'total' => $request->total,
                'payment_method' => $request->payment_method ?? 'Cash',
                'payment_status' => 'paid',
            ]);

            // Update total penjualan di shift kasir yang aktif
            $activeShift->increment('total_sales', $request->total);

            foreach ($request->items as $item) {

                SaleItem::create([
                    'sale_id' => $sale->id,
                    'product_id' => $item['id'],
                    'qty' => $item['qty'],
                    'price' => $item['price'],
                    'subtotal' => $item['qty'] * $item['price'],
                ]);

                $stock = ProductStock::where(
                    'product_id',
                    $item['id']
                )
                    ->where(
                        'branch_id',
                        $request->branch_id
                    )
                    ->first();

                if (!$stock) {
                    throw new \Exception(
                        'Data stok tidak ditemukan'
                    );
                }

                if ($stock->stock < $item['qty']) {
                    throw new \Exception(
                        'Stok tidak mencukupi untuk ' . $item['name']
                    );
                }

                $stock->decrement(
                    'stock',
                    $item['qty']
                );
            }

            AuditHelper::log(
                $request->user_id,
                'CREATE',
                'SALE',
                'Membuat transaksi ' . $sale->invoice_number
            );

            DB::commit();

            return response()->json([
                'message' => 'Transaksi berhasil',
                'sale' => $sale
            ]);
        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        return Sale::with([
            'items.product',
            'user'
        ])->findOrFail($id);
    }

    public function index(Request $request)
    {
        $query = Sale::with([
            'user:id,name',
            'branch:id,name',
        ])
            ->withSum('items as items_qty', 'qty');

        if ($request->branch_id) {
            $query->where('branch_id', $request->branch_id);
        }

        if ($request->limit) {
            $query->limit((int) $request->limit);
        }

        return $query
            ->latest()
            ->get();
    }
}

