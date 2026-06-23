<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductStock;
use Illuminate\Http\Request;
use App\Helpers\AuditHelper;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $branchId = $request->branch_id;

        $query = Product::with([
            'stocks.branch'
        ]);

        if ($branchId) {
            $query->whereHas('stocks', function ($q) use ($branchId) {
                $q->where('branch_id', $branchId);
            });
        }

        return $query->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'sku' => 'required|unique:products,sku',
            'name' => 'required',
            'branch_id' => 'required|exists:branches,id',
            'stock' => 'required|numeric|min:0',
        ], [
            'sku.unique' => 'SKU sudah digunakan',
            'sku.required' => 'SKU wajib diisi',
            'name.required' => 'Nama produk wajib diisi',
        ]);

        $imagePath = null;

        if ($request->hasFile('image')) {
            $imagePath = $request
                ->file('image')
                ->store('products', 'public');
        }

        $product = Product::create([
            'sku' => $request->sku,
            'name' => $request->name,
            'category' => $request->category,
            'price' => $request->price,
            'expiry' => $request->expiry,
            'image' => $imagePath,
        ]);

        ProductStock::create([
            'product_id' => $product->id,
            'branch_id' => $request->branch_id,
            'stock' => $request->stock,
        ]);

        AuditHelper::log(
            $request->user_id,
            'CREATE',
            'PRODUCT',
            'Menambahkan produk ' . $product->name
        );

        return response()->json($product);
    }

    public function show(Product $product)
    {
        return $product;
    }

    public function update(Request $request, Product $product)
    {
        $imagePath = $product->image;

        if ($request->hasFile('image')) {
            $imagePath = $request
                ->file('image')
                ->store('products', 'public');
        }

        $product->update([
            'sku' => $request->sku,
            'name' => $request->name,
            'category' => $request->category,
            'price' => $request->price,
            'expiry' => $request->expiry,
            'image' => $imagePath,
        ]);

        ProductStock::updateOrCreate(
            [
                'product_id' => $product->id,
                'branch_id' => $request->branch_id,
            ],
            [
                'stock' => $request->stock,
            ]
        );

        AuditHelper::log(
            $request->user_id,
            'UPDATE',
            'PRODUCT',
            'Mengubah produk ' . $product->name
        );

        return response()->json($product);
    }

    public function destroy(Product $product)
    {
        DB::table('transfer_stocks')
            ->where('product_id', $product->id)
            ->delete();

        DB::table('product_stocks')
            ->where('product_id', $product->id)
            ->delete();

        DB::table('sale_items')
            ->where('product_id', $product->id)
            ->delete();

        $product->delete();

        return response()->json([
            'message' => 'Produk berhasil dihapus'
        ]);
    }
}
