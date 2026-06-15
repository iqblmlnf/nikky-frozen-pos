<?php

namespace App\Helpers;

use App\Models\AuditLog;

class AuditHelper
{
    public static function log(
        $userId,
        $action,
        $module,
        $description
    ) {
        AuditLog::create([
            'user_id' => $userId,
            'action' => $action,
            'module' => $module,
            'description' => $description
        ]);
    }
}
