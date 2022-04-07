@extends('layouts.app')
@section('title', 'Se projekt')
@section('content')

<div class="row">
	<div class="col-md-12">
		<!-- Begin: life time stats -->
		<div class="portlet light">
			<div class="portlet-title">
				<div class="caption">
					<i class="icon-basket font-green-sharp"></i>
					<span class="caption-subject font-green-sharp bold uppercase">Project #{{$project->project_id}} </span>
					<span class="caption-helper">{{date('M d, Y H:i:s',strtotime($project->created_at))}}</span>
				</div>
				<div class="actions">
					<a href="{{ route('admin-project-list') }}" class="btn btn-default btn-circle">
						<i class="fa fa-angle-left"></i>
						<span class="hidden-480">Back </span>
					</a>
				</div>
			</div>
			<div class="portlet-body">
				<div class="row">
					<div class="col-md-6 col-sm-12">
						<div class="portlet yellow-crusta box">
							<div class="portlet-title">
								<div class="caption">
									<i class="fa fa-cogs"></i>@lang('messages.project_detail')
								</div>
							</div>
							<div class="portlet-body">
								<div class="row static-info">
									<div class="col-md-5 name">@lang('messages.Project') #:</div>
									<div class="col-md-7 value">{{$project->project_id}}</div>
								</div>
								<div class="row static-info">
									<div class="col-md-5 name">@lang('messages.created_date'):</div>
									<div class="col-md-7 value">{{date('M d, Y H:i:s',strtotime($project->created_at))}}</div>
								</div>
								<div class="row static-info">
									<div class="col-md-5 name">@lang('messages.proName'):</div>
									<div class="col-md-7 value">{{$project->project_name}}</div>
								</div>
								<div class="row static-info">
									<div class="col-md-5 name">@lang('messages.link'):</div>
									<div class="col-md-7 value">
										@if($project->project_link)
											<a target="_blank" href='{{$project->project_link}}' >@lang('messages.click_here')</a>
										@else
											Not Found
										@endif
									</div>
								</div>
								<div class="row static-info">
									<div class="col-md-5 name">@lang('messages.project_status'):</div>
									<div class="col-md-7 value">
										@if($project->project_status == 0) @lang('messages.progress') @else @lang('messages.completed') @endif
									</div>
								</div>
								<div class="row static-info">
									<div class="col-md-5 name">@lang('messages.project_type'):</div>
									<div class="col-md-7 value">
										@if($project->projects_type == 0) Phone Lead @else Mail Lead @endif
									</div>
								</div>	
								@if($project->project_status == 1)
								<div class="row static-info">
									<div class="col-md-5 name">@lang('messages.Project') Doc:</div>
									<div class="col-md-7 value">
										<a target='_blank' href='{{ asset($project->project_path.'/'.$project->project_doc)}}' >@lang('messages.download')</a>
									</div>
								</div>
								@endif
							</div>
						</div>
					</div>
					<div class="col-md-6 col-sm-12">
						<div class="portlet blue-hoki box">
							<div class="portlet-title">
								<div class="caption">
									<i class="fa fa-cogs"></i>@lang('messages.client_info')
								</div>
							</div>
							<div class="portlet-body">
								<div class="row static-info">
									<div class="col-md-5 name">@lang('messages.client_name'):</div>
									<div class="col-md-7 value">{{$project->client_person}}</div>
								</div>
								<div class="row static-info">
									<div class="col-md-5 name">@lang('messages.email'):</div>
									<div class="col-md-7 value">{{$project->client_email}}</div>
								</div>
								<div class="row static-info">
									<div class="col-md-5 name">@lang('messages.client_phone'):</div>
									<div class="col-md-7 value">{{$project->client_phone}}</div>
								</div>
								<div class="row static-info">
									<div class="col-md-5 name">@lang('messages.client_vat'):</div>
									<div class="col-md-7 value">{{$project->client_vat}}</div>
								</div>
								<div class="row static-info">
									<div class="col-md-5 name">@lang('messages.client_address'):</div>
									<div class="col-md-7 value">{{$project->client_address}}</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="row">
					
					@if($project->project_status == 1)
					<div class="col-md-12 col-sm-12">
						<div class="portlet red-sunglo box">
							<div class="portlet-title">
								<div class="caption">
									<i class="fa fa-cogs"></i>@lang('messages.project_complete_comment')
								</div>
							</div>
							<div class="portlet-body">
								<div class="row static-info">
									<div class="col-md-12 value">
										<?php if($project->project_complete) echo $project->project_complete; else echo "No Complete Comment found"; ?>
									</div>
								</div>
							</div>
						</div>
					</div>
					@endif
					<div class="col-md-12 col-sm-12">
						<div class="portlet blue-hoki box">
							<div class="portlet-title">
								<div class="caption">
									<i class="fa fa-cogs"></i>@lang('messages.Designer') @lang('messages.info')
								</div>
							</div>
							<div class="portlet-body">
								<div class="row static-info">
									<div class="col-md-5 name">@lang('messages.name') :</div>
									<div class="col-md-7 value">{{$project->user->name}}</div>
								</div>
								<div class="row static-info">
									<div class="col-md-5 name">@lang('messages.Designer') @lang('messages.email'):</div>
									<div class="col-md-7 value">{{$project->user->email}}</div>
								</div>
								<div class="row static-info">
									<div class="col-md-5 name">@lang('messages.Designer') @lang('messages.phone'):</div>
									<div class="col-md-7 value">{{$project->user->contact}}</div>
								</div>
								<div class="row static-info">
									<div class="col-md-5 name">@lang('messages.Designer') @lang('messages.gender'):</div>
									<div class="col-md-7 value">@if ($project->user->designer->gender == 1 ) Male @else Female @endif</div>
								</div>
								<div class="row static-info">
									<div class="col-md-5 name">@lang('messages.dob') :</div>
									<div class="col-md-7 value">
									@if($project->user->designer->dob)
										{{date('M d, Y',strtotime($project->user->designer->dob))}}
									@else 
										-
									@endif
									</div>
								</div>
								<div class="row static-info">
									<div class="col-md-5 name">@lang('messages.address'):</div>
									<div class="col-md-7 value">{{$project->user->designer->city ." , " . $project->user->designer->state ." ". $project->user->designer->country }}</div>
								</div>
								<div class="row static-info">
									<div class="col-md-5 name">@lang('messages.capacity'):</div>
									<div class="col-md-7 value">{{$project->user->designer->capacity}}</div>
								</div>
								<div class="row static-info">
									<div class="col-md-5 name">@lang('messages.lead_accept'):</div>
									<div class="col-md-7 value">@if ($project->user->designer->is_lead_accept == 0 ) No @else Yes @endif </div>
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
									<i class="fa fa-cogs"></i>@lang('messages.comment')
								</div>
							</div>
							<div class="portlet-body">
								<div class="row static-info">
									<div class="col-md-12 value">
										<?php if($project->comment) echo $project->comment; else echo "No Comment found"; ?>
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