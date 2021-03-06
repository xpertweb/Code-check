<?php
namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use DB;
use App\Model\User;
use App\Model\Project;
use Helper; 
use MailHelper;
use Artisan;

class projectController extends Controller
{
    public function index()
    {
		$data['project'] = Project::with('user')->orderBy('project_id','desc')->where("is_deleted", "=", 0)->get();
        return view("admin.project.index",$data);
    }
	
	public function complete(Request $request){
		
		if (!empty($request->post()))
		{
			$post = $request->all();			
			Validator::make($post, [
				'project_complete' => 'required',
				'project_doc' => 'required|file|mimes:jpeg,png,zip,pdf'
			])->validate();
			
			if(!empty($post['project_doc'])){
				$project_doc = $request->file('project_doc');
				$OriginalName = Helper::OriginalName($project_doc->getClientOriginalName());				
				$input['imagename'] = $OriginalName.time().'.'.$project_doc->getClientOriginalExtension();
				
				$destinationPath =  Helper::generatePath(base_path('/uploads/project'));
				$getPath = Helper::getPath('/uploads/project');
				$uploaded = $project_doc->move($destinationPath, $input['imagename']);
				
				Project::where([
						'is_deleted' => 0,  
						'project_id' => $request->id   
					])->update([
						'project_complete' => $post['project_complete'],
						'project_doc' => $input['imagename'],
						'project_path' => $getPath,
						'project_status' => 1
					]);
					
					
				return redirect('admin/project-list')->with("success", "Project completed successfully.");
			}
			
			return back()->with("success", "Project add successfully.");

		}
		
		$data['project'] = Project::with('user')->orderBy('project_id','desc')->where(['is_deleted' => 0, 'project_id' => $request->id  ])->first();
	    return view("admin.project.complete",$data);
	}
	
	
	protected function validator(array $data)
    {
        return Validator::make($data, [
            'project_name' => 'required',
            // 'project_link' => 'required|url',
            //'client_email' => 'required|email',
            // 'client_phone' => 'required|min:10|numeric',
            // 'client_address' => 'required',
            // 'client_person' => 'required',
            'designer_id' => 'required',
            'projectAssigned' => 'required',
            'projectCapacity' => 'required',
            // 'project_prices' => 'required'
        ]);
    } 
	

	public function add(Request $request)
    {
		if (!empty($request->post()))
		{
			$post = $request->all();			
			$this->validator($post)->validate();			
			$post['created_at'] = date('Y-m-d H:i:s');
			
			if($post['projectAssigned'] >= $post['projectCapacity']){
				return back()->with("error", "Designer Project capacity is less than project Assigned.");			
			}
			
			unset($post['_token']);
			Project::insert($post);			
			
			//send email code
			
			$designerEmail = Helper::designerOption('email',$post['designer_id']);	
			$post['name'] = Helper::designerOption('name',$post['designer_id']);			
			$message="";  
			$view="mail.admin.addProject";
			$subject="Add New project";
			
			$mail_data=[ 'message' => $message, 'email'=>$designerEmail,'subject'=>$subject,'view' => $view];
			try{
				$MailHelper = MailHelper::mailSend($mail_data,$post);
			}
			catch (Exception $e){}
			
			//send mailcode
			
			return back()->with("success", "Project added successfully.");

		}
		
		$where = [
			'users.status' => 1,
			'users.is_deleted' => 0
		];
		$data['user'] = User::where($where)->whereIn('role_id',[2,3])->get();
		
        return view("admin.project.add",$data);
    }

	public function edit(Request $request)
    {		
		if (!empty($request->post()))
		{
			$post = $request->all();
			$this->validator($post)->validate();
			
			if(!empty($post['projectAssigned']) && !empty($post['projectCapacity'])){
				if(($post['projectAssigned'] >= $post['projectCapacity'])){
					return back()->with("error", "Designer Project capacity is less than project Assigned.");
				}
			}
			
			unset($post['_token']);
			unset($post['projectAssigned']);
			unset($post['projectCapacity']);
			Project::where("project_id",$request->id)->update($post);
			
			//send email code
			
			$designerEmail = Helper::designerOption('email',$post['designer_id']);	
			$post['name'] = Helper::designerOption('name',$post['designer_id']);			
			$message="";  
			$view="mail.admin.addProject";
			$subject="Update project Information";
			
			$mail_data=[ 'message' => $message, 'email'=> $designerEmail, 'subject'=>$subject, 'view' => $view];
			try{
				$MailHelper = MailHelper::mailSend($mail_data,$post);
			}
			catch (Exception $e){}
			
			//send mailcode
			
			return back()->with("success", "Project updated successfully.");

		}
		
		$where = [
			'users.status' => 1,
			'users.is_deleted' => 0
		];
		$data['user'] = User::where($where)->whereIn('role_id',[2,3])->get();
		$data['project'] = Project::with('user')->orderBy('project_id','desc')->where("project_id", "=", $request->id)->first();
        return view("admin.project.edit",$data);
    }

	public function delete(Request $request)
    {		
		if (!empty($request->id))
		{
			Project::where("project_id",$request->id)->update(['is_deleted' => 1]);
			return redirect()->back()->with("error", "Project deleted successfully.");
		}
    }

	public function view(Request $request)
    {
		$data['project'] = Project::with('user','user.designer')->orderBy('project_id','desc')->where(["is_deleted" => 0 , 'project_id' => $request->id ])->first();
		return view("admin.project.view",$data);
    }	

	public function active()
    {
		$data['project'] = Project::with('user')->orderBy('project_id','desc')->where("is_deleted", "=", 0)->where("project_status", "=", 0)->get();
        return view("admin.project.active",$data);
    }

	public function completed()
    {		
		$data['project'] = Project::with('user')->orderBy('project_id','desc')->where("is_deleted", "=", 0)->where("project_status", "=", 1)->get();
        return view("admin.project.completed",$data);
    }
	
	public function status(Request $request)
    {
		if (!empty($request->post()))
		{
			$post = $request->all();
			if(!empty($post['project_id']) && !empty($post['status'])){
				
				Project::where("project_id",$post['project_id'])->update(['project_status' => $post['status'] ]);
				if($post['status'] == 1){
					$buttonData = '<a href="javascript:void(0)" class="btn green">Completed</a>';
					$disMess = "Completed";
				}
				
				return response()->json(['message'=> 'Status updated successfully.' , 'data' => $buttonData , 'disMess' => $disMess ],200); 
			}else{
				return response()->json(['message'=> 'Something went wrong'],400); 
			}
	
		}
    }
	
	public function selectDesigner(Request $request)
    {
		if (!empty($request->post()))
		{
			$post = $request->all();
			if(!empty($post['user_id'])){
				
				$user = User::with('designer')->where("id",$post['user_id'])->first();
				$totalProject = Project::where("designer_id",$post['user_id'])->where("project_status",0)->count();

				$sendData = [
					'capacity' => $user->designer->capacity,
					'totalProject' => ($totalProject>0)?$totalProject:1,
				];
				return response()->json([ 'data' => $sendData  ],200); 
			}else{
				return response()->json(['message'=> 'Something went wrong'],400); 
			}
	
		}
    }
	



}
