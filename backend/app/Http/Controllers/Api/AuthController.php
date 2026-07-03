<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Helpers\AuditHelper;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
            'role' => 'required|in:owner,kasir,admin_gudang,admin_keuangan',
        ]);

        $credentials = [
            'email' => $validated['email'],
            'password' => $validated['password'],
        ];

        if (! Auth::attempt($credentials)) {
            return response()->json([
                'success' => false,
                'message' => 'Email atau password salah'
            ], 401);
        }

        $user = Auth::user();

        if ($user->role !== $validated['role']) {
            Auth::logout();

            return response()->json([
                'success' => false,
                'message' => 'Role login tidak sesuai dengan akun ini'
            ], 403);
        }

        AuditHelper::log(
            $user->id,
            'LOGIN',
            'AUTH',
            'Login ke sistem'
        );

        return response()->json([
            'success' => true,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'role' => $user->role,
                'branch_id' => $user->branch_id,
            ]
        ]);
    }
}