<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Designer extends Model
{
	protected $table = 'pro_designer';

    protected $fillable = ['designer_id','first_name','last_name','gender','dob','city','state','country','description'];
   
    public function user()
    {
        return $this->belongsTo('App\Model\User','designer_id','id');
    }
    
}
