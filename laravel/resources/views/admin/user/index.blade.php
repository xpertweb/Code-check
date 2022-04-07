@extends('layouts.app')
@section('title', 'Alle designer')
@section('content')
@php
$i=1
@endphp
<!-- BEGIN EXAMPLE TABLE PORTLET-->
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
<div class="portlet box blue-madison">
	<div class="portlet-title">
		<div class="caption">
			<i class="fa fa-globe"></i>@yield('title')
		</div>
		<div class="tools">
			<a href="javascript:;" class="reload"></a>
		</div>
	</div>
	<div class="portlet-body">	
		<table class="table table-striped table-bordered table-hover" id="sample_2">
			<thead>
				<tr>
					<th>Sr. No</th>
					<th>@lang('messages.designerName')</th>
					<th>@lang('messages.email')</th>
					<th>@lang('messages.phone')</th>
					<th>@lang('messages.gender')</th>
					<th>@lang('messages.capacity')</th>
					<th>@lang('messages.Assigned')</th>
					<th>@lang('messages.lead_accept')</th>
					<th>@lang('messages.autologin')</th>
					<th>@lang('messages.status')</th>
					<th>@lang('messages.upgrade')</th>
					<th>@lang('messages.edit')</th>
					<th>@lang('messages.view')</th>
					<th>@lang('messages.delete')</th>
				</tr>
			</thead>
			<tbody>
				@foreach($user as $users)
			
				<tr>
					<td>{{$i++}}</td>
					<td>{{$users->name}}</td>
					<td>{{$users->email}}</td>
					<td>{{$users->contact}}</td>
					<td>@if(!empty($users->designer) && $users->designer->gender == 1) Male @else Female @endif</td>
					<td>{{!empty($users->designer)?$users->designer->capacity:''}}</td>
					<td>{{$users->process_project_count}}</td>
					<td>@if(!empty($users->designer) && $users->designer->is_lead_accept == 1) Yes @else No @endif</td>
					<td><a class="btn green" target='_blank' href="{{ route('create-access-token',$users->id)}}"><i class='fa fa-arrow-right'></i></a></td>
					<td id='status{{$users->id}}'>
						@if($users->status == 1)
							<a href="javascript:void(0)" rel='2' id='{{$users->id}}' class="btn red userStatus">Disapprove</a>
						@else
							<a href="javascript:void(0)" rel='1' id='{{$users->id}}' class="btn blue userStatus">Approve</a>
						@endif
					</td>
					<td><a href="{{ route('admin-user-upgrade',$users->id) }}" class="btn yellow">Upgrade to Admin</a></td>
					<td><a href="{{ route('admin-edit-user',$users->id) }}" class="btn blue"><i class="fa fa-edit"></i></a></td>
					<td><a href="{{ route('admin-view-user',$users->id) }}" class="btn green"><i class="fa fa-eye"></i></a></td>
					<td><a onclick="return confirm('Are you sure you want to delete selected Designer ?')" href="{{ route('admin-delete-user',$users->id) }}" class="btn red"><i class="fa fa-trash"></i></a></td>
				</tr>
				@endforeach
			</tbody>
		</table>
	</div>
</div>
<script>
	var admin_user_status = "{{ route ('admin-user-status')}}";
	var csrf_token = "{{ csrf_token() }}";
</script>
@stop