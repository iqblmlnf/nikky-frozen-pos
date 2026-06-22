<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use Illuminate\Http\Request;

class ExpenseController extends Controller
{
    public function index()
    {
        return Expense::latest()->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category' => 'required|string',
            'amount' => 'required|numeric',
            'description' => 'nullable|string',
            'expense_date' => 'required|date',
        ]);

        $expense = Expense::create($validated);

        return response()->json($expense, 201);
    }

    public function show(string $id)
    {
        return Expense::findOrFail($id);
    }

    public function update(Request $request, string $id)
    {
        $expense = Expense::findOrFail($id);

        $expense->update($request->all());

        return $expense;
    }

    public function destroy(string $id)
    {
        Expense::findOrFail($id)->delete();

        return response()->json([
            'message' => 'Deleted'
        ]);
    }
}
