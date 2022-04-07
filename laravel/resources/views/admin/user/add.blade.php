@extends('layouts.app')
@section('title', 'Tilføj ny designer')
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
				
				<form class="projectform" action="{{ route('admin-add-user') }}" method="post">
					{{ csrf_field() }}
					<div class="form-body">
						<div class="row">
							<div class="col-sm-6">
								<label>@lang('messages.first_name')</label>
								<div class="input-group">
									<span class="input-group-addon"><i class="fa fa-sliders"></i></span>
									<input type="text" name='first_name' class="form-control" value="{{old('first_name')}}" placeholder="@lang('messages.first_name')">
								</div>
								@if ($errors->has('first_name'))
									<span class="help-block-error">{{ $errors->first('first_name') }}</span>
								@endif
							</div>
							
							<div class="col-sm-6">
								<label>@lang('messages.last_name')</label>
								<div class="input-group">
									<span class="input-group-addon"><i class="fa fa-sliders"></i></span>
									<input type="text" name='last_name' class="form-control" value="{{old('last_name')}}" placeholder="@lang('messages.last_name')">
								</div>
								@if ($errors->has('last_name'))
									<span class="help-block-error">{{ $errors->first('last_name') }}</span>
								@endif
							</div>
							<div class="col-sm-6">
								<label>@lang('messages.email')</label>
								<div class="input-group">
									<span class="input-group-addon"><i class="fa fa-envelope"></i></span>
									<input type="text" name='email' class="form-control" value="{{old('email')}}" placeholder="@lang('messages.email')">
								</div>
								@if ($errors->has('email'))
									<span class="help-block-error">{{ $errors->first('email') }}</span>
								@endif
							</div>
							
							<div class="col-sm-6">
								<label>@lang('messages.phone')</label>
								<div class="input-group">
									<span class="input-group-addon"><i class="fa fa-phone"></i></span>
									<input type="text" name='contact' maxlength='12' class="form-control" value="{{old('contact')}}" placeholder="@lang('messages.phone')">
								</div>
								@if ($errors->has('contact'))
									<span class="help-block-error">{{ $errors->first('contact') }}</span>
								@endif
							</div>
							
							<div class="col-sm-6">
								<label>@lang('messages.password')</label>
								<div class="input-group">
									<span class="input-group-addon"><i class="fa fa-lock"></i></span>
									<input type="password" name='password' class="form-control" value="" placeholder="@lang('messages.password')">
								</div>
								@if ($errors->has('password'))
									<span class="help-block-error">{{ $errors->first('password') }}</span>
								@endif
							</div>
							
							<div class="col-sm-6">
								<label>@lang('messages.confirm_password')</label>
								<div class="input-group">
									<span class="input-group-addon"><i class="fa fa-lock"></i></span>
									<input type="password" name='confirm_password' class="form-control" value="" placeholder="@lang('messages.confirm_password')">
								</div>
								@if ($errors->has('confirm_password'))
									<span class="help-block-error">{{ $errors->first('confirm_password') }}</span>
								@endif
							</div>
							
							<div class="col-sm-6">
								<label>@lang('messages.capacity') </label>
								<div class="input-group">
									<span class="input-group-addon"><i class="fa fa-life-saver"></i></span>
									<input type="number" name='capacity' class="form-control" value="" required placeholder="@lang('messages.capacity')">
								</div>
							</div>
							
							<div class="col-sm-6">
								<label>@lang('messages.client_lead_status')</label>
								<div class="input-group">
									<span class="input-group-addon"><i class="fa fa-cogs"></i></span>
									<select name='is_lead_accept' class="form-control" >
										<option>@lang('messages.client_lead_status')</option>
										<option value='0'>No</option>
										<option value='1'>Yes</option>
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