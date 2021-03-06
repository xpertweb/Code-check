@extends('layouts.app-statistics')
@section('title', 'Statistics')
@section('content')

<div class="row">
	<div class="col-md-12">
		<!-- BEGIN SAMPLE FORM PORTLET-->
		<div class="portlet box blue profile-pairent">
			<div class="portlet-title">
				<div class="caption">
					<i class="fa fa-tasks"></i> @yield('title')
				</div>
				<div class="tools">
					<a href="" class="collapse" ></a>					
				</div>
			</div>
			
			<div class="portlet-body form" >
				<div class="form-group">
					<div class="portlet-title">
						<div class="portlet light">
							<div class="caption pull-left">
								<i class="icon-bar-chart font-green-haze"></i>
								<span class="caption-subject bold uppercase font-green-haze">New Project and Lead Report of {{$month}} of {{ $year }}'s</span>
							</div>
							<div class="col-md-3 pull-right">
								<select class="form-control selectYear" >
									<option value=''>Select Year</option>
									@for($j = 2019; $j <= date('Y'); $j++)
										<option @if($year == $j) selected @endif  value='{{$j}}'>{{$j}}</option> 
									@endfor
								</select>
							</div>
							<div class="col-md-3 pull-right">
								<select class="form-control selectMonth" >
									<option value=''>Select Month</option>
									@for($k = 1; $k <= 12; $k++)
										<option @if($months == $k) selected @endif  value='{{$k}}'>{{date('M',strtotime('01-'.$k.'-'.$year))}}</option> 
									@endfor
								</select>
							</div>
						</div>
					</div>
					<div id="chart_2" class="chart" style="height: 400px;"></div>
				</div>
				<br><br>
				<div class="form-group">
					<div class="portlet-title">
						<div class="portlet light">
							<div class="caption pull-left">
								<i class="icon-bar-chart font-green-haze"></i>
								<span class="caption-subject bold uppercase font-green-haze">New Project and Lead Report of {{ $year }}'s</span>
							</div>
							<div class="col-md-4 pull-right">
								<select class="form-control selectYear" >
									<option value=''>Select Year</option>
									@for($j = 2019; $j <= date('Y'); $j++)
										<option @if($year == $j) selected @endif  value='{{$j}}'>{{$j}}</option> 
									@endfor
								</select>
							</div>
						</div>
					</div>
					<div id="chart_1" class="chart" style="height: 400px;"></div>
				</div>
			</div>		
		</div>	
	</div>	
</div>

<script>
$(document).ready(function(){
	$('.selectYear').change(function(){
		var year = $(this).val();
		var month = $('.selectMonth').val();
		var statistics = "{{ route('admin-statistics') }}";
		window.location.href = statistics+"?year="+year+"&month="+month;
	});
	$('.selectMonth').change(function(){
		var year = $('.selectYear').val();
		var month = $(this).val();
		var statistics = "{{ route('admin-statistics') }}";
		window.location.href = statistics+"?year="+year+"&month="+month;
	});
});
</script>
<script>
var ChartsAmcharts = function() {
	
	var newLeadsArr = @json($newLeadsArr, JSON_PRETTY_PRINT);
	var newYearLeads = @json($newYearLeads, JSON_PRETTY_PRINT);
	
	
    var initChartSample1 = function() {
        var chart = AmCharts.makeChart("chart_1", {
            "type": "serial",
            "theme": "light",
            "pathToImages": Metronic.getGlobalPluginsPath() + "amcharts/amcharts/images/",
            "autoMargins": false,
            "marginLeft": 30,
            "marginRight": 8,
            "marginTop": 10,
            "marginBottom": 26,
            "fontFamily": 'Open Sans',
            "color":    '#888',
            "dataProvider": newYearLeads ,
            "valueAxes": [{
                "axisAlpha": 0,
                "position": "left"
            }],
            "startDuration": 1,
            "graphs": [{
                "alphaField": "alpha",                
                "balloonText": "<span style='font-size:13px;'>[[title]] in <b>[[category]]</b> :<b>Count : ([[value]]) </b> [[additional]]</span>",
                "dashLengthField": "dashLengthColumn",
                "fillAlphas": 1,
                "title": "New Phone Leads",
                "type": "column",
                "valueField": "newPhoneLeads"
            },{
                "alphaField": "alpha",                
                "balloonText": "<span style='font-size:13px;'>[[title]] in <b>[[category]]</b> :<b>Count : ([[value]]) </b> [[additional]]</span>",
                "dashLengthField": "dashLengthColumn",
                "fillAlphas": 1,
                "title": "New Leads",
                "type": "column",
                "valueField": "newMailLeads"
            }, {
                /* "balloonText": "<span style='font-size:13px;'>[[title]] in <b>[[category]]</b> : <b>Count : ([[value]]) </b></span>",
                "bullet": "round",
                "dashLengthField": "dashLengthLine",
                "lineThickness": 3,
                "bulletSize": 7,
                "bulletBorderAlpha": 1,
                "bulletColor": "#FFFFFF",
                "useLineColorForBulletBorder": true,
                "bulletBorderThickness": 3,
                "fillAlphas": 0,
                "lineAlpha": 1, */
				"alphaField": "alpha",                
                "balloonText": "<span style='font-size:13px;'>[[title]] in <b>[[category]]</b> :<b>Count : ([[value]]) </b> [[additional]]</span>",
                "dashLengthField": "dashLengthColumn",
                "fillAlphas": 1,
				"title": "New Projects",
				"type": "column",
				"valueField": "newProjects"
            }],
            "categoryField": "month",
            "categoryAxis": {
                "gridPosition": "start",
                "axisAlpha": 0,
                "tickLength": 0
            }
        });
        $('#chart_1').closest('.portlet').find('.fullscreen').click(function() {
            chart.invalidateSize();
        });
    } 
	
	var initChartSample2 = function() {
        var chart1 = AmCharts.makeChart("chart_2", {
            "type": "serial",
            "theme": "light",
            "pathToImages": Metronic.getGlobalPluginsPath() + "amcharts/amcharts/images/",
            "autoMargins": false,
            "marginLeft": 30,
            "marginRight": 8,
            "marginTop": 10,
            "marginBottom": 26,
            "fontFamily": 'Open Sans',
            "color":    '#888',
            "dataProvider": newLeadsArr ,
            "valueAxes": [{
                "axisAlpha": 0,
                "position": "left"
            }],
            "startDuration": 1,
            "graphs": [{
                "alphaField": "alpha",
                "balloonText": "<span style='font-size:13px;'>[[title]] in <b>[[category]]</b> :<b>Count : ([[value]]) </b> [[additional]]</span>",
                "dashLengthField": "dashLengthColumn",
                "fillAlphas": 1,
                "title": "New Phone Leads",
                "type": "column",
                "valueField": "newPhoneLeads"
            },
			{
                "alphaField": "alpha",                
                "balloonText": "<span style='font-size:13px;'>[[title]] in <b>[[category]]</b> :<b>Count : ([[value]]) </b> [[additional]]</span>",
                "dashLengthField": "dashLengthColumn",
                "fillAlphas": 1,
                "title": "New Leads",
                "type": "column",
                "valueField": "newMailLeads"
            },			{
               /*  "balloonText": "<span style='font-size:13px;'>[[title]] in <b>[[category]]</b> : <b>Count : ([[value]]) </b></span>",
                "bullet": "round",
                "dashLengthField": "dashLengthLine",
                "lineThickness": 3,
                "bulletSize": 7,
                "bulletBorderAlpha": 1,
                "bulletColor": "#FFFFFF",
                "useLineColorForBulletBorder": true,
                "bulletBorderThickness": 3,
                "fillAlphas": 0,
                "lineAlpha": 1, */
				"alphaField": "alpha",
                "balloonText": "<span style='font-size:13px;'>[[title]] in <b>[[category]]</b> :<b>Count : ([[value]]) </b> [[additional]]</span>",
                "dashLengthField": "dashLengthColumn",
                "fillAlphas": 1,
				 "type": "column",
                "title": "New Projects",
                "valueField": "newProjects"
            }],
            "categoryField": "day",
            "categoryAxis": {
                "gridPosition": "start",
                "axisAlpha": 0,
                "tickLength": 0
            }
        });
        $('#chart_2').closest('.portlet').find('.fullscreen').click(function() {
            chart1.invalidateSize();
        });
    } 

    return {
        init: function() {
            initChartSample1();
            initChartSample2();
        }
    };

}();
</script>
@stop