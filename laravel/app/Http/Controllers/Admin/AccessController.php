<?php
namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use DB;
use App\Model\User;
use App\Model\Token;

class AccessController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
       // $this->middleware('auth');
    }


    public function CreateToken(Request $request)
    {
        $userId = $request->id;

        $exist = User::where("id",$userId)->count();

        if($exist > 0)
        {
            $access_token = str_random(40);
            
            $data = ["user_id"=>$userId,"access_token"=>$access_token];

            if(Token::create($data))
            {
                return redirect()->route('autologin', ['access_token' => $access_token]);
            }

        }
        return back()->with("status","Invalid action performed");
    }
    public function Autologin(Request $request)
    {
        $access_token = $request->access_token;
        
        $userId = Token::where("access_token",$access_token)->pluck("user_id")->first();
		
        if($userId)
        {
           if(Token::where("access_token",$access_token)->delete())
           {
              Auth::loginUsingId($userId);
              return redirect("/");
           }  
        }
        
        echo "You are not authorized";
        die();


    }

}
