<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Branch;

class CashierShift extends Model
{
    protected $fillable = [
        'user_id',
        'branch_id',
        'shift_number',
        'start_time',
        'end_time',
        'initial_cash',
        'total_sales',
        'actual_cash',
        'status',
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'initial_cash' => 'integer',
        'total_sales' => 'integer',
        'actual_cash' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }
}
