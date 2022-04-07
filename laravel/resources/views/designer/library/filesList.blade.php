@extends('layouts.app')
@section('title', 'Liste over filer')
@section('content')

<!-- BEGIN EXAMPLE TABLE PORTLET-->
@if ($message = Session::get('success'))
	<div class="alert alert-success text-center">
		<button type="button" class="close" data-dismiss="alert">×</button>	
		<strong>{{ $message }}</strong>
	</div>
@endif
@if ($error = $errors->first('filename'))
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
		<div class=''>
			<div class='col-sm-4 pull-left'>
				<!--a class="btn btn-primary" data-toggle="modal" href="#basic">@lang('messages.upload_file')</a-->
				@if($filesCount != 0)
					<a href="{{ route('downloadZip',$library_id) }}" class="btn btn-success" >@lang('messages.download')</a>
				@endif
			</div>
		</div>
		<table class="table table-striped table-bordered table-hover" id="sample_2">
			<thead>
				<tr>
					<th>Sr. No</th>
					<th>@lang('messages.library_name')</th>
					<th>@lang('messages.uploaded_by')</th>
					<th>@lang('messages.file_name')</th>
					<th>@lang('messages.file_type')</th>
					<th>@lang('messages.date')</th>
					<th>@lang('messages.delete')</th>
				</tr>
			</thead>
			<tbody>
			    @if($filesCount != 0)
					@foreach($files as $file)	
					  <tr>
						<td>{{$file->file_id}}</td>
						<td>{{!empty($files[0]->library->library_name)?$files[0]->library->library_name:''}}</td>
						<td>{{$file->createuser->name}}</td>
						<td>{{($file->original_name)}}</td>
						<td>{{strtoupper($file->file_type)}}</td>
						<td>{{date('M d Y',strtotime($file->created_at))}}</td>					
						<td><a class='btn btn-danger' onclick="return confirm('Are you sure you want to delete selected ?')" href="{{ route('delete-file',$file->file_id) }}"><i class='fa fa-trash'></i></a></td>
					  </tr>	
					@endforeach
				@endif
			</tbody>
		</table>	
	</div>
</div>
<div class="modal fade" id="basic" tabindex="-1" role="basic" aria-hidden="true">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
				<h4 class="modal-title">@lang('messages.upload_file')</h4>
			</div>
			<form action="{{ route('upload-file') }}" method='post' enctype='multipart/form-data' >
				{{ csrf_field() }}
				<input type='hidden' name='library_id' value='{{!empty($library_id)?$library_id:''}}' />
				<div class="modal-body">
					<div class="form-group">
						<label> @lang('messages.select_file')</label>
						<div class="input-group">
							<span class="input-group-addon"><i class="fa fa-file"></i></span>
							<input type="file" name='filename' required class="form-control" value="{{old('filename')}}" placeholder="@lang('messages.select_file')">
						</div>
					</div>	
				</div>
				<div class="modal-footer">
					<button type="button" class="btn default" data-dismiss="modal">@lang('messages.close')</button>
					<button type="submit" class="btn blue">@lang('messages.save')</button>
				</div>
			</form>	
		</div>
		<!-- /.modal-content -->
	</div>
	<!-- /.modal-dialog -->
</div>
@stop