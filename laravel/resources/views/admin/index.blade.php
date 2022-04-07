@extends('layouts.app')
@section('title', 'Instrumentbræt')
@section('content')

<!-- BEGIN PAGE HEAD -->
<div class="page-head">
	<!-- BEGIN PAGE TITLE -->
	<div class="page-title">
		<h1>@yield('title')</h1>
	</div>
	<!-- END PAGE TITLE -->
</div>


<div class="row margin-top-10">
	
	<div class="col-lg-4 col-md-4 col-sm-6 col-xs-12">
		<a href="{{ route('admin-add-mail-leads') }}" class="btn btn-primary btn-dashboard-full" >@lang('messages.Create') @lang('messages.Maillead')</a>
		<div class="table-scrollable">
			<table class="table table-bordered table-hover">
				<tr>
					<th width="50%">@lang('messages.Maillead')</th>
					<th>{{$mailLeadCount}}</th>
				<tr>
				@if($mailLeadCount != 0)
					@foreach($mailLeads as $mailLead)
					<tr> 
						<td width="50%">{{!empty($mailLead->user->name)?$mailLead->user->name:'Not Assigned'}}</td>
						<td>{{$mailLead->lead_count}}</td>
					<tr>
					@endforeach
				@endif
			</table>
		</div>		
	</div>
	<div class="col-lg-4 col-md-4 col-sm-6 col-xs-12">
		<a href="{{ route('admin-add-leads') }}" class="btn btn-warning btn-dashboard-full">@lang('messages.Create') @lang('messages.Phoneleads')</a>
		<div class="table-scrollable">
			<table class="table table-bordered table-hover">
				<tr>
					<th width="50%">@lang('messages.Phoneleads')</th>
					<th>{{$phoneLeadCount}}</th>
				<tr>
				@if($phoneLeadCount != 0)
					@foreach($phoneLeads as $phoneLead)
					<tr> 
						<td width="50%">{{!empty($phoneLead->user->name)?$phoneLead->user->name:'Not Assigned'}}</td>
						<td>{{$phoneLead->lead_count}}</td>
					<tr>
					@endforeach
				@endif
			</table>
		</div>
	</div>
	<div class="col-lg-4 col-md-4 col-sm-6 col-xs-12">
		<a href="{{ route('admin-add-project') }}" class="btn btn-danger btn-dashboard-full" >@lang('messages.Create') @lang('messages.Project')</a>
		<div class="table-scrollable">
			<table class="table table-bordered table-hover">
				<tr>
					<th width="50%">@lang('messages.Projects')</th>
					<th>{{$activeProjectCount}}</th>
				<tr>
				@if($activeProjectCount != 0)
					@foreach($activeprojects as $project)
					<tr> 
						<td width="50%">{{!empty($project->user->name)?$project->user->name:''}}</td>
						<td>{{$project->pro_count}}</td>
					<tr>
					@endforeach
				@endif
			</table>
		</div>
	</div>
	
</div>

@stop