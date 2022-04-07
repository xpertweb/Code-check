<?php
namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use DB;
use Hash;
use App\Model\User;
use App\Model\Designer;
use Helper;
use MailHelper;
use Artisan;

class subadminController extends Controller
{ 
    public function index()
    {
		$data['user'] = User::with('designer')->where(['is_deleted' => 0 , 'role_id' => 3])->get();		
        return view("admin.subadmin.index",$data);
    }
	
	protected function validator(array $data)
    {
        return Validator::make($data, [
            'first_name' => 'required',
            'last_name' => 'required',
            'email' => 'required|email|unique:users',
            'contact' => 'required|min:10|numeric',
            'password' => 'required|min:6',
            'confirm_password' => 'required_with:password|same:password|min:6'
        ]);
    }

	public function add(Request $request)
    {
		if (!empty($request->post()))
		{
			$post = $request->all();			
			$this->validator($post)->validate();
			
			$userPost = [
				'name' => $post['first_name'].' '.$post['last_name'],
				'email' => $post['email'],
				'password' => Hash::make($post['password']),
				'role_id' => 3,
				'contact' => $post['contact'],
				'profile_img' => '',
				'remember_token' => '',
				'status' => 1,
				'is_deleted' => 0,
				'created_at' => date("Y-m-d H:i:s")
			];

			$user_id = User::insertGetId($userPost);
			if(!empty($user_id)){
				$designerPost = [
					'designer_id' => $user_id,
					'first_name' => $post['first_name'],
					'last_name' => $post['last_name'],
					'gender' => 1,
					'dob' => '',
					'city' => '',
					'state' => '',
					'country' => '',
					'description' => '',
					'capacity' => $post['capacity'],
					'is_lead_accept' => $post['is_lead_accept'],
					'created_at' => date("Y-m-d H:i:s")
				];
				Designer::insert($designerPost);
				
				//send email code			
				$message="";
				$view="mail.admin.addDesigner";
				$subject="Add New Admin";
				
				$mail_data=[ 'message' => $message, 'email'=> $post['email'] ,'subject' => $subject, 'view' => $view];
				try{
					$MailHelper = MailHelper::mailSend($mail_data,$post);
				}
				catch (Exception $e){}
				
				//send mailcode
				
				return back()->with("success", "Admin inserted successfully.");
			}else{
				return back()->with("error", "Something went wrong.");
			}			

		}		
        return view("admin.subadmin.add");
    }

	public function edit(Request $request)
    {		
		if (!empty($request->post()))
		{
			$post = $request->all();
			$userPost = [
				'name' => $post['first_name'].' '.$post['last_name'],
				'email' => $post['email'],
				'contact' => $post['contact'],
				'status' => 1
			];

			User::where("id",$request->id)->update($userPost);
			
			
			$designerPost = [
				'first_name' => $post['first_name'],
				'last_name' => $post['last_name'],
				'capacity' => $post['capacity'],
				'is_lead_accept' => $post['is_lead_accept']
			];
			Designer::where("designer_id",$request->id)->update($designerPost);
			
			return back()->with("success", "Admin information updated successfully.");		

		}
		$data['user'] = User::with('designer')->where("id", "=", $request->id)->first();
        return view("admin.subadmin.edit",$data);
    }

	public function delete(Request $request)
    {		
		if (!empty($request->id))
		{
			User::where("id",$request->id)->update(['is_deleted' => 1 , 'status' => 2 ]);
			return redirect()->back()->with("error", "Admin deleted successfully.");
		}
    }	
	
	public function view(Request $request)
    {
		$data['user'] = User::with('designer')->where([ 'id' => $request->id ])->first();
        return view("admin.subadmin.view",$data);
    }
	
	public function status(Request $request)
    {		
		if (!empty($request->post()))
		{
			$post = $request->all();
			if(!empty($post['user_id']) && !empty($post['status'])){
				
				User::where("id",$post['user_id'])->update(['status' => $post['status'] ]);
				if($post['status'] == 1){
					$buttonData = '<a href="javascript:void(0)" rel="2" id="'.$post['user_id'].'" class="btn red userStatus">Disapprove</a>';
				}else{
					$buttonData = '<a href="javascript:void(0)" rel="1" id="'.$post['user_id'].'" class="btn blue userStatus">Approve</a>';
				}				
				return response()->json(['message'=> 'Status updated successfully.' , 'data' => $buttonData ],200); 
			}else{
				return response()->json(['message'=> 'Something went wrong'],400); 
			}
		
		}
    }	

	public function active()
    {
		$data['user'] = User::with('designer')->where("role_id", "=", 3)->where("status", "=", 1)->get();
        return view("admin.subadmin.active",$data);
    }

	public function inactive()
    {
		$data['user'] = User::with('designer')->where("role_id", "=", 3)->where("status", "=", 2)->get();
        return view("admin.subadmin.inactive",$data);
    }
	
	public function downgrade(Request $request){
		
		User::where("id",$request->id)->update(['role_id' => 2]);
		return back()->with("success", "Admin downgrade to designer successfully.");
		
	}
	



}
