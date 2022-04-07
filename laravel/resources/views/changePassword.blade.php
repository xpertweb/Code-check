@extends('layouts.loginApp')
@section('title', 'Change Password')
@section('content')

<div class="content">
	@if ($message = Session::get('success'))
		<div class="alert alert-success text-center">
			<button type="button" class="close" data-dismiss="alert">×</button>	
			<strong>{{ $message }}</strong>
		</div>
	@endif
	
	<!-- BEGIN LOGIN FORM -->
	<form class="change-pass" action="{{ route('new-password',$token) }}" method="post">
		{{ csrf_field() }}
		<h3 class="form-title">@lang('messages.changePass')</h3>
		<div class="form-group">
			<label class="control-label visible-ie8 visible-ie9">@lang('messages.Password')</label>
			<input class="form-control form-control-solid placeholder-no-fix" type="password" autocomplete="off" placeholder="@lang('messages.Password')" name="password"/>					
			@if ($errors->has('password'))
				<span class = "err">{{ $errors->first('password') }}</span>
			@endif
		</div>		
		<div class="form-group">
			<label class="control-label visible-ie8 visible-ie9">@lang('messages.confirm_password')</label>
			<input class="form-control form-control-solid placeholder-no-fix" type="password" autocomplete="off" placeholder="@lang('messages.confirm_password')" name="confirm_password"/>					
			@if ($errors->has('confirm_password'))
				<span class = "err">{{ $errors->first('confirm_password') }}</span>
			@endif
		</div>
		<div class="form-actions">
			<button type="submit" class="btn btn-success uppercase">@lang('messages.changePass')</button>
		</div>
	</form>
	<!-- END LOGIN FORM -->
	
</div>
@stop