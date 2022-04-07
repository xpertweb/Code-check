<?php
if (!defined('ABSPATH')) {  exit;}
global $wp_query;

class SearchForm
{
    public $assets_url;
    public $ajax_url;
    public $theme_path;
    public $file_version;
	
    public function __construct()
    {		
		add_action('init',array($this,'register_session'));			
		add_action('wp_enqueue_scripts', array($this,'myplugin_ajaxurl'),10,1);
		add_action( 'wp_enqueue_scripts', array( &$this, 'enqueue_styles' ), 10, 1 );
		add_action( 'wp_enqueue_scripts', array( &$this, 'enqueue_scripts' ), 10, 1 );
		add_action( 'customize_register', array( &$this, 'yatch_customize_register' ), 10, 1  );
		
		// admin JS & CSS
		add_action( 'admin_enqueue_scripts', array( &$this, 'admin_enqueue_scripts' ), 10, 1);
		add_action( 'admin_enqueue_scripts', array( &$this, 'admin_enqueue_styles' ), 10, 1);	
		
		// ajax method
		add_action("wp_ajax_submit_form", "submit_form");
		add_action("wp_ajax_nopriv_submit_form", "submit_form");
	
		$this->assets_url = get_stylesheet_directory_uri().'/assets'; 
		$this->ajax_url = admin_url('admin-ajax.php'); 	
		$this->theme_path = dirname(__FILE__).'/';	
		$this->file_version = ''; 
		
		/* shortcode */
		add_shortcode('home-page-filter',array($this,'home_page_filter'));
		add_shortcode('red-navbar-home',array($this,'red_navbar_home'));
		add_shortcode('how-it-works',array($this,'how_it_works'));
		
		add_shortcode('log-in',array($this,'log_in'));
		add_shortcode('sign-up',array($this,'sign_up'));		
		add_shortcode('reset-password',array($this,'reset_password'));
		add_shortcode('new-password',array($this,'new_password'));
		add_shortcode('news-letter',array($this,'news_letter'));
		add_shortcode('booking-experts',array($this,'booking_experts'));
		add_shortcode('special-offers',array($this,'special_offers'));
		add_shortcode('holiday-reach-text',array($this,'holiday_reach_text'));
	
		
		add_shortcode('property-slider',array($this,'property_slider'));
		add_shortcode('latest-reviews',array($this,'latest_reviews'));
		add_shortcode('property-info',array($this,'property_info'));
		add_shortcode('search-results',array($this,'avrlinecore_search_results'));
		
    }
	
	function holiday_reach_text(){
		
		$template = $this->theme_path. 'template/home/holiday-reach-text.php';
	
		ob_start();
		include($template);
		$output = ob_get_clean();
		return $output;
		
	}
	
	public function home_page_filter()
	{
		$PageID     = get_the_ID();
		
		if($PageID != '12447'){
			$template = $this->theme_path. 'template/home/home-filter.php';
		
			ob_start();
			include($template);
			$output = ob_get_clean();
			return $output;
		}
		
	}
	
	public function red_navbar_home()
	{		
		$template = $this->theme_path. 'template/red-navbar-home.php';
	
		ob_start();
		include($template);
		$output = ob_get_clean();
		return $output;
		
	}
	
	public function how_it_works()
	{		
		$template = $this->theme_path. 'template/how-it-works.php';
	
		ob_start();
		include($template);
		$output = ob_get_clean();
		return $output;
		
	}
	
	public function log_in()
	{		
		$template = $this->theme_path. 'template/log-in.php';
	
		ob_start();
		include($template);
		$output = ob_get_clean();
		return $output;
		
	}
	
	public function sign_up()
	{		
		$template = $this->theme_path. 'template/sign-up.php';
	
		ob_start();
		include($template);
		$output = ob_get_clean();
		return $output;
		
	}


	public function reset_password()
	{		
		$template = $this->theme_path. 'template/reset-password.php';
	
		ob_start();
		include($template);
		$output = ob_get_clean();
		return $output;
		
	}

	public function new_password()
	{		
		$template = $this->theme_path. 'template/new-password.php';
	
		ob_start();
		include($template);
		$output = ob_get_clean();
		return $output;
		
	}

	public function news_letter()
	{		
		$template = $this->theme_path. 'template/news-letter.php';
	
		ob_start();
		include($template);
		$output = ob_get_clean();
		return $output;
		
	}

	public function booking_experts()
    { 	
		$template = $this->theme_path. 'template/home/booking-experts.php';
	
		ob_start();
		include($template);
		$output = ob_get_clean();
		return $output;
    }
	
	public function special_offers()
    { 	
		$template = $this->theme_path. 'template/home/special-offers.php';
	
		ob_start();
		include($template);
		$output = ob_get_clean();
		return $output;
    }
	
	
	public function property_info($outerParam = [])
    { 	
		$template = $this->theme_path. 'template/property/property-info.php';
	
		ob_start();
		include($template);
		$output = ob_get_clean();
		return $output;
    }
	
	public function property_slider($outerParam = [])
    { 	
		$template = $this->theme_path. 'template/home/popular-articles.php';
	
		ob_start();
		include($template);
		$output = ob_get_clean();
		return $output;
    }
	
	
	public function latest_reviews($outerParam = []){
		
		$template = $this->theme_path. 'template/home/latest-reviews.php';
	
		ob_start();
		include($template);
		$output = ob_get_clean();
		return $output;

	}
	
	public function admin_enqueue_scripts(  ) {
		
		wp_enqueue_script( 'admin_js', $this->assets_url . '/js/admin.js', [] );
		wp_enqueue_script( 'bootstrap', 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js', [] );
	 
    } 
	
	public function admin_enqueue_styles( ) {
		
		
    } 

	public function enqueue_scripts() {
		
		wp_enqueue_script( 'jquery_min', 'https://code.jquery.com/jquery-1.11.1.min.js', [] );
		wp_enqueue_script( 'bootstrap', 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js', [] );
		wp_enqueue_script( 'jquery_slides_min', $this->assets_url . '/js/plugins/jquery.slides.min.js', [] );
		wp_enqueue_script( 'overlay', $this->assets_url . '/js/plugins/overlay.js', [] );
		wp_enqueue_script( 'jquery_validate_min', $this->assets_url . '/js/plugins/jquery.validate.min.js', array( ) );
		wp_enqueue_script( 'jquery_ui_min', $this->assets_url . '/js/plugins/jquery-ui.min.js', [] );
		wp_enqueue_script( 'bootstrap_rating_min', $this->assets_url . '/js/plugins/bootstrap-rating.min.js', [] );
		wp_enqueue_script( 'footer_home', $this->assets_url . '/js/footer-home.js', [] , '6.43' );
		wp_enqueue_script( 'frontend_js', $this->assets_url . '/js/frontend.js', [] , '6.66211' );
		// wp_enqueue_script( 'mobile_main_js', $this->assets_url . '/js/mobile_main.js', [] );
		wp_enqueue_script( 'owl_js', $this->assets_url . '/js/owl.carousel.min.js', [] );
		wp_enqueue_script('jquery_validate','https://cdn.jsdelivr.net/jquery.validation/1.16.0/jquery.validate.min.js',[]);
		wp_enqueue_script('additional_validate','https://cdn.jsdelivr.net/jquery.validation/1.16.0/additional-methods.min.js',[]);
		wp_enqueue_script('datetimepicker_full_min', $this->assets_url .'/datetimepicker/jquery.datetimepicker.full.min.js',[]);
		

	}

    public function enqueue_styles() {
      
		wp_enqueue_style('bootstrap_min','https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css',array());
		wp_enqueue_style('main', $this->assets_url . '/stylesheets/main.css', array() , '6.3' );
		wp_enqueue_style('mobile-main', $this->assets_url . '/stylesheets/mobile-main.css', array() );
        wp_enqueue_style('owl_css', $this->assets_url . '/stylesheets/owl.carousel.min.css', array() );
		wp_enqueue_style('overlay', $this->assets_url .'/stylesheets/overlay.css', array() );
		wp_enqueue_style('jquery_ui_min', $this->assets_url .'/stylesheets/jquery-ui.min.css', array() );
		wp_enqueue_style('bootstrap_rating', $this->assets_url .'/stylesheets/bootstrap-rating.css', array() );
		wp_enqueue_style('ie_style', $this->assets_url .'/stylesheets/ie-style.css', array() );
		wp_enqueue_style('datetimepicker_css', $this->assets_url .'/datetimepicker/jquery.datetimepicker.css', array() );
		
	}
	
	public function register_session(){
		if(!session_id()) session_start();		
	}
	
	public function yatch_customize_register($wp_customize){
		
	}
	
	function myplugin_ajaxurl() {
	   echo '<script type="text/javascript">var ajaxurl = "' . admin_url('admin-ajax.php') . '";</script>';
	}

	public function submit_form() {		
		die();
	}

}
