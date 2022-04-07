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

<div class="row">
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
</div>
@if($role_id == 3)
<div class="row margin-top-10">
	
	<div class="col-lg-4 col-md-4 col-sm-6 col-xs-12">
		<a href="{{ route('admin-add-mail-leads') }}" class="btn btn-primary btn-dashboard-full" >@lang('messages.Create') @lang('messages.Maillead')</a>
	
	</div>
	<div class="col-lg-4 col-md-4 col-sm-6 col-xs-12">
		<a href="{{ route('admin-add-leads') }}" class="btn btn-warning btn-dashboard-full">@lang('messages.Create') @lang('messages.Phoneleads')</a>

	</div>
	<div class="col-lg-4 col-md-4 col-sm-6 col-xs-12">
		<a href="{{ route('admin-add-project') }}" class="btn btn-danger btn-dashboard-full" >@lang('messages.Create') @lang('messages.Project')</a>
	</div>
	
</div>
@endif

<div class="row margin-top-10">
	
	<div class="col-lg-4 col-md-4 col-sm-6 col-xs-12">
		<div class="dashboard-stat2">
			<div class="display">
				<div class="number">
					<h3 class="font-blue-sharp">{{$projectCount}}</h3>
					<small>@lang('messages.totPro')</small>
				</div>
				<div class="icon">
					<i class="icon-handbag"></i>
				</div>
			</div>
			<div class="progress-info">
				<div class="progress">
					<span style="width: 100%;" class="progress-bar progress-bar-success blue-sharp">
						<span class="sr-only">100% grow</span>
					</span>
				</div>
				<div class="status">
					<div class="status-title">
						<a href="{{ route('project-list') }}">@lang('messages.viewmore')</a>
					</div>
				</div>
			</div>
		</div>
	</div>
	
	<div class="col-lg-4 col-md-4 col-sm-6 col-xs-12">
		<div class="dashboard-stat2">
			<div class="display">
				<div class="number">
					<h3 class="font-blue-sharp">{{$phoneLeadCount}}</h3>
					<small>@lang('messages.Total') @lang('messages.Phoneleads')</small>
				</div>
				<div class="icon">
					<i class="icon-handbag"></i>
				</div>
			</div>
			<div class="progress-info">
				<div class="progress">
					<span style="width: 100%;" class="progress-bar progress-bar-success blue-sharp">
						<span class="sr-only">100% grow</span>
					</span>
				</div>
				<div class="status">
					<div class="status-title">
						<a href="{{ route('leads-list') }}">@lang('messages.viewmore')</a>
					</div>
				</div>
			</div>
		</div>
	</div>
	
	<div class="col-lg-4 col-md-4 col-sm-6 col-xs-12">
		<div class="dashboard-stat2">
			<div class="display">
				<div class="number">
					<h3 class="font-green-sharp">{{$mailLeadCount}}</h3>
					<small>@lang('messages.Total') @lang('messages.Maillead')</small>
				</div>
				<div class="icon">
					<i class="icon-handbag"></i>
				</div>
			</div>
			<div class="progress-info">
				<div class="progress">
					<span style="width: 100%;" class="progress-bar progress-bar-success green-sharp">
					<span class="sr-only">100% progress</span>
					</span>
				</div>
				<div class="status">
					<div class="status-title">
						<a href="{{ route('leads-list') }}">@lang('messages.viewmore')</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

{{-- @if($role_id == 2)--}}
@if(1==1)
<div class="row">
	
	<div class="col-lg-4 col-md-4 col-sm-6 col-xs-12">
		<div class="portlet box purple">
			<div class="portlet-title">
				<div class="caption">
					<i class="fa fa-gift"></i> @lang('messages.Active') @lang('messages.Projects')
				</div>
			</div>
			<div class="portlet-body form">
				<div class="table-scrollable form-body">
					<table class="table table-striped table-hover">
						<tr>
							<th>@lang('messages.name')</th>
							<th>@lang('messages.Reminder')</th>
							<th>@lang('messages.Actions')</th>
						</tr>
						@if(count($projects) != 0)
							@foreach($projects as $project)
								<tr>
									<th>{{$project->project_name}}</th>
									<th><button data-toggle="tooltip" data-placement="top" title="{{!empty($project->reminder_text)?$project->reminder_text:''}}">{{(strtotime($project->reminder)>634003200)?date('d-M-Y',strtotime($project->reminder)):(!empty($project->reminder_text)?$project->reminder_text:'--')}}</button></th>
									<th>
										<a class="btn btn-xs green" href="javascript:addReminder({{$project->project_id}})" >@lang('messages.Reminder')</a>
										<a class="btn btn-xs blue" onClick="return confirm('Are you sure you want to complete the project?');" href="{{ route('complete-update-project',$project->project_id) }}" >@lang('messages.Complete')</a>
									</th>
								</tr>
							@endforeach
						@else
							<tr>
								<th colspan='3'>@lang('messages.NoRecordFound')</th>
							</tr>
						@endif
					</table>
				</div>	
			</div>
		</div>	
	</div>
	
	<div class="col-lg-4 col-md-4 col-sm-6 col-xs-12">
		<div class="portlet box blue">
			<div class="portlet-title">
				<div class="caption">
					<i class="fa fa-gift"></i> @lang('messages.Active') @lang('messages.Phoneleads')
				</div>
			</div>
			<div class="portlet-body form">
				<div class="table-scrollable form-body">
					<table class="table table-striped table-hover">
						<tr>
							<th>@lang('messages.name')</th>
							<th>@lang('messages.Reminder')</th>
							<th>@lang('messages.Actions')</th>
						</tr>
						@if(count($phoneLeads) != 0)
							@foreach($phoneLeads as $phoneLead)
								<tr>
									<th>{{$phoneLead->leads_name}}</th>
									<th><button data-toggle="tooltip" data-placement="top" title="{{!empty($phoneLead->reminder_text)?$phoneLead->reminder_text:''}}">{{(strtotime($phoneLead->reminder)>634003200)?date('d-M-Y',strtotime($phoneLead->reminder)):(!empty($phoneLead->reminder_text)?$phoneLead->reminder_text:'--')}}
									</button>
									</th>
									<th>
										<a class="btn btn-xs green" href="javascript:addLeadReminder({{$phoneLead->leads_id}})" > Reminder</a>
										<span id='status{{$phoneLead->leads_id}}'>
											@if($phoneLead->leads_status == 0)
												<a href="javascript:void(0)" rel='1' id='{{$phoneLead->leads_id}}' class="btn btn-xs blue leadStatus">@lang('messages.accept')</a>
												<a href="javascript:void(0)" rel='2' id='{{$phoneLead->leads_id}}' class="btn btn-xs red leadStatus">@lang('messages.reject')</a>
											@elseif($phoneLead->leads_status == 1)
												<a href="javascript:void(0)" class="btn btn-xs green">@lang('messages.accepted')</a>
											@elseif($phoneLead->leads_status == 2)
												<a href="javascript:void(0)" class="btn btn-xs red">@lang('messages.rejected')</a>
											@endif
										</span>
									</th>
								</tr>
							@endforeach
						@else
							<tr>
								<th colspan='3'>@lang('messages.NoRecordFound')</th>
							</tr>
						@endif
					</table>
				</div>	
			</div>
		</div>	
	</div>
	
	<div class="col-lg-4 col-md-4 col-sm-6 col-xs-12">
		<div class="portlet box yellow">
			<div class="portlet-title">
				<div class="caption">
					<i class="fa fa-gift"></i> @lang('messages.Active') @lang('messages.Maillead')
				</div>
			</div>
			<div class="portlet-body form">
				<div class="table-scrollable form-body">
					<table class="table table-striped table-hover">
						<tr>
							<th>@lang('messages.name')</th>
							<th>@lang('messages.Reminder')</th>
							<th>@lang('messages.Actions')</th>
						</tr>
						@if(count($mailLeads) != 0)
							@foreach($mailLeads as $mailLead)
								<tr>
									<th>{{$mailLead->leads_name}}</th>
									<th><button data-toggle="tooltip" data-placement="top" title="{{!empty($mailLead->reminder_text)?$mailLead->reminder_text:''}}">{{(strtotime($mailLead->reminder)>634003200)?date('d-M-Y',strtotime($mailLead->reminder)):(!empty($mailLead->reminder_text)?$mailLead->reminder_text:'--')}}</button></th>
									<th>
										<a class="btn btn-xs green" href="javascript:addLeadReminder({{$mailLead->leads_id}})" > Reminder</a>
										
										<span id='status{{$mailLead->leads_id}}'>
											@if($mailLead->leads_status == 0)
												<a href="javascript:void(0)" rel='1' id='{{$mailLead->leads_id}}' class="btn btn-xs blue leadStatus">@lang('messages.accept')</a>
												<a href="javascript:void(0)" rel='2' id='{{$mailLead->leads_id}}' class="btn btn-xs red leadStatus">@lang('messages.reject')</a>
											@elseif($mailLead->leads_status == 1)
												<a href="javascript:void(0)" class="btn btn-xs green">@lang('messages.accepted')</a>
											@elseif($mailLead->leads_status == 2)
												<a href="javascript:void(0)" class="btn btn-xs red">@lang('messages.rejected')</a>
											@endif
										</span>										
									</th>
								</tr>
							@endforeach
						@else
							<tr>
								<th colspan='3'>@lang('messages.NoRecordFound')</th>
							</tr>
						@endif
					</table>
				</div>	
			</div>
		</div>	
	</div>
	
	
</div>
@endif

@include("designer.modals.leadReminder")
@include("designer.modals.reminder")
<script>
	var add_reminder = "{{ route('add-reminder') }}";
	var add_pro_reminder = "{{ route('update-pro-reminder') }}";
	var add_lead_reminder = "{{ route('add-lead-reminder') }}";
	var update_lead_reminder = "{{ route('update-lead-reminder') }}";
	var admin_lead_status = "{{ route ('dashboard-lead-status')}}";
</script>

<script>
$(document).ready(function(){
  $('[data-toggle="tooltip"]').tooltip();
$('.standard_text').on('click',function(){
    $('#pro_reminder_text').val($(this).val());
    $('#reminder_text').val($(this).val());
});
});
</script>
@stop