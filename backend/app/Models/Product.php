<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'sku',
        'name',
        'category',
        'price',
        'expiry',
        'image',
    ];

    public function stocks()
    {
        return $this->hasMany(ProductStock::class);
    }
}
