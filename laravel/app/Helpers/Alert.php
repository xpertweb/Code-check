<?php
namespace App\Helpers;
use Illuminate\Http\Request;
use Helper;
use CustomMail;
use View;
use App\Model\Emailer;

class Alert
{
    public static function send($emailData)
    {
        $data = [
                  "message"=>'',
                  "email"=>$emailData['reciever'],
                  "subject"=>$emailData['subject'],
                  "from"=>$emailData['sender'],
                  "from_name"=>$emailData['sender_name'],
                  "content"=>html_entity_decode($emailData['content'])
                ];

        return CustomMail::send($data);
    }
	
    public static function prepareMessage($data,$message)
    {
        foreach ($data as $key => $value) 
        {
          $search = $key;
          $replace = $value;
          $message = str_replace($search, $replace, $message);
        }
        return $message;
    }
   


}
