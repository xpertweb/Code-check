<?php
namespace App\Http\Controllers\Designer;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use DB;
use App\Model\User;
use App\Model\Country;
use App\Model\Library;
use App\Model\Files;
use Helper;
use Zipper;

class libraryController  extends Controller
{
    public function index()
    {
		$designer_id = Auth::user()->id;
		$library = Library::with('user','createuser')->withCount('files')->where([ 'is_deleted' => 0  ]);
		
		if($library->exists()){
			$data['library'] = $library->get();
			
			$data['libraryCount'] = $library->count();
		}else{
			$data['library'] = [];
			$data['libraryCount'] = 0;
		}
		
        return view("designer.library.index",$data);
    }
	
	protected function validator(array $data)
    {
        return Validator::make($data, [
            'library_name' => 'required',
            'designer_id' => 'required',
            'filename' => 'required|file|mimes:jpeg,png,zip,pdf'
        ]);
    }
	
	public function downloadZip(Request $request)
    {
        $headers = ["Content-Type"=>"application/zip"];
		
		$filesRow = Files::with('library')->where(['library_id' => $request->id , 'is_deleted' => 0]);
		$files = $filesRow->get();
		
		$library_name = str_ireplace(' ','-',$files[0]->library->library_name);
        $fileName = strtolower($library_name.date('M-d-Y-H-i-s')).".zip"; 
		
		if($filesRow->exists()){
			$files = $filesRow->get();			
			
			foreach($files as $file){
				$file_path = $file->file_path; 
				Zipper::make(base_path('/uploads/zip/'.$fileName)) 
				->add(base_path().$file_path.'/'.$file->filename)->close();				
			}
			
		}
        return response()->download(base_path('/uploads/zip/'.$fileName),$fileName, $headers);
    }
	
	public function add(Request $request)
    {		
		$data['designer'] = User::where(['role_id' => '2' , 'status' => 1])->get();
		$login_id = Auth::user()->id;
		if (!empty($request->post()))
		{
			$post = $request->all();			
			$this->validator($post)->validate();
			
			$filename = $request->file('filename');
			$OriginalName = Helper::OriginalName($filename->getClientOriginalName());				
			$input['imagename'] = $OriginalName.time().'.'.$filename->getClientOriginalExtension();
			
			$destinationPath =  Helper::generatePath(base_path('/uploads/library'));
			$getPath = Helper::getPath('/uploads/library');
			$uploaded = $filename->move($destinationPath, $input['imagename']);
			
			$library_id = Library::insertGetId([
				'designer_id' => $post['designer_id'],
				'created_by' => $login_id,
				'library_name' => $post['library_name'],
				'created_at' => date("Y-m-d H:i:s"),
				'is_deleted' => 0				
			]);

			Files::insertGetId([
				'library_id' => $library_id,
				'created_by' => $login_id,
				'filename' => $input['imagename'],
				'original_name' => $filename->getClientOriginalName(),
				'file_type' => $filename->getClientOriginalExtension(),
				'file_path' => $getPath,
				'created_at' => date("Y-m-d H:i:s"),
				'is_deleted' => 0				
			]);
		
			return redirect()->route('files-list',$library_id)->with("success", "Library added successfully.");

		}	
		
        return view("designer.library.add",$data);
    }
	
	public function filesList(Request $request){
		
		$files = Files::with('library','createuser')->where(['library_id' => $request->id , 'is_deleted' => 0]);
		
		$data['library_id'] = $request->id;
		if($files->exists()){
			$data['files'] = $files->get();
			$data['filesCount'] = $files->count();
		}else{
			$data['files'] = [];
			$data['filesCount'] = 0;
		}
		
		return view("designer.library.filesList",$data);
	}
	
	public function upload(Request $request){
		
		if (!empty($request->post()))
		{
			$post = $request->all();
			$validator = Validator::make($post, [
				'filename' => 'required|file|mimes:jpeg,png,zip,pdf'
			]);
			
			if ($validator->fails()) {
				return back()->withErrors($validator)->withInput();
			}
			
			$filename = $request->file('filename');
			$OriginalName = Helper::OriginalName($filename->getClientOriginalName());				
			$input['imagename'] = $OriginalName.time().'.'.$filename->getClientOriginalExtension();
			
			$destinationPath =  Helper::generatePath(base_path('/uploads/library'));
			$getPath = Helper::getPath('/uploads/library');
			$uploaded = $filename->move($destinationPath, $input['imagename']);
			
			Files::insertGetId([
				'library_id' => $post['library_id'],
				'created_by' => Auth::user()->id,
				'filename' => $input['imagename'],
				'original_name' => $filename->getClientOriginalName(),
				'file_type' => $filename->getClientOriginalExtension(),
				'file_path' => $getPath,
				'created_at' => date("Y-m-d H:i:s"),
				'is_deleted' => 0				
			]);
		
			return back()->with("success", "File added successfully.");
			
		}
	}
	
	public function fileDelete(Request $request){
		
		if (!empty($request->id))
		{
			Files::where( 'file_id' , $request->id )->update(['is_deleted' => 1]);
			return back()->with("success", "File deleted successfully.");
		}
		
	}
	
	public function delete(Request $request){
		
		if (!empty($request->id))
		{
			Library::where( 'library_id' , $request->id )->update(['is_deleted' => 1]);
			return back()->with("success", "Library deleted successfully.");
		}
	}
	
	

}
