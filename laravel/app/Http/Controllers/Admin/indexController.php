<?php
namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use DB;
use Hash;
use App\Model\User;
use App\Model\Leads;
use App\Model\Project;
use App\Model\Library;
use App\Model\Country;
use Helper;

class indexController extends Controller
{
    public function index()
    {
		$data['userCount'] = User::where(['is_deleted' => 0 , 'role_id' => 2  ])->count();
		
		/*=====Mail Lead Detail======*/
		$data['mailLeadCount'] = Leads::where(['is_deleted' => 0 , 'leads_type' => 1,'leads_status' => 0])->count();
		if($data['mailLeadCount'] != 0){
			$data['mailLeads'] = Leads::select(DB::raw('*, COUNT(*) AS lead_count'))->with('user')->groupBy('designer_id')->where(['is_deleted' => 0 , 'leads_type' => 1 ,'leads_status' => 0])->get();
		}
		
		/*=====Phone Lead Detail======*/
		$data['phoneLeadCount'] = Leads::where(['is_deleted' => 0 , 'leads_type' => 0,'leads_status' => 0 ])->count();
		if($data['phoneLeadCount'] != 0){
			$data['phoneLeads'] = Leads::select(DB::raw('*, COUNT(*) AS lead_count'))->with('user')->groupBy('designer_id')->where(['is_deleted' => 0 , 'leads_type' => 0 ,'leads_status' => 0])->get();
		}
		
		$data['libraryCount'] = Library::where(['is_deleted' => 0  ])->count();
		
		/*====project Detail=======*/
		$data['activeProjectCount'] = Project::where(['is_deleted' => 0 , 'project_status' => 0 ])->count();
		if($data['activeProjectCount'] != 0){
			$data['activeprojects'] = Project::select(DB::raw('*, COUNT(*) AS pro_count'))->with('user')->groupBy('designer_id')->where(['is_deleted' => 0 ,'project_status' => 0 ])->get();
			
		}
		$data['projectCount'] = Project::where(['is_deleted' => 0  ])->count();
		if($data['projectCount'] != 0){
			$data['projects'] = Project::select(DB::raw('*, COUNT(*) AS pro_count'))->with('user')->groupBy('designer_id')->where(['is_deleted' => 0  ])->get();
			
		}
	
        return view("admin.index",$data);
    }

	protected function validator(array $data)
    {
        return Validator::make($data, [
            'name' => 'required',
            'email' => 'required|email',
            'contact' => 'required|min:10|numeric'
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
				'name' => $post['name'],
				'email' => $post['email'],
				'contact' => $post['contact']
			];
			User::where("id",$id)->update($userPost);
			
			return back()->with("success", "Profile updated successfully.");

		}

		$data['user'] = User::where(['is_deleted' => 0 , 'id' => $id ])->first();
		
		$data['country'] = Country::get();
        return view("admin.profile",$data);
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
        return view("admin.changePassword");
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
		
		return view("admin.profilePic",$data);
	}
	
	public function statistics(Request $request){
				
		$year = !empty($request->year)?$request->year:date('Y');
		$month = !empty($request->month)?$request->month:date('m');
		
		$newYearLeads = $newProject = [];
		for($i = 1; $i <= 12; $i++){
			$newYearLeads[] = [			
				"month" => date('M',strtotime("01-".$i."-".$year)),
				"newProjects" => Helper::newProjectCount($year,$i),
                //"newPhoneLeads" => Helper::newLeadsCount($year,$i),
                "newMailLeads" => (Helper::newLeadsCount($year,$i)+Helper::newLeadsCount($year,$i,1)),
			];
		}
		
		$newLeadsArr = [];
		for($i = 1; $i <= 30; $i++){			
			$newLeadsArr[] = [			
				"day" => $i." of ".date('M',strtotime("01-".$month."-".$year)),
				"newProjects" => Helper::newProjectMonthCount($year,$month,$i),
                //"newPhoneLeads" => Helper::newLeadsMonthCount($year,$month,$i),
                "newMailLeads" => (Helper::newLeadsMonthCount($year,$month,$i)+Helper::newLeadsMonthCount($year,$month,$i,1))
			];
		}
		
		$data['newYearLeads'] = $newYearLeads;
		$data['newLeadsArr'] = $newLeadsArr;
		$data['year'] = $year;
		$data['months'] = $month;
		$data['month'] = date('M',strtotime("01-".$month."-".$year));
		
		
		return view("admin.statistics",$data);
	}
	
	
}
