@extends('layouts.app')
@section('title', 'Afviste kundeemner')
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
					<th>@lang('messages.view')</th>
				</tr>
			</thead>
			<tbody>
				@foreach($leads as $lead)
				<tr>
					<td>{{$i++}}</td>
					<td>{{$lead->user->name}}</td>
					<td>{{$lead->leads_name}}</td>
					<td>{{$lead->leads_link}}</td>
					<td>{{($lead->leads_type == 0)?"Telefonleads":"Maillead"}}</td>
					<td>{{$lead->client_email}}</td>
					<td>{{date('M d, Y',strtotime($lead->created_at))}}</td>
					
					<td><a href="{{ route('view-leads',$lead->leads_id) }}" class="btn green"><i class="fa fa-eye"></i></a></td>
				</tr>
				@endforeach
			</tbody>
		</table>
	</div>
</div>
@stop