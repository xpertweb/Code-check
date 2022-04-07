@extends('layouts.app')
@section('title', 'Aktive projekter')
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
					<th>@lang('messages.action')</th>
					<th>@lang('messages.edit')</th>
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
					<td>@if($projects->project_status == 0) In Progress @else Completed @endif </td>				
					<td id='status{{$projects->project_id}}'>
						@if($projects->project_status == 0)
							<a href="{{ route('complete-update-project',$projects->project_id) }}" class="btn blue">Complete</a>
						@else
							<a href="javascript:void(0)" class="btn green">Completed</a>
						@endif
					</td>
					<td><a href="{{ route('edit-project',$projects->project_id) }}" class="btn blue"><i class="fa fa-edit"></i></a></td>
					<td><a href="{{ route('view-project',$projects->project_id) }}" class="btn green"><i class="fa fa-eye"></i></a></td>
				</tr>
				@endforeach
			</tbody>
		</table>
	</div>
</div>
@stop