@extends('layouts.app')
@section('title', 'Udførte projekter')
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
					<th>@lang('messages.proName')</th>
					<th>@lang('messages.link')</th>
					<th>@lang('messages.cemail')</th>
					<th>@lang('messages.status')</th>
					<th>@lang('messages.date')</th>
					<th>@lang('messages.view')</th>
				</tr>
			</thead>
			<tbody>
				@foreach($project as $projects)
				<tr>
					<td>{{$i++}}</td>
					<td>{{$projects->user->name}}</td>
					<td>{{$projects->project_name}}</td>
					<td>{{$projects->project_link}}</td>
					<td>{{$projects->client_email}}</td>
					<td>@if($projects->project_status == 0) @lang('messages.progress') @else @lang('messages.completed') @endif </td>
					<td>{{date('M d, Y', strtotime($projects->created_at))}}</td>
					<td><a href="{{ route('view-project',$projects->project_id) }}" class="btn green"><i class="fa fa-eye"></i></a></td>
				</tr>
				@endforeach
			</tbody>
		</table>
	</div>
</div>
@stop