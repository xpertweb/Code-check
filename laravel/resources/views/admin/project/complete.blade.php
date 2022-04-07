@extends('layouts.app')
@section('title', 'Komplet projekt')
@section('content')

<div class="row">
	<div class="col-md-12">
		<!-- BEGIN SAMPLE FORM PORTLET-->
		<div class="portlet box blue">
			<div class="portlet-title">
				<div class="caption">
					<i class="fa fa-tasks"></i> @yield('title')
				</div>
				<div class="tools">
					<a href="" class="collapse" ></a>					
				</div>
			</div>
			
			<div class="portlet-body form">
			
				@if ($message = Session::get('success'))
					<div class="alert alert-success text-center">
						<button type="button" class="close" data-dismiss="alert">×</button>	
						<strong>{{ $message }}</strong>
					</div>
				@endif
				
				@if ($error = Session::get('error'))
					<div class="alert alert-danger text-center">
						<button type="button" class="close" data-dismiss="alert">×</button>	
						<strong>{{ $error }}</strong>
					</div>
				@endif 
				 
				<form class="projectform" action="{{ route('admin-complete-project',$project->project_id) }}" method="post" enctype='multipart/form-data'>
				
					{{ csrf_field() }}
					<div class="form-body">						
						<div class="form-group">
							<label>@lang('messages.project_doc')</label>
							<div class="input-group">
								<input type="file" name="project_doc" class="form-control" required />
							</div>
							@if ($errors->has('project_doc'))
								<span class="help-block-error">{{ $errors->first('project_doc') }}</span>
							@endif
						</div>
						
						<div class="form-group">
							<label>@lang('messages.project_complete')</label>
							<div class="input-group">
								<textarea class="ckeditor form-control" name="project_complete" rows="6"  >{{old('project_complete')}}</textarea>
							</div>
							@if ($errors->has('project_complete'))
								<span class="help-block-error">{{ $errors->first('project_complete') }}</span>
							@endif
						</div>
						
					</div>
					<div class="form-actions">
						<button type="submit" class="btn blue">@lang('messages.submit')</button>
					</div>
				</form>
			</div>
		
		</div>
		<!-- END SAMPLE FORM PORTLET-->
		
	</div>	
</div>
@stop