<!-- BEGIN SIDEBAR -->

<div class="page-sidebar-wrapper">
	<div class="page-sidebar navbar-collapse collapse">		
		<ul class="page-sidebar-menu" data-keep-expanded="false" data-auto-scroll="true" data-slide-speed="200">
			@if (Auth::user()->role_id == 1)
				<li class="start active ">
					<a href="{{ route('admin-dashboard') }}">
						<i class="icon-home"></i><span class="title">@lang('messages.Dashboard')</span>
					</a>
				</li>
				<li class="{{Helper::projectRoute()}}" >
					<a href="javascript:;"><i class="icon-handbag"></i><span class="title">@lang('messages.Project')</span><span class="arrow "></span></a>
					
					<ul class="sub-menu" style="{{Helper::projectStyleRoute()}}">
						<li class="{{ Request::routeIs('admin-add-project') ? 'active' : '' }}" >
							<a href="{{ route('admin-add-project') }}">@lang('messages.addNew') @lang('messages.Project')</a>
						</li>
						<li class="{{ Request::routeIs('admin-project-list') ? 'active' : '' }}">
							<a href="{{ route('admin-project-list') }}">@lang('messages.All') @lang('messages.Project')</a>
						</li>
						<li class="{{ Request::routeIs('admin-active-project-list') ? 'active' : '' }}">
							<a href="{{ route('admin-active-project-list') }}">@lang('messages.progress') @lang('messages.Project') </a>
						</li>
						<li class="{{ Request::routeIs('admin-completed-project-list') ? 'active' : '' }}">
							<a href="{{ route('admin-completed-project-list') }}">@lang('messages.completed') @lang('messages.Project')</a>
						</li>
					</ul>
				</li>
				
				<li class="{{Helper::leadRoute()}}" >
					<a href="javascript:;"><i class="icon-handbag"></i><span class="title">@lang('messages.Phoneleads')</span><span class="arrow "></span></a>
					
					<ul class="sub-menu" style="{{Helper::leadStyleRoute()}}">
						<li class="{{ Request::routeIs('admin-add-leads') ? 'active' : '' }}" >
							<a href="{{ route('admin-add-leads') }}">@lang('messages.addNew') @lang('messages.Phoneleads')</a>
						</li>
						<li class="{{ Request::routeIs('admin-add-mail-leads') ? 'active' : '' }}" >
							<a href="{{ route('admin-add-mail-leads') }}">@lang('messages.addNew') @lang('messages.mailLead')s</a>
						</li>
						<li class="{{ Request::routeIs('admin-leads-list') ? 'active' : '' }}">
							<a href="{{ route('admin-leads-list') }}">@lang('messages.All') @lang('messages.Phoneleads')</a>
						</li>
						<li class="{{ Request::routeIs('admin-active-leads-list') ? 'active' : '' }}">
							<a href="{{ route('admin-active-leads-list') }}">@lang('messages.progress') @lang('messages.Lead')s </a>
						</li>
						<li class="{{ Request::routeIs('admin-rejected-leads-list') ? 'active' : '' }}">
							<a href="{{ route('admin-rejected-leads-list') }}"> @lang('messages.Lead')s @lang('messages.Rejected')</a>
						</li>
						<li class="{{ Request::routeIs('admin-completed-leads-list') ? 'active' : '' }}">
							<a href="{{ route('admin-completed-leads-list') }}">@lang('messages.successfull') @lang('messages.Lead')s</a>
						</li>
					</ul>
				</li>
				<li class="{{Helper::userRoute()}}">
					<a href="javascript:;"><i class="icon-user"></i><span class="title">@lang('messages.Designer')</span><span class="arrow "></span></a>
					<ul class="sub-menu" style="{{Helper::userStyleRoute()}}">
						<li class="{{ Request::routeIs('admin-add-user') ? 'active' : '' }}" >
							<a href="{{ route('admin-add-user') }}"> @lang('messages.addNew') @lang('messages.Designer')</a>
						</li>
						<li class="{{ Request::routeIs('admin-user-list') ? 'active' : '' }}" >
							<a href="{{ route('admin-user-list') }}"> @lang('messages.All') @lang('messages.Designer')</a>
						</li>
						<li class="{{ Request::routeIs('admin-active-user-list') ? 'active' : '' }}" >
							<a href="{{ route('admin-active-user-list') }}"> @lang('messages.Active') @lang('messages.Designer')</a>
						</li>
						<li class="{{ Request::routeIs('admin-inactive-user-list') ? 'active' : '' }}" >
							<a href="{{ route('admin-inactive-user-list') }}"> @lang('messages.Inactive') @lang('messages.Designer')</a>
						</li>
					</ul>
				</li>
				
				<li class="{{Helper::subadminRoute()}}">
					<a href="javascript:;"><i class="icon-user"></i><span class="title">@lang('messages.subadmin')</span><span class="arrow "></span></a>
					<ul class="sub-menu" style="{{Helper::subadminStyleRoute()}}">
						<li class="{{ Request::routeIs('admin-add-subadmin') ? 'active' : '' }}" >
							<a href="{{ route('admin-add-subadmin') }}"> @lang('messages.addNew') @lang('messages.subadmin')</a>
						</li>
						<li class="{{ Request::routeIs('admin-subadmin-list') ? 'active' : '' }}" >
							<a href="{{ route('admin-subadmin-list') }}"> @lang('messages.All') @lang('messages.subadmin')</a>
						</li>
						<li class="{{ Request::routeIs('admin-active-subadmin-list') ? 'active' : '' }}" >
							<a href="{{ route('admin-active-subadmin-list') }}"> @lang('messages.Active') @lang('messages.subadmin')</a>
						</li>
						<li class="{{ Request::routeIs('admin-inactive-subadmin-list') ? 'active' : '' }}" >
							<a href="{{ route('admin-inactive-subadmin-list') }}"> @lang('messages.Inactive') @lang('messages.subadmin')</a>
						</li>
					</ul>
				</li>
				
				<li class="{{Helper::filesRoute()}}">
					<a href="javascript:;"><i class="icon-folder"></i><span class="title">@lang('messages.Liberary')</span><span class="arrow "></span></a>
					<ul class="sub-menu" style="{{Helper::filesStyleRoute()}}">
						<li class="{{ Request::routeIs('admin-library-list') ? 'active' : '' }}">
							<a href="{{ route('admin-library-list') }}">@lang('messages.All') @lang('messages.Liberary') </a>
						</li>
						<li class="{{ Request::routeIs('admin-add-library') ? 'active' : '' }}">
							<a href="{{ route('admin-add-library') }}"> @lang('messages.addNew') @lang('messages.Liberary')</a>
						</li>
					</ul>
				</li>
				
				<li class="{{Helper::statRoute()}}">
					<a href="{{ route('admin-statistics') }}"><i class="fa fa-paragraph"></i><span class="title">@lang('messages.statistics')</span></a>				
				</li>
				<li>
					<a href="{{ route('admin-logout') }}"><i class="icon-login"></i><span class="title">@lang('messages.Logout')</span></a>				
				</li>
			
			@elseif (Auth::user()->role_id == 2 || Auth::user()->role_id == 3)
			
				<li class="start active ">
					<a href="{{ route('dashboard') }}">
						<i class="icon-home"></i><span class="title">@lang('messages.Dashboard')</span>
					</a>
				</li>
				<li class="{{Helper::projectDesignerRoute()}}" >
					<a href="javascript:;"><i class="icon-handbag"></i><span class="title">@lang('messages.Project')</span><span class="arrow "></span></a>
					
					<ul class="sub-menu" style="{{Helper::projectDesignerStyleRoute()}}">
					
						@if(Auth::user()->role_id == 3)
						<li class="{{ Request::routeIs('add-project') ? 'active' : '' }}" >
							<a href="{{ route('add-project') }}">@lang('messages.addNew') @lang('messages.Project')</a>
						</li>
						@endif
						
						<li class="{{ Request::routeIs('project-list') ? 'active' : '' }}">
							<a href="{{ route('project-list') }}">@lang('messages.All') @lang('messages.Project')s</a>
						</li>
						
						<li class="{{ Request::routeIs('active-project-list') ? 'active' : '' }}">
							<a href="{{ route('active-project-list') }}">@lang('messages.progress') @lang('messages.Project') </a>
						</li>
						<li class="{{ Request::routeIs('completed-project-list') ? 'active' : '' }}">
							<a href="{{ route('completed-project-list') }}">@lang('messages.completed') @lang('messages.Project')</a>
						</li>
					</ul>
				</li>
				
				<li class="{{Helper::leadDesignerRoute()}}" >
					<a href="javascript:;"><i class="icon-handbag"></i><span class="title">@lang('messages.Lead')s</span><span class="arrow "></span></a>
					
					<ul class="sub-menu" style="{{Helper::leadDesignerStyleRoute()}}">
						@if(Auth::user()->role_id == 3)
						<li class="{{ Request::routeIs('add-leads') ? 'active' : '' }}">
							<a href="{{ route('add-leads') }}">@lang('messages.addNew') @lang('messages.Lead')s</a>
						</li>
						@endif
						<li class="{{ Request::routeIs('leads-list') ? 'active' : '' }}">
							<a href="{{ route('leads-list') }}">@lang('messages.All') @lang('messages.Lead')s</a>
						</li>
						<li class="{{ Request::routeIs('active-leads-list') ? 'active' : '' }}">
							<a href="{{ route('active-leads-list') }}">@lang('messages.progress') @lang('messages.Lead')</a>
						</li>
						<li class="{{ Request::routeIs('rejected-leads-list') ? 'active' : '' }}">
							<a href="{{ route('rejected-leads-list') }}">@lang('messages.Lead')s @lang('messages.Rejected')</a>
						</li>
						<li class="{{ Request::routeIs('completed-leads-list') ? 'active' : '' }}">
							<a href="{{ route('completed-leads-list') }}">@lang('messages.successfull') @lang('messages.Lead')s</a>
						</li>
					</ul>
				</li>
				
				<li class="{{Helper::filesDesignerRoute()}}">
					<a href="javascript:;"><i class="icon-folder"></i><span class="title">@lang('messages.Liberary')</span><span class="arrow "></span></a>
					<ul class="sub-menu" style="{{Helper::filesDesignerStyleRoute()}}">
						<li class="{{ Request::routeIs('library-list') ? 'active' : '' }}">
							<a href="{{ route('library-list') }}"> @lang('messages.All') @lang('messages.Liberary')</a>
						</li>
						<!--li class="{{ Request::routeIs('add-library') ? 'active' : '' }}">
							<a href="{{ route('add-library') }}"> @lang('messages.addNew') @lang('messages.Liberary')</a>
						</li-->
					</ul>
				</li>
				<li>
					<a href="{{ route('logout') }}"><i class="icon-login"></i><span class="title">@lang('messages.Logout')</span></a>				
				</li>
			@endif
		</ul>
		<!-- END SIDEBAR MENU -->
	</div>
</div>
<!-- END SIDEBAR -->