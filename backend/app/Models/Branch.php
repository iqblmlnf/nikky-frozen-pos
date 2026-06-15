<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Branch extends Model
{
    protected $fillable = [
        'name',
        'address',
    ];

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function sales()
    {
        return $this->hasMany(Sale::class);
    }

    public function stocks()
    {
        return $this->hasMany(ProductStock::class);
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }
}
