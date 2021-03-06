<?php
namespace App\Model;
use Illuminate\Database\Eloquent\Model;

class Leads extends Model
{
	protected $table = 'pro_leads';

    protected $fillable = ['leads_id','designer_id','leads_name','leads_link','client_email','client_phone','client_vat','client_address','client_person','leads_prices','comment','leads_status','leads_type','reminder_text'];

    public function user()
    {
        return $this->belongsTo('App\Model\User','designer_id','id');
    }
    
}
	