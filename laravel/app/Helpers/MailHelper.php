<?php 
namespace App\Helpers;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use DB;
use App\Model\User;
use App\Model\Temp;

class MailHelper
{
	public static function mailSend($mail_data,$data)
	{
		$message=$mail_data['message'];
		$email= trim($mail_data['email']);
		
		$subject=$mail_data['subject'];
		$view=$mail_data['view'];
		$path = !empty($mail_data['path'])?$mail_data['path']:'';
		$from = config("mail.from.address");
		$fromTitle = config("mail.from.name");
		Mail::send(['html'=>$view], ["data"=> $data],function ($message) use ($email,$subject,$from,$fromTitle,$path) 
        {
           $message->to($email)->from($from,$fromTitle)->subject($subject);
		   if(!empty($path))   $message->attach($path);
		   
        });
		
		if(count(Mail::failures()) > 0)
		{
			return false;
		}
		else
		{
			return true;
		}
		
	}
	public static function send($data)
	{
		$message='';
		$email=$data['email'];
		$subject=$data['subject'];
		$from = $data['from'];
		$content = $data['content'];
		$fromName = $data['from_name'];
		
		try
		{
            Mail::send([],[],function($message) use ($email,$subject,$from,$fromName,$content) 
	        {
				 $message->to($email)
				         ->from($from,$fromName)
				         ->subject($subject)
				         ->setBody($content,'text/html');
	        });
            
            if(count(Mail::failures()) > 0)
	        {
			    return false;
			}
			else
			{
				return true;
			}
	    }
	    catch(\Exception $e)
	    {
	    	return false;
	    }
	}
}
?>