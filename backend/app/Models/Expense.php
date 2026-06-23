<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    protected $fillable = [
        'branch_id',
        'category',
        'amount',
        'description',
        'expense_date'
    ];
}
