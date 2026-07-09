<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Branch;
use App\Models\User;

class DailySettlement extends Model
{
    protected $fillable = [
        'branch_id',
        'date',
        'closed_by_user_id',
        'total_sales',
        'total_expenses',
        'status',
    ];

    protected $casts = [
        'date' => 'date:Y-m-d',
        'total_sales' => 'integer',
        'total_expenses' => 'integer',
    ];

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    public function closedBy()
    {
        return $this->belongsTo(User::class, 'closed_by_user_id');
    }
}
