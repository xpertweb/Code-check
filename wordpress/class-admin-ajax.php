<?php 
if (!defined('ABSPATH')) {  exit;}
global $wp_query;
 
class AdminForm extends SearchForm
{
	
    public function __construct()
    {  
		parent::__construct();
		
		// function for submit theme option topbar
		add_action('wp_ajax_submit_theme_option_data',array($this,'submit_theme_option_data'));
		add_action('wp_ajax_nopriv_submit_theme_option_data',array($this,'submit_theme_option_data'));

		// function for submit theme option social bar
		add_action('wp_ajax_submit_theme_option_social',array($this,'submit_theme_option_social'));
		add_action('wp_ajax_nopriv_submit_theme_option_social',array($this,'submit_theme_option_social'));

		
		
    }



	
	// function for submit theme option topbar
	function submit_theme_option_data()
	{
		$serialized_data = serialize($_POST);
		update_option('theme_option_top_data',$serialized_data);
		echo json_encode(['status' =>1,'message'=> __('All settings are saved successfully','twentytwenty')]);
		die;
	}


	// function for submit theme option social bar
	function submit_theme_option_social()
	{
		$serialized_data = serialize($_POST);
		update_option('theme_option_social',$serialized_data);
		echo json_encode(['status' =>1,'message'=> __('All settings are saved successfully','twentytwenty')]);
		die;
	}


	
	function PostJSON($postUrl=null,$postJson=null){
		//echo $postJson;
		$postData = array(
			'timeout' => 200,
			'headers' => array( 'Content-Type' => 'application/json' ),
			'body'    => $postJson
		);
		

		// preform request
		$response = wp_remote_post($postUrl,$postData );
		
		// check for error
		if ( is_wp_error( $response ) ) {
			echo "<div class='text-center alert alert-danger'>".( sprintf( __( 'Error querying API - %s', 'vraline-core' ), $response->get_error_message() ) )."</div>";
			return false;
		}
		
		// get response body
		$response = wp_remote_retrieve_body( $response );
		if ( empty( $response ) ) {
			echo "<div class='text-center alert alert-danger'>".(  __( 'No body in API response.', 'vraline-core' ) )."</div>";
			return false;
		}
		
		$response_arr = json_decode( $response, true );
			
		return $response;
		die;
	}
	
	function PostAPI($postUrl=null,$postJson=null,$bearerToken=null){
		//echo $postJson;
		$postData = array(
			'timeout' => 200,
			'headers' => array( 'Authorization' => 'Bearer '.$bearerToken,'Content-Type' => 'application/json' ),
			'body'    => $postJson
		);
		
		// preform request
		$response = wp_remote_post($postUrl,$postData );
		
		// check for error
		if ( is_wp_error( $response ) ) {
			echo "<div class='text-center alert alert-danger'>".( sprintf( __( 'Error querying API - %s', 'vraline-core' ), $response->get_error_message() ) )."</div>";
			return false;
		}
		
		// get response body
		$response = wp_remote_retrieve_body( $response );
		if ( empty( $response ) ) {
			echo "<div class='text-center alert alert-danger'>".(  __( 'No body in API response.', 'vraline-core' ) )."</div>";
			return false;
		}
		
		// decode JSON response
		$response_arr = json_decode( $response, true );
		
		return $response;
		die;
	}

}
