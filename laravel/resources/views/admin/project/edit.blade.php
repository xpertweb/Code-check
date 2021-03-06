@extends('layouts.app')
@section('title', 'Rediger projekt')
@section('content')

<div class="row">
	<div class="col-md-12">
		<!-- BEGIN SAMPLE FORM PORTLET-->
		<form class="projectform" action="{{ route('admin-edit-project',$project->project_id) }}" method="post">
			{{ csrf_field() }}
			<input type='hidden' name='projectAssigned' class='project_Assigned' value="{{$project->projectAssigned}}" />
			<input type='hidden' name='projectCapacity' class='project_Capacity' value="{{$project->projectCapacity}}" />
			<input type='hidden' name='projects_type' class='projects_type' value="{{$project->projects_type}}" />
			<div class="portlet box blue">
				<div class="portlet-title">
					<div class="caption">
						<i class="fa fa-tasks"></i> @yield('title')
					</div>
					<!--<div class="col-sm-4 text-center" style="margin-top: 3px;">
						<div class="col-sm-4" style="font-size: 18px;padding: 5px 0;">Type:</div>
						<div class="col-sm-8">
							<select name="projects_type" class="form-control">
								<option @if($project->projects_type == 0) selected @endif value="0">Phone Lead</option>
								<option @if($project->projects_type == 0) selected @endif value="1">Mail Lead</option>
							</select> 
						</div>
					</div>-->
					<div class="col-sm-4 text-center" style="margin-top: 3px;">
						<div class="col-sm-4" style="font-size: 18px;padding: 5px 0;">@lang('messages.name'):</div>
						<div class="col-sm-8">
							<select class="form-control selectDesigner" name="designer_id" >
								<option value="">@lang('messages.designerName')</option>
								@foreach($user as $users)
									<option @if($project->designer_id == $users->id) selected  @endif value="{{$users->id}}">{{$users->name}}</option>
								@endforeach
							</select>
						</div>
					</div>
					
					<div class="tools">
						<a href="" class="collapse" ></a>
					</div>
				</div>
				
				<div class="portlet-body form">
				
					@if ($message = Session::get('success'))
						<div class="alert alert-success text-center">
							<button type="button" class="close" data-dismiss="alert">??</button>	
							<strong>{{ $message }}</strong>
						</div>
					@endif
					@if ($error = Session::get('error'))
						<div class="alert alert-danger text-center">
							<button type="button" class="close" data-dismiss="alert">??</button>	
							<strong>{{ $error }}</strong>
						</div>
					@endif
				
					<div class="form-body">
						<div class="row">
							<div class="col-sm-6">
								<label>@lang('messages.proName')</label>
								<div class="input-group">
									<span class="input-group-addon"><i class="fa fa-sliders"></i></span>
									<input type="text" name='project_name' class="form-control" value="{{$project->project_name}}" placeholder="@lang('messages.proName')">
								</div>
								@if ($errors->has('project_name'))
									<span class="help-block-error">{{ $errors->first('project_name') }}</span>
								@endif
							</div>
							<div class="col-sm-6">
								<label>@lang('messages.cemail')</label>
								<div class="input-group">
									<span class="input-group-addon"><i class="fa fa-envelope"></i></span>
									<input type="text" name='client_email' class="form-control" value="{{$project->client_email}}" placeholder="@lang('messages.cemail')">
								</div>
								@if ($errors->has('client_email'))
									<span class="help-block-error">{{ $errors->first('client_email') }}</span>
								@endif
							</div>
							<div class="col-sm-6">
								<label>@lang('messages.client_phone')</label>
								<div class="input-group">
									<span class="input-group-addon"><i class="fa fa-phone"></i></span>
									<input type="text" name='client_phone' maxlength='12' class="form-control" value="{{$project->client_phone}}" placeholder="@lang('messages.client_phone')">
								</div>
								@if ($errors->has('client_phone'))
									<span class="help-block-error">{{ $errors->first('client_phone') }}</span>
								@endif
							</div>
							<div class="col-sm-6">
								<label>@lang('messages.client_vat')</label>
								<div class="input-group">
									<span class="input-group-addon"><i class="fa fa-sliders"></i></span>
									<input type="text" name='client_vat' class="form-control" value="{{$project->client_vat}}" placeholder="@lang('messages.client_vat')">
								</div>
								@if ($errors->has('client_vat'))
									<span class="help-block-error">{{ $errors->first('client_vat') }}</span>
								@endif
							</div>
							<div class="col-sm-6">
								<label>@lang('messages.client_address')</label>
								<div class="input-group">
									<span class="input-group-addon"><i class="fa fa-map-marker"></i></span>
									<input type="text" name='client_address' class="form-control" value="{{$project->client_address}}" placeholder="@lang('messages.client_address')">
								</div>
								@if ($errors->has('client_address'))
									<span class="help-block-error">{{ $errors->first('client_address') }}</span>
								@endif
							</div>
							
							<div class="col-sm-6">
								<label>@lang('messages.client_person')</label>
								<div class="input-group">
									<span class="input-group-addon"><i class="fa fa-user"></i></span>
									<input type="text" name='client_person' class="form-control" value="{{$project->client_person}}" placeholder="@lang('messages.client_person')">
								</div>
								@if ($errors->has('client_person'))
									<span class="help-block-error">{{ $errors->first('client_person') }}</span>
								@endif
							</div>
							
							<div class="col-sm-6">
								<label>@lang('messages.link')</label>
								<div class="input-group">
									<span class="input-group-addon"><i class="fa fa-link"></i></span>
									<input type="text" name='project_link' class="form-control" value="{{$project->project_link}}" placeholder="@lang('messages.link')">
								</div>
								@if ($errors->has('project_link'))
									<span class="help-block-error">{{ $errors->first('project_link') }}</span>
								@endif
							</div>
						</div>	
						
						<div class="form-group">
							<label>@lang('messages.comment')s</label>
							<div class="input-group">
								<textarea class="ckeditor form-control" name="comment" rows="6"  >{{$project->comment}}</textarea>
							</div>
						</div>
						
					</div>
					<div class="form-actions">
						<button type="submit" class="btn blue">@lang('messages.submit')</button>
					</div>
				</div>			
			</div>			
		</form>
		<!-- END SAMPLE FORM PORTLET-->
		
	</div>
	
</div>
<script>
	var select_designer = "{{ route ('admin-select-designer')}}";	
</script>

@stop