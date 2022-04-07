@extends('layouts.app')
@section('title', 'Alle kundeemner')
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
					<th>@lang('messages.Lead') @lang('messages.name')</th>
					<th>@lang('messages.lead_link')</th>
					<th>@lang('messages.lead_type')</th>
					<th>@lang('messages.email')</th>
					<th>@lang('messages.date')</th>
					<th>@lang('messages.status')</th>
					<th>@lang('messages.edit')</th>
					<th>@lang('messages.view')</th>
					@if($role_id == 3)
					<th>@lang('messages.delete')</th>
					@endif
				</tr>
			</thead>
			<tbody>
				@foreach($leads as $lead)				
				<tr>
					<td>{{$i++}}</td>
					<td>{{(isset($lead->user))?$lead->user->name:''}}</td>
					<td>{{$lead->leads_name}}</td>
					<td>{{$lead->leads_link}}</td>
					<td>{{($lead->leads_type == 0)?"Telefonleads":"Maillead"}}</td>
					<td>{{$lead->client_email}}</td>	
					<td>{{date('M d, Y',strtotime($lead->created_at))}}</td>				
					<td id='status{{$lead->leads_id}}'>
						@if($lead->leads_status == 0)
							<a href="javascript:void(0)" rel='1' id='{{$lead->leads_id}}' class="btn blue leadStatus">@lang('messages.accept')</a>
							<a href="javascript:void(0)" rel='2' id='{{$lead->leads_id}}' class="btn red leadStatus">@lang('messages.reject')</a>
						@elseif($lead->leads_status == 1)
							<a href="javascript:void(0)" class="btn green">@lang('messages.accepted')</a>
						@elseif($lead->leads_status == 2)
							<a href="javascript:void(0)" class="btn red">@lang('messages.rejected')</a>
						@endif
					</td>
					<td><a href="{{ route('edit-leads',$lead->leads_id) }}" class="btn blue"><i class="fa fa-edit"></i></a></td>
					<td><a href="{{ route('view-leads',$lead->leads_id) }}" class="btn green"><i class="fa fa-eye"></i></a></td>
					@if($role_id == 3)
					<td><a onclick="return confirm('Are you sure you want to delete selected Lead ?')" href="{{ route('delete-leads',$lead->leads_id) }}" class="btn red"><i class="fa fa-trash"></i></a></td>
					@endif
				</tr>
				@endforeach
			</tbody>
		</table>
	</div>
</div>
<script>
	var admin_lead_status = "{{ route ('lead-status')}}";	
</script>
@stop