<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Passwordreset extends Model
{
	protected $table = 'password_resets';

    protected $fillable = ['email','token'];

   
    
}
