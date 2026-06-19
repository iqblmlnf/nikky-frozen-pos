<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{
    protected $fillable = [
        'invoice_number',
        'user_id',
        'branch_id',
        'total',
        'payment_method',
        'payment_status',
    ];

    public function user()
    {
        return $this->belongsTo(
            User::class
        );
    }

    public function branch()
    {
        return $this->belongsTo(
            Branch::class
        );
    }

    public function items()
    {
        return $this->hasMany(
            SaleItem::class
        );
    }
}