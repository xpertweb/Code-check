@extends('layouts.app')
@section('title', 'Change Password')
@section('content')

<!-- BEGIN PAGE CONTENT INNER -->
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
				
				<form class="leadsform" action="{{ route('admin-change-password') }}" method="post">
					{{ csrf_field() }}
					
					<div class="form-body">
						<div class="form-group">
							<label> @lang('messages.old_password')</label>
							<div class="input-group">
								<span class="input-group-addon"><i class="fa fa-lock"></i></span>
								<input type="password" name='old_password' class="form-control" value="" placeholder="@lang('messages.old_password')">
							</div>
							@if ($errors->has('old_password'))
								<span class="help-block-error">{{ $errors->first('old_password') }}</span>
							@endif
						</div>
						<div class="form-group">
							<label>@lang('messages.password')</label>
							<div class="input-group">
								<span class="input-group-addon"><i class="fa fa-lock"></i></span>
								<input type="password" name='password' class="form-control" value="" placeholder="@lang('messages.password')">
							</div>
							@if ($errors->has('password'))
								<span class="help-block-error">{{ $errors->first('password') }}</span>
							@endif
						</div>
						<div class="form-group">
							<label>@lang('messages.confirm_password')</label>
							<div class="input-group">
								<span class="input-group-addon"><i class="fa fa-lock"></i></span>
								<input type="password" name='confirm_password' class="form-control" value="" placeholder="@lang('messages.confirm_password')">
							</div>
							@if ($errors->has('confirm_password'))
								<span class="help-block-error">{{ $errors->first('confirm_password') }}</span>
							@endif
						</div>

					</div>
					<div class="form-actions">
						<button type="submit" class="btn blue">@lang('messages.submit')</button>
					</div>
				</form>
			</div>		
		</div>	
	</div>	
</div>
@stop