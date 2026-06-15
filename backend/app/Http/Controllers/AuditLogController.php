<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;

class AuditLogController extends Controller
{
    public function index()
    {
        return AuditLog::with('user')
            ->latest()
            ->get();
    }
}
