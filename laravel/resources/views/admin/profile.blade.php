@extends('layouts.app')
@section('title', 'Min profil')
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
				
				<form class="leadsform" action="{{ route('admin-profile') }}" method="post">
					{{ csrf_field() }}
					
					<div class="form-body">
						<div class='row'>
							<div class="col-sm-6">
								<label>@lang('messages.name')</label>
								<div class="input-group">
									<span class="input-group-addon"><i class="fa fa-sliders"></i></span>
									<input type="text" name='name' class="form-control" value="{{$user->name}}" placeholder="@lang('messages.name')">
								</div>
								@if ($errors->has('name'))
									<span class="help-block-error">{{ $errors->first('name') }}</span>
								@endif
							</div>
							<div class="col-sm-6">
								<label>@lang('messages.email') </label>
								<div class="input-group">
									<span class="input-group-addon"><i class="fa fa-envelope"></i></span>
									<input type="text" class="form-control" name='email'  value="{{$user->email}}" placeholder="@lang('messages.email')">
								</div>
								@if ($errors->has('email'))
									<span class="help-block-error">{{ $errors->first('email') }}</span>
								@endif
							</div>
							<div class="col-sm-6">
								<label>@lang('messages.phone')</label>
								<div class="input-group">
									<span class="input-group-addon"><i class="fa fa-phone"></i></span>
									<input type="text" name='contact' class="form-control" maxlength='11' value="{{$user->contact}}" placeholder="@lang('messages.phone')">
								</div>
								@if ($errors->has('contact'))
									<span class="help-block-error">{{ $errors->first('contact') }}</span>
								@endif
							</div>
							
						</div>						
					</div>
					<div class="form-actions">
						<button type="submit" class="btn blue">@lang('messages.save1')</button>
					</div>
				</form>
			</div>		
		</div>
		<!-- END SAMPLE FORM PORTLET-->		
	</div>	
</div>
@stop