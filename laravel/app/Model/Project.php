<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
	protected $table = 'pro_project';

    protected $fillable = ['project_id','designer_id','project_name','project_link','projectCapacity','projectAssigned','client_email','client_phone','client_vat','client_address','client_person','project_prices','comment','project_complete','project_doc','project_status','created_date'];

    public function user()
    {
        return $this->belongsTo('App\Model\User','designer_id','id');
    }
    
}
