<?php

namespace App\Http\Controllers;

use App\Models\ProductStock;
use Illuminate\Http\Request;

class ProductStockController extends Controller
{
    public function index(Request $request)
    {
        $branchId = $request->branch_id;

        $query = ProductStock::with([
            'product',
            'branch'
        ]);

        if ($branchId) {
            $query->where(
                'branch_id',
                $branchId
            );
        }

        return $query->get();
    }

    public function update(
        Request $request,
        $id
    ) {
        $stock = ProductStock::findOrFail($id);

        $stock->update([
            'stock' => $request->stock
        ]);

        return response()->json([
            'message' => 'Stok berhasil diperbarui'
        ]);
    }
}
