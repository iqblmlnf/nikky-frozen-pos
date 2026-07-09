<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        return User::with('branch')
            ->latest()
            ->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'email' => 'required|unique:users,email',
        ]);

        return User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'role' => $request->role,
            'branch_id' => $request->branch_id,
        ]);
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'email' => 'required|unique:users,email,' . $user->id,
        ]);

        $data = [
            'name' => $request->name,
            'email' => $request->email,
            'role' => $request->role,
            'branch_id' => $request->branch_id,
        ];

        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $user->update($data);

        return response()->json($user);
    }

    public function destroy(User $user)
    {
        $hasSales = \App\Models\Sale::where('user_id', $user->id)->exists();
        if ($hasSales) {
            return response()->json([
                'message' => 'Tidak dapat menghapus user ini karena telah memiliki riwayat transaksi penjualan. Silakan biarkan user tetap ada.'
            ], 422);
        }

        $user->delete();

        return response()->json([
            'message' => 'User berhasil dihapus'
        ]);
    }
}
