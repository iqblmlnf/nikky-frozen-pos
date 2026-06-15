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
        $branch->delete();

        return response()->json([
            'message' => 'Cabang berhasil dihapus'
        ]);
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
