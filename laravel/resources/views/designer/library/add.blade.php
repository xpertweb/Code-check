@extends('layouts.app')
@section('title', 'Tilføj ny filer')
@section('content')

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
	<div class="portlet-body form">		
		<form class="libraryform" action="{{ route('add-library') }}" method="post" enctype='multipart/form-data'>
			<input type='hidden' name='designer_id' value='{{Auth::user()->id}}' />
			{{ csrf_field() }}
			<div class="form-body">
				<div class="row">
					<div class="col-sm-12">
						<label>@lang('messages.library_name')</label>
						<div class="input-group">
							<span class="input-group-addon"><i class="fa fa-sliders"></i></span>
							<input type="text" name='library_name' class="form-control" value="{{old('library_name')}}" placeholder="@lang('messages.library_name')">
						</div>
						@if ($errors->has('library_name'))
							<span class="help-block-error">{{ $errors->first('library_name') }}</span>
						@endif
					</div>
					
					<div class="col-sm-12">
						<label>@lang('messages.select_file')</label>
						<div class="input-group">
							<span class="input-group-addon"><i class="fa fa-envelope"></i></span>
							<input type="file" name='filename' class="form-control" required />
						</div>
						@if ($errors->has('filename'))
							<span class="help-block-error">{{ $errors->first('filename') }}</span>
						@endif
					</div>
				</div>
			</div>
			<div class="form-actions">
				<button type="submit" class="btn blue">@lang('messages.submit')</button>
			</div>
		</form>
	</div>
</div>

@stop