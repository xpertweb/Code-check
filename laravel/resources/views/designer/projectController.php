<?php
namespace App\Http\Controllers\Designer;
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
		$designer_id = Auth::user()->id;
		$data['role_id'] = Helper::userRole();
		if($data['role_id'] == 2){
			$data['project'] = Project::with('user')->orderBy('project_id','desc')->where(['is_deleted' => 0, 'designer_id' => $designer_id  ])->get();
		}else{
			$data['project'] = Project::with('user')->orderBy('project_id','desc')->where(['is_deleted' => 0  ])->get();
		}
        return view("designer.project.index",$data);
    }
	
	public function completeUpdate(Request $request){
		
		if(!empty($request->id)){
			
			Project::where([
				'is_deleted' => 0,  
				'project_id' => $request->id   
			])->update([
				'project_status' => 1
			]);
				
			//send email code
			
			$Project = Project::where(['project_id' => $request->id ])->first();
			$message = "";
			$adminEmail = 'mail@ravn-hjemmesider.dk';
			$view = "mail.designer.completeProject";
			$subject = "Project Completed";	
			$adminemail =  config("mail.from.address");
			$mail_data = [ 'message' => $message, 'email'=> $adminEmail ,'subject' => $subject, 'view' => $view  ];
			
			try
			{
				$MailHelper = MailHelper::mailSend($mail_data,$Project);
				
				if($MailHelper)
				{
					return redirect('active-project-list')->with("success", "Project completed successfully. Mail Send to admin.");
				}
				else
				{
					return redirect('active-project-list')->with("success", "Project completed successfully. Somthing went wrong to send an email.");
				}
			}
			catch (\Exception $e)
			{
				// print_r($e->getMessage());
				return redirect('active-project-list')->with("success", $e->getMessage());
			}			
				
					
			return back()->with("success", "Project completed successfully.");

		}
	}
	
	public function complete(Request $request){
		
		$designer_id = Auth::user()->id;
		
		if (!empty($request->post()))
		{
			$post = $request->all();			
			Validator::make($post, [
				'project_name' => 'required',
				'project_link' => 'required|url',
				'client_email' => 'required|email',
				'client_phone' => 'required|min:10|numeric',
				'client_address' => 'required',
				'client_vat' => 'required',				
				'client_person' => 'required',
				'project_prices' => 'required',
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
						'designer_id' => $designer_id , 
						'project_id' => $request->id   
					])->update([
						'project_name' => $post['project_name'],
						'project_link' => $post['project_link'],
						'client_email' => $post['client_email'],
						'client_phone' => $post['client_phone'],
						'client_vat' => $post['client_vat'],
						'client_address' => $post['client_address'],
						'client_person' => $post['client_person'],
						'project_prices' => $post['project_prices'],
						'comment' => $post['comment'],
						'project_doc' => $input['imagename'],
						'project_path' => $getPath,
						'project_status' => 1
					]);
					
				//send email code
				
				$Project = Project::where(['project_id' => $request->id ])->first();
				$message = "";
				$path = asset($getPath.'/'.$input['imagename']);
				$view = "mail.designer.completeProject";
				$subject = "Project Completed";	
				$adminemail =  config("mail.from.address");
				$mail_data = [ 'message' => $message, 'email'=> 'mail@ravn-hjemmesider.dk' ,'subject' => $subject, 'view' => $view , 'path' => $path ];
				// $mail_data = [ 'message' => $message, 'email'=> 'test.dev788@gmail.com' ,'subject' => $subject, 'view' => $view , 'path' => $path ];
				
				try
				{
					$MailHelper = MailHelper::mailSend($mail_data,$Project);
					
					if($MailHelper)
					{
						return redirect('active-project-list')->with("success", "Project completed successfully. Mail Send to admin.");
					}
					else
					{
						return redirect('active-project-list')->with("success", "Project completed successfully. Somthing went wrong to send an email.");
					}
				}
				catch (\Exception $e)
				{
					// print_r($e->getMessage());
					return redirect('active-project-list')->with("success", $e->getMessage());
				}			
				
			}			
			return back()->with("success", "Project completed successfully.");

		}
		
		$data['project'] = Project::with('user')->where(['is_deleted' => 0, 'designer_id' => $designer_id , 'project_id' => $request->id  ])->first();
	    return view("designer.project.complete",$data);
	}
	
	protected function validator(array $data)
    {
        return Validator::make($data, [
            'project_name' => 'required',
            // 'project_link' => 'required|url',
            'client_email' => 'required|email',
            'client_phone' => 'required|min:10|numeric',
            // 'client_address' => 'required',
            // 'client_person' => 'required',
            'designer_id' => 'required',
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
			unset($post['_token']);
			Project::insert($post);
			return back()->with("success", "Project added successfully.");

		}
		
		$where = [
			'users.status' => 1,
			'users.is_deleted' => 0
		];
		$data['user'] = User::where($where)->whereIn('role_id',[2,3])->get();
		
		$data['designer_id'] = Helper::userID();
		
        return view("designer.project.add",$data);
    }

	public function edit(Request $request)
    {		
		if (!empty($request->post()))
		{
			$post = $request->all();
			$this->validator($post)->validate();			
			unset($post['_token']);
			Project::where("project_id",$request->id)->update($post);
			return back()->with("success", "Project updated successfully.");

		}
		$where = [
			'users.status' => 1,
			'users.is_deleted' => 0
		];
		$data['user'] = User::where($where)->whereIn('role_id',[2,3])->get();
		$data['project'] = Project::with('user')->where("project_id", "=", $request->id)->first();
        return view("designer.project.edit",$data);
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
		$data['project'] = Project::with('user')->where(["is_deleted" => 0 , 'project_id' => $request->id ])->first();
		return view("designer.project.view",$data);
    }	

	public function active()
    {
		$designer_id = Auth::user()->id;
		$role_id = Helper::userRole();
		if($role_id == 2){
			$data['project'] = Project::with('user')->orderBy('project_id','desc')->where(['is_deleted' => 0, 'designer_id' => $designer_id ,"project_status" => 0 ])->get();
		}else{
			$data['project'] = Project::with('user')->orderBy('project_id','desc')->where(['is_deleted' => 0 ,"project_status" => 0 ])->get();
		}
		
        return view("designer.project.active",$data);
    }

	public function completed()
    {
		$designer_id = Auth::user()->id;
		$role_id = Helper::userRole();
		if($role_id == 2){
			$data['project'] = Project::with('user')->orderBy('project_id','desc')->where(['is_deleted' => 0, 'designer_id' => $designer_id ,"project_status" => 1 ])->get();
		}else{
			$data['project'] = Project::with('user')->orderBy('project_id','desc')->where(['is_deleted' => 0 ,"project_status" => 1 ])->get();
		}
		
        return view("designer.project.completed",$data);
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
					'totalProject' => $totalProject
				];
				return response()->json([ 'data' => $sendData  ],200); 
			}else{
				return response()->json(['message'=> 'Something went wrong'],400); 
			}
	
		}
    }
	



}
