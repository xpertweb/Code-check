@extends('layouts.app')
@section('title', 'Tilføj nye kundeemner')
@section('content')

<div class="row">
	<div class="col-md-12">
		<!-- BEGIN SAMPLE FORM PORTLET-->
		<form class="leadsform" action="{{ route('add-leads') }}" method="post">
			{{ csrf_field() }}
		<div class="portlet box blue">			
			<div class="portlet-title">
				<div class="caption">
					<i class="fa fa-tasks"></i> @yield('title')
				</div>
				<!--<div class="col-sm-4 text-center" style="margin-top: 3px;">
					<div class="col-sm-4" style="font-size: 20px;color: #000;">Type:</div>
					<div class="col-sm-8">
						<select name="leads_type" class="form-control">
							<option value="0">Phone Lead</option>					
							<option value="1">Mail Lead</option>					
						</select>
					</div>
				</div>-->
				<div class="col-sm-4 text-center" style="margin-top: 3px;">
					<div class="col-sm-4" style="font-size: 18px;padding: 5px 0;">@lang('messages.name'):</div>
					<div class="col-sm-8">
						<select class="form-control" name="designer_id" >
							<option value="">@lang('messages.Designer') @lang('messages.name')</option>							
							@foreach($user as $users)
								<option @if($designer_id == $users->designer_id) selected  @endif value="{{$users->designer_id}}">{{$users->name}}</option>
							@endforeach
						</select>
					</div>
				</div>
				<div class="tools">
					<a href="" class="collapse"  ></a>					
				</div>
			</div>
			
			<div class="portlet-body form">
			
				@if ($message = Session::get('success'))
					<div class="alert alert-success text-center">
						<button type="button" class="close" data-dismiss="alert">×</button>	
						<strong>{{ $message }}</strong>
					</div>
				@endif
				
					
					<div class="form-body">
						<div class='row'>
							<div class="col-sm-6">
								<label>@lang('messages.Lead') @lang('messages.name')</label>
								<div class="input-group">
									<span class="input-group-addon"><i class="fa fa-sliders"></i></span>
									<input type="text" name='leads_name' class="form-control" value="{{old('leads_name')}}" placeholder="@lang('messages.Lead') @lang('messages.name')">
								</div>
								@if ($errors->has('leads_name'))
									<span class="help-block-error">{{ $errors->first('leads_name') }}</span>
								@endif
							</div>
							<div class="col-sm-6">
								<label>@lang('messages.email')</label>
								<div class="input-group">
									<span class="input-group-addon"><i class="fa fa-envelope"></i></span>
									<input type="text" name='client_email' class="form-control" value="{{old('client_email')}}" placeholder="@lang('messages.email')">
								</div>
								@if ($errors->has('client_email'))
									<span class="help-block-error">{{ $errors->first('client_email') }}</span>
								@endif
							</div>
							<div class="col-sm-6">
								<label>@lang('messages.client_phone')</label>
								<div class="input-group">
									<span class="input-group-addon"><i class="fa fa-phone"></i></span>
									<input type="text" name='client_phone' maxlength='12' class="form-control" value="{{old('client_phone')}}" placeholder="@lang('messages.client_phone')">
								</div>
								@if ($errors->has('client_phone'))
									<span class="help-block-error">{{ $errors->first('client_phone') }}</span>
								@endif
							</div>
							<div class="col-sm-6">
								<label>@lang('messages.client_vat')</label>
								<div class="input-group">
									<span class="input-group-addon"><i class="fa fa-sliders"></i></span>
									<input type="text" name='client_vat' class="form-control" value="{{old('client_vat')}}" placeholder="@lang('messages.client_vat')">
								</div>
								@if ($errors->has('client_vat'))
									<span class="help-block-error">{{ $errors->first('client_vat') }}</span>
								@endif
							</div>
							<div class="col-sm-6">
								<label>@lang('messages.address')</label>
								<div class="input-group">
									<span class="input-group-addon"><i class="fa fa-map-marker"></i></span>
									<input type="text" name='client_address' class="form-control" value="{{old('client_address')}}" placeholder="@lang('messages.address')">
								</div>
								@if ($errors->has('client_address'))
									<span class="help-block-error">{{ $errors->first('client_address') }}</span>
								@endif
							</div>
							
							
							<div class="col-sm-6">
								<label>@lang('messages.client_person')</label>
								<div class="input-group">
									<span class="input-group-addon"><i class="fa fa-user"></i></span>
									<input type="text" name='client_person' class="form-control" value="{{old('client_person')}}" placeholder="@lang('messages.client_person')">
								</div>
								@if ($errors->has('client_person'))
									<span class="help-block-error">{{ $errors->first('client_person') }}</span>
								@endif
							</div>
							
							<div class="col-sm-6">
								<label>@lang('messages.lead_link')</label>
								<div class="input-group">
									<span class="input-group-addon"><i class="fa fa-link"></i></span>
									<input type="text" name='leads_link' class="form-control" value="{{old('leads_link')}}" placeholder="@lang('messages.lead_link')">
								</div>
								@if ($errors->has('leads_link'))
									<span class="help-block-error">{{ $errors->first('leads_link') }}</span>
								@endif
							</div>							
						
						</div>
						<div class="form-group">
							<label>@lang('messages.comment')s</label>
							<div class="input-group">
								<textarea class="ckeditor form-control" name="comment" rows="6"  >{{old('comment')}}</textarea>
							</div>
						</div>
						
					</div>
					<div class="form-actions">
						<button type="submit" class="btn blue">@lang('messages.submit')</button>
					</div>
			</div>
		
		</div>
		</form>
		<!-- END SAMPLE FORM PORTLET-->
		
	</div>
	
</div>


@stop