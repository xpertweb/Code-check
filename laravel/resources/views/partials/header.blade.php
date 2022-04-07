<!-- BEGIN HEADER -->
<div class="page-header navbar navbar-fixed-top">
	<!-- BEGIN HEADER INNER -->
	<div class="page-header-inner">
		<!-- BEGIN LOGO -->
		<div class="page-logo">
			<a href="#">
				<img src="{{ asset('assets/admin/layout4/img/logo-light.png') }}" alt="logo" class="logo-default"/>
			</a>
			<div class="menu-toggler sidebar-toggler">
				<!-- DOC: Remove the above "hide" to enable the sidebar toggler button on header -->
			</div>
		</div>
		<!-- END LOGO -->
	
	
		<!-- BEGIN PAGE TOP -->
		<div class="page-top">
			<!-- BEGIN TOP NAVIGATION MENU -->
			<div class="top-menu">
				<ul class="nav navbar-nav pull-right">
					<li class="separator hide"></li>
					@if(Auth::user()->role_id == 2)
						<li class="dropdown dropdown-extended dropdown-notification dropdown-dark" >
							<a href="#capacity" class="dropdown-toggle" data-toggle="modal" style='padding: 12px 12px 24px 12px;font-weight: bold;text-align: center;'>
								@lang('messages.capacity') 
								<br>
								@php
									$capacity = Helper::designerTable('capacity',Auth::user()->id);
									$is_lead_accept = Helper::designerTable('is_lead_accept',Auth::user()->id);
								@endphp
								{{$capacity}}
							</a>
						</li>
						<li class="dropdown dropdown-extended dropdown-notification dropdown-dark" >
							<a href="#lead_accept" class="dropdown-toggle" data-toggle="modal" style='padding: 12px 12px 24px 12px;font-weight: bold;text-align: center;'>
								@lang('messages.client_lead_status')
								<br>
								@if($is_lead_accept == 1) @lang('messages.yes') @else @lang('messages.no') @endif
							</a>	
						</li>
					@endif
					<li class="dropdown dropdown-user dropdown-dark">
						<a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
							<span class="username username-hide-on-mobile">{{ Auth::user()->name }} </span>
							@if(Auth::user()->profile_img)
								<img alt="" class="img-circle" src="{{ asset('uploads/profile/'.Auth::user()->profile_img)}}"/>
							@else
								<img alt="" class="img-circle" src="{{ asset('assets/admin/layout4/img/avatar9.jpg') }}"/>
							@endif
						</a>
						<ul class="dropdown-menu dropdown-menu-default">
						@if(Auth::user()->role_id == 1)
							<li>
								<a href="{{ route('admin-profile') }}"><i class="icon-user"></i> @lang('messages.my_profile') </a>
							</li>
							<li>
								<a href="{{ route('admin-profile-pic') }}"><i class="icon-picture"></i> @lang('messages.profile_pic')</a>
							</li>
							<li>
								<a href="{{ route('admin-change-password') }}"><i class="icon-lock"></i> @lang('messages.ChangePassword')</a>
							</li>
							<li class="divider"></li>
							<li>
								<a href="{{ route('admin-logout') }}"><i class="icon-login"></i> @lang('messages.Logout') </a>
							</li>
						@else
							<li>
								<a href="{{ route('profile') }}"><i class="icon-user"></i> @lang('messages.my_profile')</a>
							</li>
							<li>
								<a href="{{ route('profile-pic') }}"><i class="icon-picture"></i> @lang('messages.profile_pic')</a>
							</li>
							<li>
								<a href="{{ route('change-password') }}"><i class="icon-lock"></i> @lang('messages.ChangePassword')</a>
							</li>
							<li class="divider"></li>
							<li>
								<a href="{{ route('logout') }}"><i class="icon-login"></i> @lang('messages.Logout') </a>
							</li>
						@endif
						</ul>
					</li>
					<!-- END USER LOGIN DROPDOWN -->					
				</ul>
			</div>
			<!-- END TOP NAVIGATION MENU -->
		</div>
		<!-- END PAGE TOP -->
	</div>
	<!-- END HEADER INNER -->
</div>
<!-- END HEADER -->
<div class="clearfix"></div>

@if(Auth::user()->role_id == 2)
<div class="modal fade" id="capacity" tabindex="-1" role="capacity" aria-hidden="true">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
				<h4 class="modal-title"> @lang('messages.capacity')</h4>
			</div>
			<div class='alert text-center capacityMessage'></div>
			<form action="{{ route('update-capacity-lead') }}" method='post' id='capacityDes' >
				{{ csrf_field() }}
				<div class="modal-body">
					<div class="form-group">
						<label>@lang('messages.capacity')</label>
						<div class="input-group">
							<span class="input-group-addon"><i class="fa fa-bar-chart-o"></i></span>
							<input type="number" pattern="\d*" name='capacity' required max='99' maxlength='2' required class="form-control" value="{{$capacity}}" placeholder="@lang('messages.capacity')">
						</div>
					</div>	
				</div>
				<div class="modal-footer">
					<button type="button" class="btn default" data-dismiss="modal">@lang('messages.close')</button>
					<button type="submit" class="btn blue">@lang('messages.save')</button>
				</div>
			</form>	
		</div>
		<!-- /.modal-content -->
	</div>
	<!-- /.modal-dialog -->
</div>

<div class="modal fade" id="lead_accept" tabindex="-1" role="lead_accept" aria-hidden="true">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
				<h4 class="modal-title"> @lang('messages.lead_accept')</h4>
			</div>
			<div class='alert text-center acceptMessage'></div>
			<form action="{{ route('update-capacity-lead') }}" method='post' id='leadAccept' >
				{{ csrf_field() }}
				<div class="modal-body">
					<div class="form-group">
						<label>@lang('messages.lead_accept')</label>
						<div class="input-group">
							<span class="input-group-addon"><i class="fa fa-sliders"></i></span>
							<select name='is_lead_accept' class='form-control' >
								<option value=''>@lang('messages.lead_accept')</option>
								<option @if($is_lead_accept == '1') selected='selected' @endif value='1'>@lang('messages.yes')</option>
								<option @if($is_lead_accept == '0') selected='selected' @endif value='0'>@lang('messages.no')</option>
							</select>
						</div>
					</div>	
				</div>
				<div class="modal-footer">
					<button type="button" class="btn default" data-dismiss="modal">@lang('messages.close')</button>
					<button type="submit" class="btn blue">@lang('messages.save')</button>
				</div>
			</form>	
		</div>
		<!-- /.modal-content -->
	</div>
	<!-- /.modal-dialog -->
</div>
@endif
<style>
.acceptMessage,.capacityMessage{display:none;}
</style>