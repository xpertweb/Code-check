<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Files extends Model
{
	protected $table = 'pro_files';

    protected $fillable = ['file_id','library_id','file_name','file_type','file_path','is_deleted'];
	
	public function library()
    {
		// FIRST library_id IS 
        return $this->belongsTo('App\Model\Library','library_id','library_id');
    }   
    
	public function createuser()
    {
        return $this->belongsTo('App\Model\User','created_by','id');
    }
}
