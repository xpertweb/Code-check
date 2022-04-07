<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>	
        <meta charset="utf-8"/>
		<title>@yield('title') | Project Management System </title>	
		<!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
		<!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
		<!--[if lt IE 9]>
		<script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js') }}"></script>
		<script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js') }}"></script>
		<![endif]-->

		<link href="//fonts.googleapis.com/css?family=Open+Sans:400,300,600,700&subset=all" rel="stylesheet" type="text/css"/>
		<link href="{{ asset('assets/global/plugins/font-awesome/css/font-awesome.min.css') }}" rel="stylesheet" type="text/css"/>
		<link href="{{ asset('assets/global/plugins/simple-line-icons/simple-line-icons.min.css') }}" rel="stylesheet" type="text/css"/>
		<link href="{{ asset('assets/global/plugins/bootstrap/css/bootstrap.min.css') }}" rel="stylesheet" type="text/css"/>
		<link href="{{ asset('assets/global/plugins/uniform/css/uniform.default.css') }}" rel="stylesheet" type="text/css"/>
		<link href="{{ asset('assets/admin/pages/css/login.css') }}" rel="stylesheet" type="text/css"/>		
		<link href="{{ asset('assets/global/css/components-rounded.css') }}" id="style_components" rel="stylesheet" type="text/css"/>
		<link href="{{ asset('assets/global/css/plugins.css') }}" rel="stylesheet" type="text/css"/>
		<link href="{{ asset('assets/admin/layout/css/layout.css') }}" rel="stylesheet" type="text/css"/>
		<link href="{{ asset('assets/admin/layout/css/themes/default.css') }}" rel="stylesheet" type="text/css" id="style_color"/>
		<link href="{{ asset('assets/admin/layout/css/custom.css') }}" rel="stylesheet" type="text/css"/>
		<link href="{{ asset('css/style.css') }}" rel="stylesheet" type="text/css"/>		
		<script>
			var forget_url = "{{ route('forget-password') }}";
		</script>
    </head>
	<body  class="login">
		<div class="logo">
			<a href="#"><img src="{{ asset('assets/admin/layout4/img/logo-big.png') }}" alt=""/></a>
		</div>
			
			@yield('content')
			
		<div id='loader'>
			<img src="{{ asset('images/source.gif') }}" class='loaderImg' />
		</div>
		
		
		<script src="{{ asset('assets/global/plugins/jquery.min.js') }}" type="text/javascript"></script>
		<script src="{{ asset('assets/global/plugins/jquery-migrate.min.js') }}" type="text/javascript"></script>
		<script src="{{ asset('assets/global/plugins/bootstrap/js/bootstrap.min.js') }}" type="text/javascript"></script>
		<script src="{{ asset('assets/global/plugins/jquery.blockui.min.js') }}" type="text/javascript"></script>
		<script src="{{ asset('assets/global/plugins/uniform/jquery.uniform.min.js') }}" type="text/javascript"></script>
		<script src="{{ asset('assets/global/plugins/jquery.cokie.min.js') }}" type="text/javascript"></script>
		<!-- END CORE PLUGINS -->
		<!-- BEGIN PAGE LEVEL PLUGINS -->
		<script src="{{ asset('assets/global/plugins/jquery-validation/js/jquery.validate.min.js') }}" type="text/javascript"></script>
		<!-- END PAGE LEVEL PLUGINS -->
		<!-- BEGIN PAGE LEVEL SCRIPTS -->
		<script src="{{ asset('assets/global/scripts/metronic.js') }}" type="text/javascript"></script>
		<script src="{{ asset('assets/admin/layout/scripts/layout.js') }}" type="text/javascript"></script>
		<script src="{{ asset('assets/admin/layout/scripts/demo.js') }}" type="text/javascript"></script>
		<script src="{{ asset('assets/admin/pages/scripts/login.js') }}" type="text/javascript"></script>
		<script src="{{ asset('js/script.js') }}"></script>
		
		<!-- END PAGE LEVEL SCRIPTS -->
		<script>
		jQuery(document).ready(function() 
		{
			Metronic.init(); // init metronic core components
			Layout.init(); // init current layout
			Login.init();
			Demo.init();
		});
		</script>	
    </body>
</html>
