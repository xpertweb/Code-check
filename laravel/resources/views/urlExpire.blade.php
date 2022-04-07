@extends('layouts.loginApp')
@section('title', 'Expire Link')
@section('content')

<div class="content">
	<div class='alert alert-danger error_expired'>@lang('messages.linkExpire')</div>	
</div>
<script>
	setTimeout(function(){
		window.location.replace("{{ route('login') }}");
	},3000);
</script>
@stop