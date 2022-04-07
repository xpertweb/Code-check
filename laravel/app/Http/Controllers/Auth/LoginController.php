<?php
namespace App\Http\Controllers\Auth;
use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Auth;
use DB;
use Illuminate\Support\Facades\Input;
use App\Model\User;
use App\Model\Token;
use Artisan;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    use AuthenticatesUsers;

    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    protected $redirectTo = '/home';

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest')->except('logout');
    }
	
	protected function validator(array $data)
    {
        return Validator::make($data, [
            'email' => 'required|email',
            'password' => 'required',
        ]);
    }
	
    public function index()
    {
       return view('login');
    }
	
    public function adminIndex()
    {
       return view('adminLogin');
    }
	
	public function login(Request $request)
    {
		$this->validator($request->all())->validate();
		$emailExist = User::where(["email" => $request->email , 'is_deleted' => 0 ])->whereIn('role_id',[2,3])->first();

		if(!empty($emailExist))
		{
			if(Auth::attempt(array('email' => $request->email, 'password' => $request->password,'is_deleted' => 0)))
			{
				if(Auth::user()->status == 1){
					return redirect('/');
				}else{
					return back()->withErrors(['email'=>'Please wait for admin approval.'])->withInput(Input::except('password'));
				}
			}
			else
			{
                return back()->withErrors(['password'=>'Wrong Password'])->withInput(Input::except('password'));
			}
		}
		else
		{
			return back()->withErrors(['email'=>'No account exist with this email! Please create new Account.'])->withInput(Input::except('password'));
		}
    }
	
	public function adminLogin(Request $request)
    {
		$this->validator($request->all())->validate();

		$emailExist = User::where(["email" => $request->email , 'is_deleted' => 0 , 'role_id' => 1 ])->first();

		if(!empty($emailExist))
		{
			if(Auth::attempt(array('email' => $request->email, 'password' => $request->password)))
			{
				if(Auth::user()->status == 1){
					return redirect('/');
				}else{
					return back()->withErrors(['email'=>'Please wait for admin approval.'])->withInput(Input::except('password'));
				}
			}
			else
			{
                return back()->withErrors(['password'=>'Wrong Password'])->withInput(Input::except('password'));
			}
		}
		else
		{
			return back()->withErrors(['email'=>'No account exist with this email! Please create new Account.'])->withInput(Input::except('password'));
		}
    }
	
}
