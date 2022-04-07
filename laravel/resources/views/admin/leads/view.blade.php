@extends('layouts.app')
@section('title', 'Vis kundeemner')
@section('content')

<div class="row">
	<div class="col-md-12">
		<!-- Begin: life time stats -->
		<div class="portlet light">
			<div class="portlet-title">
				<div class="caption">
					<i class="icon-basket font-green-sharp"></i>
					<span class="caption-subject font-green-sharp bold uppercase">@lang('messages.Lead')s #{{$leads->leads_id}} </span>
					<span class="caption-helper">{{date('M d, Y H:i:s',strtotime($leads->created_at))}}</span>
				</div>
				<div class="actions">
					<a href="{{ route('admin-leads-list') }}" class="btn btn-default btn-circle">
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
									<i class="fa fa-cogs"></i>@lang('messages.Lead')s @lang('messages.info')
								</div>
							</div>
							<div class="portlet-body">
								<div class="row static-info">
									<div class="col-md-5 name">@lang('messages.Lead')s #:</div>
									<div class="col-md-7 value">{{$leads->leads_id}}</div>
								</div>
								<div class="row static-info">
									<div class="col-md-5 name">@lang('messages.created_date'):</div>
									<div class="col-md-7 value">{{date('M d, Y H:i:s',strtotime($leads->created_at))}}</div>
								</div>
								<div class="row static-info">
									<div class="col-md-5 name">@lang('messages.Lead')s @lang('messages.name'):</div>
									<div class="col-md-7 value">{{$leads->leads_name}}</div>
								</div>
								<div class="row static-info">
									<div class="col-md-5 name">@lang('messages.lead_link'):</div>
									<div class="col-md-7 value">
										@if($leads->leads_link)
											<a href='{{$leads->leads_link}}' >@lang('messages.click_here')</a>
										@else
											Not Found
										@endif
									</div>
								</div>
								<div class="row static-info">
									<div class="col-md-5 name">@lang('messages.lead_type'):</div>
									<div class="col-md-7 value">
										@if($leads->leads_type == 1)
											Mail Lead
										@else
											Phone Lead
										@endif
									</div>
								</div>								
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
									<div class="col-md-5 name">@lang('messages.name'):</div>
									<div class="col-md-7 value">{{$leads->client_person}}</div>
								</div>
								<div class="row static-info">
									<div class="col-md-5 name">@lang('messages.email'):</div>
									<div class="col-md-7 value">{{$leads->client_email}}</div>
								</div>
								<div class="row static-info">
									<div class="col-md-5 name">@lang('messages.phone'):</div>
									<div class="col-md-7 value">{{$leads->client_phone}}</div>
								</div>
								<div class="row static-info">
									<div class="col-md-5 name">@lang('messages.client_vat'):</div>
									<div class="col-md-7 value">{{$leads->client_vat}}</div>
								</div>
								<div class="row static-info">
									<div class="col-md-5 name">@lang('messages.address'):</div>
									<div class="col-md-7 value">{{$leads->client_address}}</div>
								</div>
							</div>
						</div>
					</div>
										
				</div>
				<div class="row">
					
					<div class="col-md-12 col-sm-12">
						<div class="portlet blue-hoki box">
							<div class="portlet-title">
								<div class="caption">
									<i class="fa fa-cogs"></i>Designer @lang('messages.info')
								</div>
							</div>
							<div class="portlet-body">
								<div class="row static-info">
									<div class="col-md-5 name">@lang('messages.name'):</div>
									<div class="col-md-7 value">{{$leads->user->name}}</div>
								</div>
								<div class="row static-info">
									<div class="col-md-5 name">@lang('messages.email'):</div>
									<div class="col-md-7 value">{{$leads->user->email}}</div>
								</div>
								<div class="row static-info">
									<div class="col-md-5 name">@lang('messages.phone'):</div>
									<div class="col-md-7 value">{{$leads->user->contact}}</div>
								</div>
								<div class="row static-info">
									<div class="col-md-5 name">@lang('messages.gender'):</div>
									<div class="col-md-7 value">@if ($leads->user->designer->gender == 1 ) Male @else Female @endif</div>
								</div>
								<div class="row static-info">
									<div class="col-md-5 name">@lang('messages.dob'):</div>
									<div class="col-md-7 value">
										@if($leads->user->designer->dob)
											{{date('M d, Y',strtotime($leads->user->designer->dob))}}
										@else 
											-
										@endif
									</div>
								</div>
								<div class="row static-info">
									<div class="col-md-5 name">@lang('messages.address'):</div>
									<div class="col-md-7 value">{{$leads->user->designer->city ." , " . $leads->user->designer->state ." ". $leads->user->designer->country }}</div>
								</div>
								<div class="row static-info">
									<div class="col-md-5 name">@lang('messages.capacity'):</div>
									<div class="col-md-7 value">{{$leads->user->designer->capacity}}</div>
								</div>
								<div class="row static-info">
									<div class="col-md-5 name">@lang('messages.lead_accept'):</div>
									<div class="col-md-7 value">@if ($leads->user->designer->is_lead_accept == 0 ) No @else Yes @endif </div>
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
										<?php if($leads->comment) echo $leads->comment; else echo "No Comment found"; ?>
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