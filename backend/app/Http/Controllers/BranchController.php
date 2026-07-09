<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BranchController extends Controller
{
    public function index()
    {
        return Branch::latest()->get();
    }

    public function store(Request $request)
    {
        return Branch::create([
            'name' => $request->name,
            'address' => $request->address,
        ]);
    }

    public function update(Request $request, Branch $branch)
    {
        $branch->update([
            'name' => $request->name,
            'address' => $request->address,
        ]);

        return response()->json($branch);
    }

    public function destroy(Branch $branch)
    {
        DB::beginTransaction();
        try {
            DB::statement('SET FOREIGN_KEY_CHECKS=0;');

            // Hapus data stok produk di cabang ini
            DB::table('product_stocks')->where('branch_id', $branch->id)->delete();
            
            // Hapus data pengguna yang berada di cabang ini
            DB::table('users')->where('branch_id', $branch->id)->delete();

            // Hapus data transaksi penjualan di cabang ini
            DB::table('sales')->where('branch_id', $branch->id)->delete();

            // Hapus data pengeluaran di cabang ini
            DB::table('expenses')->where('branch_id', $branch->id)->delete();

            // Hapus data shift di cabang ini
            DB::table('cashier_shifts')->where('branch_id', $branch->id)->delete();

            // Hapus data tutup buku di cabang ini
            DB::table('daily_settlements')->where('branch_id', $branch->id)->delete();

            // Hapus data transfer stok (dari/ke cabang ini)
            DB::table('transfer_stocks')->where('from_branch_id', $branch->id)->orWhere('to_branch_id', $branch->id)->delete();

            // Hapus cabang itu sendiri
            $branch->delete();

            DB::statement('SET FOREIGN_KEY_CHECKS=1;');
            DB::commit();

            return response()->json([
                'message' => 'Cabang berhasil dihapus'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            DB::statement('SET FOREIGN_KEY_CHECKS=1;');
            return response()->json([
                'message' => 'Gagal menghapus cabang: ' . $e->getMessage()
            ], 500);
        }
    }

    public function performance(Request $request)
{
    $query = Branch::leftJoin(
        'sales',
        'branches.id',
        '=',
        'sales.branch_id'
    );

    if ($request->branch_id) {
        $query->where(
            'branches.id',
            $request->branch_id
        );
    }

    return $query
        ->select(
            'branches.id',
            'branches.name',
            DB::raw(
                'COALESCE(SUM(sales.total),0) as revenue'
            )
        )
        ->groupBy(
            'branches.id',
            'branches.name'
        )
        ->get();
}
}
