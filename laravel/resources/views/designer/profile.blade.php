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
				
				<form class="leadsform" action="{{ route('profile') }}" method="post">
					{{ csrf_field() }}
					
					<div class="form-body">
						<div class='row'>
							<div class="col-sm-6">
								<label>@lang('messages.first_name')</label>
								<div class="input-group">
									<span class="input-group-addon"><i class="fa fa-user"></i></span>
									<input type="text" name='first_name' class="form-control" value="{{$user->designer->first_name}}" placeholder="@lang('messages.first_name')">
								</div>
								@if ($errors->has('first_name'))
									<span class="help-block-error">{{ $errors->first('first_name') }}</span>
								@endif
							</div>
							<div class="col-sm-6">
								<label>@lang('messages.last_name')</label>
								<div class="input-group">
									<span class="input-group-addon"><i class="fa fa-user"></i></span>
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
									<input type="text" readonly class="form-control" value="{{$user->email}}" placeholder="@lang('messages.email')">
								</div>
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
							
							<div class="col-sm-6">
								<label>@lang('messages.capacity') </label>
								<div class="input-group">
									<span class="input-group-addon"><i class="fa fa-bar-chart-o"></i></span>
									<input type="text" name='capacity' class="form-control" value="{{$user->designer->capacity}}" placeholder="@lang('messages.capacity')">
								</div>
								@if ($errors->has('capacity'))
									<span class="help-block-error">{{ $errors->first('capacity') }}</span>
								@endif
							</div>
							<div class="col-sm-6">
								<label>@lang('messages.lead_accept')</label>
								<div class="input-group">
									<span class="input-group-addon"><i class="fa fa-sliders"></i></span>
									<select name='is_lead_accept' class='form-control' >
										<option value=''>Select @lang('messages.lead_accept')</option>
										<option @if($user->designer->is_lead_accept == '1') selected='selected' @endif value='1'>Yes</option>
										<option @if($user->designer->is_lead_accept == '0') selected='selected' @endif value='0'>No</option>
									</select>
								</div>
								@if ($errors->has('is_lead_accept'))
									<span class="help-block-error">{{ $errors->first('is_lead_accept') }}</span>
								@endif
							</div>
							<div class="col-sm-6">
								<label>@lang('messages.gender')</label>
								<div class="input-group">
									<span class="input-group-addon"><i class="fa fa-sliders"></i></span>
									<select name='gender' class='form-control' >									
										<option value=''>Select @lang('messages.gender')</option>
										<option @if($user->designer->gender == '1') selected='selected' @endif value='1'>Male</option>
										<option @if($user->designer->gender == '2') selected='selected' @endif value='2'>Female</option>
									</select>
								</div>
								@if ($errors->has('gender'))
									<span class="help-block-error">{{ $errors->first('gender') }}</span>
								@endif
							</div>
							<div class="col-sm-6">
								<label>@lang('messages.dob')</label>
								<div class="input-group">
									<span class="input-group-addon"><i class="fa fa-birthday-cake"></i></span>
									<input type="text" name='dob' data-date-format="dd-mm-yyyy" class="form-control date-picker" value="{{$user->designer->dob}}" placeholder="@lang('messages.dob')">
								</div>
								@if ($errors->has('dob'))
									<span class="help-block-error">{{ $errors->first('dob') }}</span>
								@endif
							</div>
							
							<div class="col-sm-6">
								<label>@lang('messages.country')</label>
								<div class="input-group">
									<span class="input-group-addon"><i class="fa fa-flag"></i></span>
									<select name='country' class='form-control' >									
										<option value=''>Select @lang('messages.country')</option>
										@foreach($country as $countrys)
											<option @if($user->designer->country == $countrys->id) selected='selected' @endif value='{{$countrys->id}}'>{{$countrys->name}}</option>
										@endforeach
									</select>
								</div>
								@if ($errors->has('country'))
									<span class="help-block-error">{{ $errors->first('country') }}</span>
								@endif
							</div>
							
							<!--div class="col-sm-6">
								<label>@lang('messages.state')</label>
								<div class="input-group">
									<span class="input-group-addon"><i class="fa fa-flag"></i></span>
									<input type="text" name='state' class="form-control" value="{{$user->designer->state}}" placeholder="@lang('messages.state')">
								</div>
								@if ($errors->has('state'))
									<span class="help-block-error">{{ $errors->first('state') }}</span>
								@endif
							</div-->
							
							<div class="col-sm-6">
								<label>@lang('messages.city')</label>
								<div class="input-group">
									<span class="input-group-addon"><i class="fa fa-flag"></i></span>
									<input type="text" name='city' class="form-control" value="{{$user->designer->city}}" placeholder="@lang('messages.city')">
								</div>
								@if ($errors->has('city'))
									<span class="help-block-error">{{ $errors->first('city') }}</span>
								@endif
							</div>
						</div>

						<div class="form-group">
							<label>@lang('messages.description')</label>
							<div class="input-group">
								<textarea class="ckeditor form-control" name="description" rows="6"  >{{$user->designer->description}}</textarea>
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