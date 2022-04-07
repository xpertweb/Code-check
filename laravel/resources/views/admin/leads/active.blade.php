@extends('layouts.app')
@section('title', 'Aktive kundeemner')
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
					<th>@lang('messages.Designer') @lang('messages.name')</th>
					<th>@lang('messages.Lead') @lang('messages.name')</th>
					<th>@lang('messages.lead_type')</th>
					<th>@lang('messages.email')</th>
					<th>@lang('messages.date')</th>
					<th>@lang('messages.edit')</th>
					<th>@lang('messages.view')</th>
					<th>@lang('messages.delete')</th>
				</tr>
			</thead>
			<tbody>
				@foreach($leads as $lead)
				<tr>
					<td>{{$i++}}</td>
					<td>{{!empty($lead->user)?$lead->user->name:''}}</td>
					<td>{{$lead->leads_name}}</td>
					<td>{{($lead->leads_type == 0)?"Telefonleads":"Maillead"}}</td>
					<td>{{$lead->client_email}}</td>
					<td>{{date('M d, Y',strtotime($lead->created_at))}}</td>
					<td><a href="{{ route('admin-edit-leads',$lead->leads_id) }}" class="btn blue"><i class="fa fa-edit"></i></a></td>
					<td><a href="{{ route('admin-view-leads',$lead->leads_id) }}" class="btn green"><i class="fa fa-eye"></i></a></td>
					<td><a onclick="return confirm('Are you sure you want to delete selected leads ?')" href="{{ route('admin-delete-leads',$lead->leads_id) }}" class="btn red"><i class="fa fa-trash"></i></a></td>
				</tr>
				@endforeach
			</tbody>
		</table>
	</div>
</div>
@stop