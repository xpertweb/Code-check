<?php
namespace App\Http\Controllers\Designer;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use DB;
use Hash;
use App\Model\User;
use App\Model\Country;
use App\Model\Leads;
use App\Model\Project;
use App\Model\Designer;
use App\Model\Library;
use Helper;

class indexController extends Controller
{
    public function index()
    {
		$id = Auth::User()->id;
		$data['role_id'] = Helper::userRole();
		if($data['role_id'] == 2){
			$data['mailLeadCount'] = Leads::where(['is_deleted' => 0 , 'leads_type' => 1 ,'leads_status'=>0, 'designer_id' => $id ])->count();
			$data['phoneLeadCount'] = Leads::where(['is_deleted' => 0 , 'leads_type' => 0 ,'leads_status'=>0, 'designer_id' => $id ])->count();
			$data['projectCount'] = Project::where(['is_deleted' => 0 , 'designer_id' => $id,'project_status'=>0 ])->count();
			$data['progressProjectCount'] = Project::where(['is_deleted' => 0 ,'project_status'=>0, 'project_status' => 0, 'designer_id' => $id ])->count();
			
			
			$data['mailLeads'] = Leads::orderBy(DB::raw("DATE(reminder)"), 'asc')->where(['is_deleted' => 0 , 'leads_status' => 0 ,'leads_type' => 1 , 'designer_id' => $id ])->get();
			$data['phoneLeads'] = Leads::orderBy(DB::raw("DATE(reminder)"), 'asc')->where(['is_deleted' => 0 , 'leads_status' => 0 ,'leads_type' => 0 , 'designer_id' => $id ])->get();
			$data['projects'] = Project::orderBy(DB::raw("DATE(reminder)"), 'asc')->where(['is_deleted' => 0 , 'project_status' => 0, 'designer_id' => $id ])->get();
			
		}else{ 
		
			$data['mailLeadCount'] = Leads::where(['is_deleted' => 0 ,'leads_status'=>0, 'leads_type' => 1 ])->count();
			$data['phoneLeadCount'] = Leads::where(['is_deleted' => 0 ,'leads_status'=>0, 'leads_type' => 0 ])->count();
			$data['projectCount'] = Project::where(['is_deleted' => 0,'project_status'=>0])->count();
			$data['progressProjectCount'] = Project::where(['is_deleted' => 0 ,'project_status'=>0, 'project_status' => 0 ])->count();
			
			$data['mailLeads'] = Leads::orderBy(DB::raw("DATE(reminder)"), 'asc')->where(['is_deleted' => 0 , 'leads_status' => 0 ,'leads_type' => 1 , 'designer_id' => $id ])->get();
			$data['phoneLeads'] = Leads::orderBy(DB::raw("DATE(reminder)"), 'asc')->where(['is_deleted' => 0 , 'leads_status' => 0 ,'leads_type' => 0 , 'designer_id' => $id ])->get();
			$data['projects'] = Project::orderBy(DB::raw("DATE(reminder)"), 'asc')->where(['is_deleted' => 0 , 'project_status' => 0, 'designer_id' => $id ])->get();
			
		}
        return view("designer.index",$data);
    }
	
	public function status(Request $request)
    {
		if (!empty($request->post()))
		{
			$post = $request->all();
			if(!empty($post['leads_id']) && !empty($post['status'])){
				
				
				Leads::where("leads_id",$post['leads_id'])->update(['leads_status' => $post['status'] ]);
				
				if($post['status'] == 1){
					$buttonData = '<a href="javascript:void(0)" class="btn btn-xs green">'.__('messages.accepted').'</a>';
					$Leads = Leads::where("leads_id",$post['leads_id'])->first();
					$Designer = Designer::where("designer_id",$Leads->designer_id)->first();
					$totalProject = Project::where("designer_id",$Leads->designer_id)->where("project_status",0)->count();
				
					$postProject = [
						'designer_id' => $Leads->designer_id,
						'project_name' => $Leads->leads_name,
						'project_link' => $Leads->leads_link,
						'client_email' => $Leads->client_email,
						'client_phone' => $Leads->client_phone,
						'client_vat' => $Leads->client_vat,
						'client_address' => $Leads->client_address,
						'client_person' => $Leads->client_person,
						'projects_type' => $Leads->leads_type,
						'projectAssigned' => $totalProject,
						'projectCapacity' => $Designer->capacity,
						'comment' => $Leads->comment,
						'project_status' => 0,
						'created_at' => date('Y-m-d H:i:s'),
					];
					
					Project::insert($postProject);
				}else{
					$buttonData = '<a href="javascript:void(0)" class="btn btn-xs red">'.__('messages.rejected').'</a>';
				}
				
				return response()->json(['message'=> 'Status updated successfully.' , 'data' => $buttonData ],200); 
			}else{
				return response()->json(['message'=> 'Something went wrong'],400); 
			}
	
		}
    }

	
	public function addReminder(Request $request){		
		if(!empty($request->id)){			
			$projects = Project::where(['is_deleted' => 0 , 'project_id' => $request->id ])->first();
			//echo !empty($projects->reminder)?date('d-m-Y',strtotime($projects->reminder)):'';
			$data=!empty($projects->reminder)?date('d-m-Y',strtotime($projects->reminder)):'';
			$text=!empty($projects->reminder_text)?$projects->reminder_text:'';
			return response()->json(['reminder' =>$data, 'text' => $text]);
		}		
	}
	
	public function addLeadReminder(Request $request){		
		if(!empty($request->id)){			
			$lead = Leads::where(['is_deleted' => 0 , 'leads_id' => $request->id ])->first();
			$data=!empty($lead->reminder)?date('d-m-Y',strtotime($lead->reminder)):'';
			$text=!empty($lead->reminder_text)?$lead->reminder_text:'';
			return response()->json(['reminder' =>$data, 'text' => $text]);
		}		
	}
	
	public function updateProReminder(Request $request){		
		if (!empty($request->post()))
		{
			$post = $request->all();
			$userPost = [
				'reminder' => date('Y-m-d', strtotime($post['reminder'])),
				'reminder_text' => $post['reminder_text']
			];
			Project::where("project_id",$post['project_id'])->update($userPost);
			return back()->with("success", "Reminder Updated");
		}		
	}
	
	public function updateLeadReminder(Request $request){
		if (!empty($request->post()))
		{
			$post = $request->all();
			$userPost = [
				'reminder' => date('Y-m-d', strtotime($post['reminder'])),
				'reminder_text' => $post['reminder_text']
			];
			Leads::where("leads_id",$post['leads_id'])->update($userPost);
			return back()->with("success", "Reminder Updated");
		}
	}
	
	protected function validator(array $data)
    {
        return Validator::make($data, [
            'first_name' => 'required',
            'last_name' => 'required',
            'contact' => 'required|min:10|numeric',
            'gender' => 'required'
        ]);
    }
	
	protected function passValidator(array $data)
    {
        return Validator::make($data, [
            'old_password' => 'required',
            'password' => 'required|min:6',
            'confirm_password' => 'required_with:password|same:password|min:6'
        ]);
    }
	
	public function profile(Request $request)
    {
		$id = Auth::User()->id;
		
		if (!empty($request->post()))
		{
			$post = $request->all();			
			$this->validator($post)->validate();
		
			$userPost = [
				'name' => $post['first_name'].' '.$post['last_name'],
				'contact' => $post['contact']
			];
			User::where("id",$id)->update($userPost);
			
			$designerPost = [
				'first_name' => $post['first_name'],
				'last_name' => $post['last_name'],
				'gender' => $post['gender'],
				'dob' => $post['dob'],
				'city' => $post['city'],
				'country' => $post['country'],
				'description' => $post['description'],
				'capacity' => $post['capacity'],
				'is_lead_accept' => $post['is_lead_accept']
			];
			Designer::where("designer_id",$id)->update($designerPost);
			return back()->with("success", "Profile updated successfully.");

		}
		
		$data['user'] = User::where(['is_deleted' => 0 , 'id' => $id ])->first();
		
		$data['country'] = Country::get();
        return view("designer.profile",$data);
    }
	
	public function updateCapacityLead(Request $request)
    {
		$id = Auth::User()->id;
		
		if (!empty($request->post()))
		{
			$post = $request->all();
			unset($post['_token']);
			Designer::where("designer_id",$id)->update($post);			
			return response()->json(['status' => '1', 'message' => 'Information updated successfully.'],200);
		}
    }

	public function changePassword(Request $request)
    {
		$id = Auth::User()->id;
		if(!empty($request->post())){
			$post = $request->all();
			$this->passValidator($post)->validate();
			
			$user = User::where(['is_deleted' => 0, 'id' => $id ])->first();
			
			if(Hash::check($post['old_password'], $user->password)){
				User::where(['is_deleted' => 0, 'id' => $id ])->update(['password' => Hash::make($post['password']) ]);
				return back()->with("success", "Password updated successfully.");
			}else{
				return back()->with("error", "Old password is wrong.");
			}
		}
        return view("designer.changePassword");
    }

	public function profilePic(Request $request){
		
		$id = Auth::User()->id;
		if (!empty($request->post()))
		{
			$post = $request->all();
			
			if(!empty($post['profile_img'])){
				$profile_img = $request->file('profile_img');
				$OriginalName = Helper::OriginalName($profile_img->getClientOriginalName());				
				$input['imagename'] = $OriginalName.time().'.'.$profile_img->getClientOriginalExtension();
				$destinationPath = base_path('/uploads/profile');
				$uploaded = $profile_img->move($destinationPath, $input['imagename']);
				User::where(['is_deleted' => 0, 'id' => $id ])->update(['profile_img' => $input['imagename'] ]);
				return back()->with("success", "Profile pic updated successfully.");
			}else{
				return back()->with("error", "Please select the profile pic to upload.");
			}			
		}
		
		$data['user'] = User::where(['is_deleted' => 0 , 'id' => $id ])->first();
		
		return view("designer.profilePic",$data);
	}

}
