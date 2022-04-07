@extends('layouts.app')
@section('title', 'Rediger Admin')
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
				
				<form class="projectform" action="{{ route('admin-edit-subadmin',$user->id) }}" method="post">
					{{ csrf_field() }}
					<div class="form-body">
						<div class="row">
							<div class="col-sm-6">
								<label>@lang('messages.first_name')</label>
								<div class="input-group">
									<span class="input-group-addon"><i class="fa fa-sliders"></i></span>
									<input type="text" name='first_name' class="form-control" value="{{$user->designer->first_name}}" placeholder="@lang('messages.first_name')">
								</div>
								@if ($errors->has('first_name'))
									<span class="help-block-error">{{ $errors->first('first_name') }}</span>
								@endif
							</div>
							
							<div class="col-sm-6">
								<label>@lang('messages.last_name')</label>
								<div class="input-group">
									<span class="input-group-addon"><i class="fa fa-sliders"></i></span>
									<input type="text" name='last_name' class="form-control" value="{{$user->designer->last_name}}" placeholder="@lang('messages.last_name')">
								</div>
								@if ($errors->has('last_name'))
									<span class="help-block-error">{{ $errors->first('last_name') }}</span>
								@endif
							</div>
							<div class="col-sm-6">
								<label>@lang('messages.email') </label>
								<div class="input-group">
									<span class="input-group-addon"><i class="fa fa-envelope"></i></span>
									<input type="text" name='email' class="form-control" value="{{$user->email}}" placeholder="@lang('messages.email')">
								</div>
								@if ($errors->has('email'))
									<span class="help-block-error">{{ $errors->first('email') }}</span>
								@endif
							</div>
							
							<div class="col-sm-6">
								<label>@lang('messages.phone')</label>
								<div class="input-group">
									<span class="input-group-addon"><i class="fa fa-phone"></i></span>
									<input type="text" name='contact' maxlength='12' class="form-control" value="{{$user->contact}}" placeholder="@lang('messages.phone')">
								</div>
								@if ($errors->has('contact'))
									<span class="help-block-error">{{ $errors->first('contact') }}</span>
								@endif
							</div>
							<div class="col-sm-6">
								<label>@lang('messages.capacity') </label>
								<div class="input-group">
									<span class="input-group-addon"><i class="fa fa-life-saver"></i></span>
									<input type="number" name='capacity' class="form-control" value="{{$user->designer->capacity}}" required placeholder="@lang('messages.capacity')">
								</div>
							</div>
							
							<div class="col-sm-6">
								<label>@lang('messages.client_lead_status')</label>
								<div class="input-group">
									<span class="input-group-addon"><i class="fa fa-cogs"></i></span>
									<select name='is_lead_accept' class="form-control" >
										<option>@lang('messages.client_lead_status')</option>
										<option value='0' @if($user->designer->is_lead_accept == 0) selected @endif >No</option>
										<option value='1' @if($user->designer->is_lead_accept == 1) selected @endif >Yes</option>
									</select>
								</div>
							</div>
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