<?php 
namespace App\Helpers;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use DB;
use App\Model\User;
use App\Model\Option;
use App\Model\Designer;
use App\Model\Leads;
use App\Model\Project;
use Session;
use Request;

class GlobalFunctions
{	
	public static function userID()
	{
		return Auth::user()->id;
	}
	public static function userRole()
	{
		return Auth::user()->role_id;
	}
	public static function adminOption($option)
	{
		return User::where("role_id",1)->pluck($option)->first();
	}
	public static function designerOption($option,$id)
	{
		return User::where([ 'id' => $id ])->pluck($option)->first();	
	}	
	public static function designerTable($option,$id)
	{
		return Designer::where(['designer_id' => $id ])->pluck($option)->first();	
	}
	public static function getNames($roleID=2)
	{
		return User::where("role_id",$roleID)->select('id','name')->get();
	}

	public static function siteOption($key)
	{
		return Option::where("option_key",$key)->pluck("option_value")->first();
	}

	public static function newProjectCount($year,$month)
	{
		$timeFrom = date("Y-m-d", strtotime($year.'-'.$month.'-01'));
		$timeTo = date("Y-m-t", strtotime($timeFrom));
		$recordsTotal = Project::whereBetween('created_at',[$timeFrom, $timeTo] )->where('is_deleted',0)->count();
		return $recordsTotal;
	}

	public static function newLeadsCount($year,$month,$type=0)
	{
		$timeFrom = date("Y-m-d", strtotime($year.'-'.$month.'-01'));
		$timeTo = date("Y-m-t", strtotime($timeFrom));
		$recordsTotal = Leads::whereBetween('created_at',[$timeFrom, $timeTo] )->where('is_deleted',0)->where('leads_type',$type)->count();
		return $recordsTotal;
	}
	
	public static function newProjectMonthCount($year,$month,$date){
		$timeFrom = date("Y-m-d", strtotime($year.'-'.$month.'-'.$date));
		$recordsTotal = Project::whereBetween('created_at',[$timeFrom." 00:00:00", $timeFrom." 23:59:59"] )->where('is_deleted',0)->count();
		return $recordsTotal;
	}
	
	public static function newLeadsMonthCount($year,$month,$date,$type=0){
		$timeFrom = date("Y-m-d", strtotime($year.'-'.$month.'-'.$date));
		$recordsTotal = Leads::whereBetween('created_at',[$timeFrom." 00:00:00", $timeFrom." 23:59:59"] )->where('is_deleted',0)->where('leads_type',$type)->count();
		return $recordsTotal;
	}

	public static function differnceTwoTimesInMins($from,$to)
	{
		$to = strtotime($to); 
		$from = strtotime($from);
		$timeDiff = $to - $from;
		return round(abs($to - $from) / 60,2);
	}

	public static function differnceTwoDates($from,$to)
	{
		$to = strtotime($to); 
		$from = strtotime($from);
		$datediff = $to - $from;
		return round($datediff / (60 * 60 * 24));
	}

	public static function differenceOfHours($from,$to)
	{
		$from = strtotime($from);
		$to = strtotime($to);
		return ($to-$from)/3600;
	}
	
	public static function generatePath($path)
	{
		$year = date('Y');
		$month = date('M');
		
		if(!file_exists($path.'/'.$year)){
			mkdir($path.'/'.$year,0777);
		}
		if(!file_exists($path.'/'.$year.'/'.$month)){
			mkdir($path.'/'.$year.'/'.$month,0777);
		}
		return $path.'/'.$year.'/'.$month;
		
	}
	
	public static function getPath($path)
	{
		$year = date('Y');
		$month = date('M');
		return $path.'/'.$year.'/'.$month;
		
	}

	public static function translation($key_lang)
	{
		 $translate_type = (Session::get('translate_type'))?Session::get('translate_type'):2;
		 
		 if($translate_type == 2)
		 {
			 $key_lang = (isset(config('translate')[$key_lang]))?config('translate')[$key_lang]:$key_lang;
		 } 

		 return $key_lang;
		
	}

	public static function projectRoute(){
		echo ( Request::routeIs('admin-add-project') || Request::routeIs('admin-project-list') || Request::routeIs('admin-active-project-list') || Request::routeIs('admin-completed-project-list') || Request::routeIs('admin-view-project') || Request::routeIs('admin-edit-project')) ? 'open' : '';
	}
	
	public static function projectStyleRoute(){
		return ( Request::routeIs('admin-add-project') || Request::routeIs('admin-project-list') || Request::routeIs('admin-active-project-list') || Request::routeIs('admin-completed-project-list') || Request::routeIs('admin-view-project') || Request::routeIs('admin-edit-project')) ? 'display: block;' : '';
	}

	public static function leadRoute(){
		echo ( Request::routeIs('admin-add-leads') || Request::routeIs('admin-leads-list') || Request::routeIs('admin-active-leads-list') || Request::routeIs('admin-rejected-leads-list') || Request::routeIs('admin-completed-leads-list') || Request::routeIs('admin-view-leads') || Request::routeIs('admin-edit-leads') || Request::routeIs('admin-add-mail-leads')) ? 'open' : '';
	}
	
	public static function leadStyleRoute(){
		return ( Request::routeIs('admin-add-leads') || Request::routeIs('admin-leads-list') || Request::routeIs('admin-active-leads-list') || Request::routeIs('admin-rejected-leads-list') || Request::routeIs('admin-completed-leads-list') || Request::routeIs('admin-view-leads') || Request::routeIs('admin-edit-leads') || Request::routeIs('admin-add-mail-leads')) ? 'display: block;' : '';
	}

	public static function userRoute(){
		echo ( Request::routeIs('admin-add-user') || Request::routeIs('admin-user-list') || Request::routeIs('admin-active-user-list') || Request::routeIs('admin-inactive-user-list') || Request::routeIs('admin-view-user') || Request::routeIs('admin-edit-user')) ? 'open' : '';
	}
	
	public static function userStyleRoute(){
		return ( Request::routeIs('admin-add-user') || Request::routeIs('admin-user-list') || Request::routeIs('admin-active-user-list') || Request::routeIs('admin-inactive-user-list') || Request::routeIs('admin-view-user') || Request::routeIs('admin-edit-user')) ? 'display: block;' : '';
	}

	public static function subadminRoute(){
		echo ( Request::routeIs('admin-add-subadmin') || Request::routeIs('admin-subadmin-list') || Request::routeIs('admin-active-subadmin-list') || Request::routeIs('admin-inactive-subadmin-list') || Request::routeIs('admin-view-subadmin') || Request::routeIs('admin-edit-subadmin')) ? 'open' : '';
	}
	
	public static function subadminStyleRoute(){
		return ( Request::routeIs('admin-add-subadmin') || Request::routeIs('admin-subadmin-list') || Request::routeIs('admin-active-subadmin-list') || Request::routeIs('admin-inactive-subadmin-list') || Request::routeIs('admin-view-subadmin') || Request::routeIs('admin-edit-subadmin')) ? 'display: block;' : '';
	}

	public static function filesRoute(){
		echo ( Request::routeIs('admin-library-list') || Request::routeIs('admin-add-library') || Request::routeIs('admin-files-list') ) ? 'open' : '';
	}
	
	public static function filesStyleRoute(){
		return ( Request::routeIs('admin-library-list') || Request::routeIs('admin-add-library') || Request::routeIs('admin-files-list')) ? 'display: block;' : '';
	}

	public static function statRoute(){
		echo ( Request::routeIs('admin-statistics') ) ? 'open' : '';
	}
	
	
	/*==================Designer =====================*/
	
	public static function projectDesignerRoute(){
		echo ( Request::routeIs('add-project') || Request::routeIs('project-list') || Request::routeIs('active-project-list') || Request::routeIs('completed-project-list') || Request::routeIs('view-project') || Request::routeIs('edit-project')) ? 'open' : '';
	}
	
	public static function projectDesignerStyleRoute(){
		return ( Request::routeIs('add-project') || Request::routeIs('project-list') || Request::routeIs('active-project-list') || Request::routeIs('completed-project-list') || Request::routeIs('view-project') || Request::routeIs('edit-project')) ? 'display: block;' : '';
	}

	public static function leadDesignerRoute(){
		echo ( Request::routeIs('add-leads') || Request::routeIs('leads-list') || Request::routeIs('active-leads-list') || Request::routeIs('rejected-leads-list') || Request::routeIs('completed-leads-list') || Request::routeIs('view-leads') || Request::routeIs('edit-leads')) ? 'open' : '';
	}
	
	public static function leadDesignerStyleRoute(){
		return ( Request::routeIs('add-leads') || Request::routeIs('leads-list') || Request::routeIs('active-leads-list') || Request::routeIs('rejected-leads-list') || Request::routeIs('completed-leads-list') || Request::routeIs('view-leads') || Request::routeIs('edit-leads')) ? 'display: block;' : '';
	}

	public static function filesDesignerRoute(){
		echo ( Request::routeIs('library-list') || Request::routeIs('add-library') || Request::routeIs('files-list') ) ? 'open' : '';
	}
	
	public static function filesDesignerStyleRoute(){
		return ( Request::routeIs('library-list') || Request::routeIs('add-library') || Request::routeIs('files-list')) ? 'display: block;' : '';
	}
	
	public static function OriginalName($name=null){
		$name = pathinfo($name, PATHINFO_FILENAME);
		return preg_replace('/[^a-zA-Z0-9_-]/s','',$name);
	}
	
	
	

}

?>