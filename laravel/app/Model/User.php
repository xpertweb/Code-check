<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
	protected $table = 'users';

    protected $fillable = ['contact'];

    public function project()
    {
        return $this->hasMany('App\Model\Project','designer_id');
    }
	
	public function processProject()
    {
        return $this->hasMany('App\Model\Project','designer_id')->where('project_status', 0);
    }
	
    public function leads()
    {
        return $this->hasMany('App\Model\Leads','designer_id');
    }
	
    public function designer()
    {
        return $this->hasOne('App\Model\Designer','designer_id');
    }
	
    public function subadmin()
    {
        return $this->hasOne('App\Model\Subadmin','admin_id');
    }
    
}
