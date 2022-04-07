@extends('layouts.loginApp')
@section('title', 'Login')
@section('content')

<div class="content">
	<!-- BEGIN LOGIN FORM -->
	<form class="login-form" action="{{ route('login') }}" method="post">
		{{ csrf_field() }}
		<h3 class="form-title">@lang('messages.loginTitle')</h3>
		<div class='message'></div>
		<div class="form-group">
			<label class="control-label visible-ie8 visible-ie9">@lang('messages.email')</label>
			<input class="form-control form-control-solid placeholder-no-fix" type="text" autocomplete="off" placeholder="@lang('messages.email')" name="email"/>
			@if ($errors->has('email'))
				<span class = "err">{{ $errors->first('email') }}</span>
			@endif
		</div>
		<div class="form-group">
			<label class="control-label visible-ie8 visible-ie9">@lang('messages.password')</label>
			<input class="form-control form-control-solid placeholder-no-fix" type="password" autocomplete="off" placeholder="@lang('messages.password')" name="password"/>					
			@if ($errors->has('password'))
				<span class = "err">{{ $errors->first('password') }}</span>
			@endif
		</div>
		<div class="form-actions">
			<button type="submit" class="btn btn-success uppercase">@lang('messages.loginTitle')</button>
			<label class="rememberme check"><input type="checkbox" name="remember" value="1"/>@lang('messages.remember') </label>
			<a href="javascript:;" id="forget-password" class="forget-password">@lang('messages.forgot')</a>
		</div>
	</form>
	<!-- END LOGIN FORM -->
	
	<!-- BEGIN FORGOT PASSWORD FORM -->
	<form class="forget-form" action="javascript:" method="post">
		{{ csrf_field() }}
		<div class="alert alert-danger errorMessage"></div>
		<h3>@lang('messages.forgotHeading')</h3>
		<p>@lang('messages.forgotSubHeading')</p>
		<div class="form-group">
			<input class="form-control placeholder-no-fix" type="email" required autocomplete="off" placeholder="Email" name="email"/>
		</div>
		<div class="form-actions">
			<button type="button" id="back-btn" class="btn btn-default">@lang('messages.back')</button>
			<button type="submit" class="btn btn-success uppercase pull-right">@lang('messages.sendemail')</button>
		</div>
	</form>
	<!-- END FORGOT PASSWORD FORM -->
</div>
@stop