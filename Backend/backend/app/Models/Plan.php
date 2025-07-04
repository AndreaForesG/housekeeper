<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
    use HasFactory;

        protected $fillable = [
            'name',
            'stripe_price_id',
            'price',
            'description',
            'rooms_limit'
        ];

        public function users()
        {
            return $this->hasMany(User::class);
        }
}
