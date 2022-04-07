@extends('layouts.app')
@section('title', 'Alle filer')
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
					<th>@lang('messages.library_name')</th>
					<!--th>@lang('messages.designerName')</th-->
					<!--th>@lang('messages.created_by')</th-->
					<th>@lang('messages.download')</th>
					<th>@lang('messages.file_count')</th>
					<th>@lang('messages.view')</th>
					<th>@lang('messages.delete')</th>
				</tr>
			</thead>
			<tbody>
				@if($libraryCount != 0)
					@foreach($library as $librareis)
					<tr>
						<td>{{$librareis->library_id}}</td>					
						<td>{{$librareis->library_name}}</td>
						<!--td>{{!empty($librareis->user->name)?$librareis->user->name:''}}</td-->
						<!--td>{{!empty($librareis->createuser->name)?$librareis->createuser->name:''}}</td-->
						<td><a href="{{ route('downloadZip',$librareis->library_id) }}" class="btn btn-success" >@lang('messages.download')</a></td>
						<td>{{ $librareis->files_count}}</td>
						<td><a class='btn btn-success' href="{{ route('files-list',$librareis->library_id) }}"><i class='fa fa-eye'></i></a></td>
						<td><a class='btn btn-danger' onclick="return confirm('Are you sure you want to delete selected ?')" href="{{ route('delete-library',$librareis->library_id) }}"><i class='fa fa-trash'></i></a></td>
					</tr>
					@endforeach
				@endif
			</tbody>
		</table>
	</div>
</div>

@stop