@extends('layouts.app')
@section('title', 'Se Admin')
@section('content')

<div class="row">
	<div class="col-md-12">
		<!-- Begin: life time stats -->
		<div class="portlet light">
			<div class="portlet-title">
				<div class="caption">
					<i class="icon-eye font-green-sharp"></i>
					<span class="caption-subject font-green-sharp bold uppercase">@yield('title') #{{$user->id}} </span>
					<span class="caption-helper">{{date('M d, Y H:i:s',strtotime($user->created_at))}}</span>
				</div>
				<div class="actions">
					<a href="{{ route('admin-user-list') }}" class="btn btn-default btn-circle">
						<i class="fa fa-angle-left"></i>
						<span class="hidden-480">Back </span>
					</a>
				</div>
			</div>
			<div class="portlet-body">
				<div class="row">
					<div class="col-md-12 col-sm-12">
						<div class="portlet blue-hoki box">
							<div class="portlet-title">
								<div class="caption">
									<i class="fa fa-cogs"></i>@lang('messages.subadmin') @lang('messages.info')
								</div>
							</div>
							<div class="portlet-body">
								<div class="row static-info">
									<div class="col-md-5 name">@lang('messages.name'):</div>
									<div class="col-md-7 value">{{$user->name}}</div>
								</div>
								<div class="row static-info">
									<div class="col-md-5 name">@lang('messages.email'):</div>
									<div class="col-md-7 value">{{$user->email}}</div>
								</div>
								<div class="row static-info">
									<div class="col-md-5 name">@lang('messages.phone'):</div>
									<div class="col-md-7 value">{{$user->contact}}</div>
								</div>
								<div class="row static-info">
									<div class="col-md-5 name">@lang('messages.gender'):</div>
									<div class="col-md-7 value">@if ($user->subadmin->gender == 1 ) Male @else Female @endif</div>
								</div>
								<div class="row static-info">
									<div class="col-md-5 name">@lang('messages.dob'):</div>
									<div class="col-md-7 value">
										@if($user->subadmin->dob)
											{{date('M d, Y',strtotime($user->subadmin->dob))}}
										@else 
											-
										@endif
									</div>
								</div>
								<div class="row static-info">
									<div class="col-md-5 name">@lang('messages.address'):</div>
									<div class="col-md-7 value">{{$user->subadmin->city ." , " . $user->subadmin->state ." ". $user->subadmin->country }}</div>
								</div>
							</div>
						</div>
					</div>
				
				</div>
				<div class="row">
					<div class="col-md-6 col-sm-12">
						<div class="portlet red-sunglo box">
							<div class="portlet-title">
								<div class="caption">
									<i class="fa fa-cogs"></i> @lang('messages.description')
								</div>
							</div>
							<div class="portlet-body">
								<div class="row static-info">
									<div class="col-md-12 value">
										<?php if($user->subadmin->description) echo $user->subadmin->description; else echo "No Description found"; ?>
									</div>
								</div>
							</div>
						</div>
					</div>
				
				</div>
				
			</div>
		</div>
		<!-- End: life time stats -->
	</div>
</div>




@stop