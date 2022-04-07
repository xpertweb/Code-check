<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Country extends Model
{
    protected $table = 'pro_countries';
    protected $fillable = ['id','sortname','name','phonecode'];
}
