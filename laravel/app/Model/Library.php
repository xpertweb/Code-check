<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Library extends Model
{
	protected $table = 'pro_library';

    protected $fillable = ['library_id','designer_id','library_name','is_deleted'];

    public function user()
    {
        return $this->belongsTo('App\Model\User','designer_id','id');
    }
	
	public function createuser()
    {
        return $this->belongsTo('App\Model\User','created_by','id');
    }
	
    public function files()
    {
        return $this->hasMany('App\Model\Files','library_id','library_id')->where(['is_deleted' => 0]);
    }
    
}
