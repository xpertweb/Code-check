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
				 
				<form class="projectform" action="{{ route('complete-project',$project->project_id) }}" method="post" enctype='multipart/form-data'>
				
					{{ csrf_field() }}
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
								<label>@lang('messages.link')</label>
								<div class="input-group">
									<span class="input-group-addon"><i class="fa fa-link"></i></span>
									<input type="text" name='project_link' class="form-control" value="{{$project->project_link}}" placeholder="@lang('messages.link')">
								</div>
								@if ($errors->has('project_link'))
									<span class="help-block-error">{{ $errors->first('project_link') }}</span>
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
									<input type="text" name='client_phone' class="form-control" value="{{$project->client_phone}}" placeholder="@lang('messages.client_phone')">
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
								<label>@lang('messages.project_doc')</label>
								<div class="input-group">
									<input type="file" name="project_doc" class="form-control" required />
								</div>
								@if ($errors->has('project_doc'))
									<span class="help-block-error">{{ $errors->first('project_doc') }}</span>
								@endif
							</div>
							
						</div>
						
						<!--div class="form-group">
							<label>@lang('messages.project_complete')</label>
							<div class="input-group">
								<textarea class="ckeditor form-control" name="project_complete" rows="6"  >{{old('project_complete')}}</textarea>
							</div>
							@if ($errors->has('project_complete'))
								<span class="help-block-error">{{ $errors->first('project_complete') }}</span>
							@endif
						</div-->
						
						<div class="form-group">
							<label>@lang('messages.project_prices')</label>
							<div class="input-group">
								<textarea class="ckeditor form-control" name="project_prices" rows="6"  >{{$project->project_prices}}</textarea>
							</div>
							@if ($errors->has('project_prices'))
								<span class="help-block-error">{{ $errors->first('project_prices') }}</span>
							@endif
						</div>
						<div class="form-group">
							<label>@lang('messages.comment')s</label>
							<div class="input-group">
								<textarea class="ckeditor form-control" name="comment" rows="6"  >{{$project->comment}}</textarea>
							</div>
						</div>
					</div>
					<div class="form-actions">
						<button type="submit" class="btn blue">@lang('messages.quit')</button>
					</div>
				</form>
			</div>
		
		</div>
		<!-- END SAMPLE FORM PORTLET-->
		
	</div>	
</div>
@stop