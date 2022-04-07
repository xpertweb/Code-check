<?php
namespace App\Http\Controllers\Auth;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Foundation\Auth\SendsPasswordResetEmails;
use Illuminate\Support\Facades\Mail;
use MailHelper;
use Hash;
use App\Model\User;
use App\Model\Passwordreset;

class ForgotPasswordController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Password Reset Controller
    |--------------------------------------------------------------------------
    |
    | This controller is responsible for handling password reset emails and
    | includes a trait which assists in sending these notifications from
    | your application to your users. Feel free to explore this trait.
    |
    */

    use SendsPasswordResetEmails;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest');
    }
	
	protected function validator(array $data)
    {
        return Validator::make($data, [
            'email' => 'required|email',
        ]);
    }
	
	protected function validatorPass(array $data)
    {
        return Validator::make($data, [
            'password' => 'required|min:6',
            'confirm_password' => 'required_with:password|same:password|min:6'
        ]);
    }
	
	public function forgetPassword(Request $request){
		
		$this->validator($request->all())->validate();
		
		$emailExist = User::where("email",$request->email)->first();
		if(!empty($emailExist))
		{	
			$random = rand(100000,999999);
			$hashRandom = Hash::make($random);
			$md5Random = md5($random);
			User::where(['email' => $emailExist->email , 'is_deleted' => 0 ] )->update([ 'password' => $hashRandom ]);
			Passwordreset::where(['email' => $emailExist->email])->delete();
			Passwordreset::insert(['email' => $emailExist->email , 'token' => $md5Random ]);
			
			$emailData = [
				'name' => $emailExist->name,
				'email' => $emailExist->email,
				'random' => $random,
				'hashRandom' => $md5Random
			];			
			
		   //send email code
			$message="";  
			$view = "mail.forgotPassword";
			$subject="Forget Password";
			
			$mail_data = [ 'message' => $message, 'email'=> $request->email ,'subject' => $subject,'view' => $view];
			try{
				$MailHelper = MailHelper::mailSend($mail_data,$emailData);
			}
			catch (Exception $e){}
			
			//send mailcode
			return response()->json(['success' => ['message'=> 'Please check your email.' ]],200); 
		}
		else
		{
			return response()->json(['errors' => ['email' => ['Given email is not present. Please check and try again.'] ]], 400);
		}
	   
	}
	
	public function newPassword(Request $request){
		
		$tokenExist = Passwordreset::where(['token' => $request->token ])->first();
		
		if (!empty($request->post()))
		{
			$post = $request->all(); 
			$this->validatorPass($post)->validate();
			
			if(!empty($tokenExist))
			{
				User::where(['email' => $tokenExist->email , 'is_deleted' => 0 ] )->update([ 'password' => Hash::make($post['password']) ]);
				
				return back()->with("success", "Password updated successfully.");
			}
		}
		
		if(!empty($tokenExist)) {	
			return view('changePassword',['token' => $request->token ]);
		}else{
			return view('urlExpire');
		}
	}
	
	
}
