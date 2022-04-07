<?php
namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use DB;
use App\Model\User;
use App\Model\Designer;
use App\Model\Leads;
use App\Model\Project;
use Helper;
use MailHelper;
use Artisan;

class leadsController extends Controller
{
    public function index()
    {
		$data['leads'] = Leads::with('user')->orderBy('leads_id','DESC')->where("is_deleted", "=", 0)->get();
		
        return view("admin.leads.index",$data);
    }
	
	protected function validator(array $data)
    {
        return Validator::make($data, [
            'leads_name' => 'required',
            //'client_phone' => 'required|min:10|numeric',
        ]);
    }

	public function add(Request $request)
    {
		if (!empty($request->post()))
		{
			$post = $request->all();			
			$this->validator($post)->validate();
			
			unset($post['_token']);
			$post['created_at'] = date('Y-m-d H:i:s');
			
			Leads::insert($post);
			
			//send email code
			
			$designerEmail = Helper::designerOption('email',$post['designer_id']);	
			$post['name'] = Helper::designerOption('name',$post['designer_id']);			
			$message = "";  
			$view = "mail.admin.addLead";
			$subject = "Add New Lead";
			
			$mail_data = [ 'message' => $message, 'email' => $designerEmail, 'subject' => $subject, 'view' => $view];
			try{
				$MailHelper = MailHelper::mailSend($mail_data,$post);
			}
			catch (Exception $e){}
			
			//send mailcode
			
			return back()->with("success", "Lead added successfully.");

		}
		
		$where = [
			'pro_designer.is_lead_accept' => 1,
			'users.status' => 1,
			//'users.role_id' => 2,
			'users.is_deleted' => 0
		];
		
		$data['user'] = User::select('pro_designer.designer_id','users.name')->leftJoin('pro_designer', function($join) {
							$join->on('users.id', '=', 'pro_designer.designer_id');
						})->whereIn('role_id',[2,3])->where($where)->get();
						
        return view("admin.leads.add",$data);
    }

	public function addMail(Request $request)
    {
		if (!empty($request->post()))
		{
			$post = $request->all();			
			$this->validator($post)->validate();
			
			unset($post['_token']);
			$post['created_at'] = date('Y-m-d H:i:s');
			
			Leads::insert($post);
			
			//send email code
			
			$designerEmail = Helper::designerOption('email',$post['designer_id']);	
			$post['name'] = Helper::designerOption('name',$post['designer_id']);			
			$message = "";  
			$view = "mail.admin.addLead";
			$subject = "Add New Lead";
			
			$mail_data = [ 'message' => $message, 'email' => $designerEmail, 'subject' => $subject, 'view' => $view];
			try{
				$MailHelper = MailHelper::mailSend($mail_data,$post);
			}
			catch (Exception $e){}
			
			//send mailcode
			
			return back()->with("success", "Lead added successfully.");

		}
		
		$where = [
			'pro_designer.is_lead_accept' => 1,
			'users.status' => 1,
			// 'users.role_id' => 2,
			'users.is_deleted' => 0
		];
		
		$data['user'] = User::select('pro_designer.designer_id','users.name')->leftJoin('pro_designer', function($join) {
							$join->on('users.id', '=', 'pro_designer.designer_id');
						})->whereIn('role_id',[2,3])->where($where)->get();
						
        return view("admin.leads.addMail",$data);
    }

	public function edit(Request $request)
    {		
		if (!empty($request->post()))
		{
			$post = $request->all();
			$this->validator($post)->validate();			
			unset($post['_token']);	
			Leads::where("leads_id",$request->id)->update($post);
			
			//send email code
			
			$designerEmail = Helper::designerOption('email',$post['designer_id']);	
			$post['name'] = Helper::designerOption('name',$post['designer_id']);			
			$message = "";  
			$view = "mail.admin.addLead";
			$subject = "Update Lead Information";
			
			$mail_data = [ 'message' => $message, 'email' => $designerEmail, 'subject' => $subject, 'view' => $view];
			try{
				$MailHelper = MailHelper::mailSend($mail_data,$post);
			}
			catch (Exception $e){}
			
			//send mailcode
			
			return back()->with("success", "Lead updated successfully.");

		}
		$where = [
			'pro_designer.is_lead_accept' => 1,
			'users.status' => 1,
			//'users.role_id' => 2,
			'users.is_deleted' => 0
		];
		
		$data['user'] = User::select('pro_designer.designer_id','users.name')->leftJoin('pro_designer', function($join) {
							$join->on('users.id', '=', 'pro_designer.designer_id');
						})->whereIn('role_id',[2,3])->where($where)->get();
		$data['leads'] = Leads::with('user')->where("leads_id", "=", $request->id)->first();
        return view("admin.leads.edit",$data);
    }

	public function delete(Request $request)
    {		
		if (!empty($request->id))
		{
			Leads::where("leads_id",$request->id)->update(['is_deleted' => 1]);
			return redirect()->back()->with("error", "Lead deleted successfully.");
		}
    }
	
	public function status(Request $request)
    {
		if (!empty($request->post()))
		{
			$post = $request->all();
			if(!empty($post['leads_id']) && !empty($post['status'])){				
				
				Leads::where("leads_id",$post['leads_id'])->update(['leads_status' => $post['status'] ]);
				
				if($post['status'] == 1){
					$buttonData = '<a href="javascript:void(0)" class="btn green">'.__('messages.accepted').'</a>';
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
					
					//send email code
					
					$designerEmail = Helper::designerOption('email',$Leads->designer_id);		
					$message="";  
					$view="mail.admin.addProject";
					$subject="Add project Information";
					
					$mail_data=[ 'message' => $message, 'email'=> $designerEmail, 'subject'=>$subject, 'view' => $view];
					try{
						//$post = json_decode( json_encode($Designer , true ) , true );						
						$postProject['name'] = Helper::designerOption('name',$Leads->designer_id);		
						$MailHelper = MailHelper::mailSend($mail_data,$postProject);
					}
					catch (Exception $e){}
					
					//send mailcode
					
				}else{
					$buttonData = '<a href="javascript:void(0)" class="btn red">'.__('messages.rejected').'</a>';
				}
				
				return response()->json(['message'=> 'Status updated successfully.' , 'data' => $buttonData ],200); 
			}else{
				return response()->json(['message'=> 'Something went wrong'],400); 
			}
	
		}
    }

	public function active()
    {
		$data['leads'] = Leads::with('user')->orderBy('leads_id','DESC')->where("is_deleted", "=", 0)->where("leads_status", "=", 0)->get();
        return view("admin.leads.active",$data);
    }
	
	public function rejected()
    {
		$data['leads'] = Leads::with('user')->orderBy('leads_id','DESC')->where("is_deleted", "=", 0)->where("leads_status", "=", 2)->get();
        return view("admin.leads.rejected",$data);
    }
	
	public function view(Request $request)
    {
		$data['leads'] = Leads::with('user','user.designer')->where(["is_deleted" => 0 , 'leads_id' => $request->id ])->first();
        return view("admin.leads.view",$data);
    }

	public function completed()
    {		
		$data['leads'] = Leads::with('user')->orderBy('leads_id','DESC')->where("is_deleted", "=", 0)->where("leads_status", "=", 1)->get();
        return view("admin.leads.completed",$data);
    }
	


}
