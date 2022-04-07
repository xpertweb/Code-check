<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Token extends Model
{
    protected $table = 'pro_access_tokens';
    protected $fillable = ['user_id','access_token'];
}
