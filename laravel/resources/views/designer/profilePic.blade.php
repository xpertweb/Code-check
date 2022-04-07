@extends('layouts.app')
@section('title', 'Profil billede')
@section('content')

<div class="row">
	<div class="col-md-12">
		<!-- BEGIN SAMPLE FORM PORTLET-->
		<div class="portlet box blue profile-pairent">
			<div class="portlet-title">
				<div class="caption">
					<i class="fa fa-tasks"></i> @yield('title')
				</div>
				<div class="tools">
					<a href="" class="collapse" ></a>					
				</div>
			</div>
			
			<div class="portlet-body form" >
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
				
				<form class="profilePic" action="{{ route('profile-pic') }}" enctype='multipart/form-data' method="post">
					{{ csrf_field() }}
					
					<div class="form-body">
						<div class="form-group">
							<label>@lang('messages.profile_pic')</label>
							<div class="input-group">
								<span class="input-group-addon"><i class="fa fa-file-image-o "></i></span>
								<input type="file" name='profile_img' class="form-control" value="" required >
							</div>
						</div>
					</div>
					
					@if($user->profile_img)
					<div class="cvrImgProfile"><img src="{{ asset('uploads/profile/'.$user->profile_img)}}" id="demo1" alt="{{$user->name}}" class="img-responsive"/></div>
					@endif
					<div class="form-actions">
						<button type="submit" class="btn blue">@lang('messages.submit')</button>
					</div>
				</form>
			
				
			</div>		
		</div>	
	</div>	
</div>
@stop