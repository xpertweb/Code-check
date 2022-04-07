<?php
if (!defined('ABSPATH')) {  exit;}
global $wp_query;

class AjaxForm extends SearchForm
{	    
	public function __construct()
    {
		parent::__construct();	
		
		// Register ajax method Mobile
		add_action("wp_ajax_Submit_Reg_Form_Mobile",array($this,"Submit_Reg_Form_Mobile"));
		add_action("wp_ajax_nopriv_Submit_Reg_Form_Mobile",array($this,"Submit_Reg_Form_Mobile"));
		
		// Register ajax method Desktop
		add_action("wp_ajax_Submit_Registartion_Form", array($this,"Submit_Registartion_Form"));
		add_action("wp_ajax_nopriv_Submit_Registartion_Form", array($this,"Submit_Registartion_Form"));

		// Login ajax method
		add_action('wp_ajax_Login_Form_Popup',array($this,'Login_Form_Popup'));
		add_action('wp_ajax_nopriv_Login_Form_Popup',array($this,'Login_Form_Popup'));
		
		// Login ajax method mobile
		add_action('wp_ajax_Login_Form_Popup_Mobile',array($this,'Login_Form_Popup_Mobile'));
		add_action('wp_ajax_nopriv_Login_Form_Popup_Mobile',array($this,'Login_Form_Popup_Mobile'));
		
		// Change password ajax method
		add_action('wp_ajax_Change_password_Form_Popup',array($this,'Change_password_Form_Popup'));
		add_action('wp_ajax_nopriv_Change_password_Form_Popup',array($this,'Change_password_Form_Popup'));
		
		// after logout redirect to home page
		add_action('wp_logout',array($this,'ps_redirect_after_logout'));
		add_action('after_setup_theme',array($this,'remove_admin_bar'));

		// user reset password
		add_action('wp_ajax_Reset_password_Form',array($this,'Reset_password_Form'));
		add_action('wp_ajax_nopriv_Reset_password_Form',array($this,'Reset_password_Form'));
		
		// get state by country
		add_action('wp_ajax_stateby_country',array($this,'stateby_country'));
		add_action('wp_ajax_nopriv_stateby_country',array($this,'stateby_country'));

		
		// function for get tags address region
		add_action('wp_ajax_get_tags_address',array($this,'get_tags_address'));
		add_action('wp_ajax_nopriv_get_tags_address',array($this,'get_tags_address'));
		
		// function for get tags address region
		add_action('wp_ajax_get_load_tags',array($this,'get_load_tags'));
		add_action('wp_ajax_nopriv_get_load_tags',array($this,'get_load_tags'));

		// function for Booking Now process
		add_action('wp_ajax_BookingNow',array($this,'BookingNow'));
		add_action('wp_ajax_nopriv_BookingNow',array($this,'BookingNow'));
		
		// function for crewList process
		add_action('wp_ajax_crewList',array($this,'crewList'));
		add_action('wp_ajax_nopriv_crewList',array($this,'crewList'));
		
		// function for success request offer 
		add_action('wp_ajax_request_offer_success',array($this,'request_offer_success'));
		add_action('wp_ajax_nopriv_request_offer_success',array($this,'request_offer_success'));
		
		// function for stripe Payment
		add_action('wp_ajax_stripePayment',array($this,'stripePayment'));
		add_action('wp_ajax_nopriv_stripePayment',array($this,'stripePayment'));
		
		// function for search Filter by Ajax
		add_action('wp_ajax_searchFilterAjax',array($this,'searchFilterAjax'));
		add_action('wp_ajax_nopriv_searchFilterAjax',array($this,'searchFilterAjax'));
		
		// function for search offer Filter by Ajax
		add_action('wp_ajax_searchOfferFilterAjax',array($this,'searchOfferFilterAjax'));
		add_action('wp_ajax_nopriv_searchOfferFilterAjax',array($this,'searchOfferFilterAjax'));
		
		// function for feedback ajax
		add_action('wp_ajax_feedback_ajax',array($this,'feedback_ajax'));
		add_action('wp_ajax_nopriv_feedback_ajax',array($this,'feedback_ajax'));
		
		// function for shipyards ajax
		add_action('wp_ajax_shipyards_ajax',array($this,'shipyards_ajax'));
		add_action('wp_ajax_nopriv_shipyards_ajax',array($this,'shipyards_ajax'));
		
		// function for shipYard Model ajax
		add_action('wp_ajax_shipYardModal_ajax',array($this,'shipYardModal_ajax'));
		add_action('wp_ajax_nopriv_shipYardModal_ajax',array($this,'shipYardModal_ajax'));
		
		// function for modal yacht ajax
		add_action('wp_ajax_modal_yacht_ajax',array($this,'modal_yacht_ajax'));
		add_action('wp_ajax_nopriv_modal_yacht_ajax',array($this,'modal_yacht_ajax'));
		
		// function for yacht ajax
		add_action('wp_ajax_yacht_ajax',array($this,'yacht_ajax'));
		add_action('wp_ajax_nopriv_yacht_ajax',array($this,'yacht_ajax'));
		
		// function for yacht ajax
		add_action('wp_ajax_calendar',array($this,'calendar'));
		add_action('wp_ajax_nopriv_calendar',array($this,'calendar'));
		
		// function for Save voting 
		add_action('wp_ajax_votingSave',array($this,'votingSave'));
		add_action('wp_ajax_nopriv_votingSave',array($this,'votingSave'));
		
		// function for Save voting 
		add_action('wp_ajax_newsLetter',array($this,'newsLetter'));
		add_action('wp_ajax_nopriv_newsLetter',array($this,'newsLetter'));
		
		// function for Save voting 
		add_action('wp_ajax_unsnewsLetter',array($this,'unsnewsLetter'));
		add_action('wp_ajax_nopriv_unsnewsLetter',array($this,'unsnewsLetter'));		
		
		add_action("wp_head",array($this,"onloadData"));
		
    }
	
	function onloadData(){
		echo "<script>var site_url = '".get_site_url()."'; </script>";
	}
	
	function shipyards_ajax(){
		
		if(isset($_POST) && !empty($_POST)){
			
			$post = $_POST;			
			include('include/ajax-shipyards.php');		
		}
		
		die;
	}
	
	function shipYardModal_ajax(){
		
		if(isset($_POST) && !empty($_POST)){
			
			$post = $_POST;			
			include('include/ajax-shipyards-modal.php');		
		}
		
		die;
	}
	
	function modal_yacht_ajax(){
		
		if(isset($_POST) && !empty($_POST)){			
			$post = $_POST;			
			include('template-parts/include/ajax-modal-yacht.php');		
		}		
		die;
	}
	
	function calendar(){
		
		global $wpdbpro;
		$catalogseason = $wpdbpro->get_results("select * from catalogseason left join yachtrate on yachtrate.yachtcatalog_oid_fk = catalogseason.yachtcatalog_oid_fk where catalogseason.end_date > now() and catalogseason.yachtcatalog_oid_fk = ".@$_POST['catalog_oid']." group by catalogseason.start_date order by catalogseason.start_date ");
		$eventColor = ['#b3ffff','#ffb3ff','#aaff80','#ff99cc','#85e085','#ff4d4d','#ffff4d','#ff3377','#a3c2c2','#b8b894','#668cff','#ffbb33','#ffa64d','#70e038','#e31bc5','#8c47d1','#d1477e','#479ed1','#47d185','#d1c147','#d19847','#e86c2e','#f28174','#1e3194','#ded52c','#d571d9','#3bed41','#9597c7','#f7adba','#b3ffff','#ffb3ff','#aaff80','#ff99cc','#85e085','#ff4d4d','#ffff4d','#ff3377','#a3c2c2','#b8b894','#668cff','#ffbb33','#ffa64d','#70e038','#e31bc5','#8c47d1','#d1477e','#479ed1','#47d185','#d1c147','#d19847','#e86c2e','#f28174','#1e3194','#ded52c','#d571d9','#3bed41','#9597c7','#f7adba','#f7ad22'];
		$seasionArray = [];
		$elementArr = 0;
		foreach($catalogseason as $season){
			$seasionArray[] = [
				'startDate' => $season->start_date,
				'endDate' => $season->end_date,
				'color' => $eventColor[$elementArr++]
			];
		}
		
		echo json_encode(['data' => $seasionArray, 'year' => date('Y',strtotime($season->start_date)) ]);		
		die;
	}
	
	
	function newsLetter(){	
		
		if(!empty($_COOKIE['firstname']) && isset($_COOKIE['firstname'])){		
			$cookieData['customer'] = array(
				'id'=> $_COOKIE['id'],
				'firstname'=> $_COOKIE['firstname'],
				'lastname'=> $_COOKIE['lastname'], 
				'email'=> $_COOKIE['email'],		
				'title'=> $_COOKIE['title'],		
			);		
			$data = array(
				'status'=> 200,
				'data'=>$cookieData,				
			);
			echo  json_encode($data);	
			die;			
		}else{
		
			if(isset($_POST) && !empty($_POST)){
				
				$post = $_POST;
			
				$messageName = '';
				$postApiData['customer'] = [
					'email' => $post['email'],
					'firstname' => $post['firstname'],
					'lastname' => $post['lastname'],
					'title' => $post['title'],
					'language' => 0,
				]; 
				
				$newsLetetrUrl = GLOBAL_BOOKING_DOMAIN_LIVE."/api/newsletterservice/user/create";
				$response = PostJSONBooking($newsLetetrUrl,json_encode($postApiData));
				$newsLetetrArray = json_decode($response, true);
				
				// echo '<pre>';
				// print_r($newsLetetrArray);
			
				
				if(!empty($newsLetetrArray['customer']['id'])){
			  
				   /*SET COOKIES*/					
					setcookie('id', $newsLetetrArray['customer']['id'], time() + 1800,'/');  
					setcookie('firstname', $newsLetetrArray['customer']['firstname'], time() + 1800,'/');  
					setcookie('lastname', $newsLetetrArray['customer']['lastname'], time() + 1800,'/');
					setcookie('email', $newsLetetrArray['customer']['email'], time() + 1800,'/');  				  
					setcookie('title', $newsLetetrArray['customer']['title'], time() + 1800,'/');  				  
					 
					$data = array(
						'status' => 200,
						'data' => $newsLetetrArray,				
					);
					echo json_encode($data);				
				}else if(!empty($newsLetetrArray['error']['message'])){
					$data = array(
						'status' => 402,
						'data' => $newsLetetrArray['error']['message'],				
					);				
					echo json_encode($data);
				}else{
					$data = array(
						'status' => 402,
						'data' => "Please check data",				
					);				
					echo json_encode($data);
				}				
			}
		}
		die;
	}
	
	
	function request_offer_success(){		
		session_start();		
		echo $_SESSION['request_offer_success'] = $_POST['order_id'];
		die;
	}
	
	function yacht_ajax(){		
		if(isset($_POST) && !empty($_POST)){			
			$post = $_POST;			
			include('template-parts/include/ajax-yachts.php');		
		}		
		die;
	}
	
	function votingSave(){		
		if(isset($_POST) && !empty($_POST)){			
			$post = $_POST;
			$messageName = '';
			$finalPostApi = $postApiData = [];
			
			// echo '<pre>';
			// print_r($post);
			// die;
			
			foreach($post['relatedObjectId'] as $key => $relatedObjectId){
				$postApi = [];
				
				$documentExt = !empty($post['file_name'][$key])?get_ext_imagepath($post['file_name'][$key]):'';
				$documentName = !empty($post['file_name'][$key])?get_name_imagepath($post['file_name'][$key]):'';
				if(!empty($documentExt)){
					if($key == 3){
						$messageName = 'Yacht';
					}else if($key == 5){
						$messageName = 'Marina';
					}else if($key == 7){
						$messageName = 'Revier';
					} 
					if($documentExt == 'jpeg' || $documentExt == 'jpg' || $documentExt == 'png' || $documentExt == 'gif' || $documentExt == 'pdf'){}else{
						echo json_encode(['status' => 0, 'message' => "Für die $messageName sind nur die Formate PNG, JPG und PDF erforderlich." ]);
						die;
					}
					
					if($documentExt == 'jpeg' || $documentExt == 'jpg'){
						$documentBase64String = str_ireplace('data:image/jpeg;base64,','',$post['base64Data'][$key]);
					}else if($documentExt == 'png'){
						$documentBase64String = str_ireplace('data:image/png;base64,','',$post['base64Data'][$key]);
					}else if($documentExt == 'gif'){
						$documentBase64String = str_ireplace('data:image/gif;base64,','',$post['base64Data'][$key]);
					}else if($documentExt == 'pdf'){
						$documentBase64String = str_ireplace('data:application/pdf;base64,','',$post['base64Data'][$key]);
					}
				}
				
				if(!empty($documentExt)){
					$postApi['files'] = [
						'fileName' => $documentName,
						'fileBase64Data' => $documentBase64String
					];
				}
				
				
				$postApi['votingid'] = (int)$post['votingid'][$key];
				if($key == '61' || $key == '62'){
					$postApi['classindexid'] = 6;
				}else{
					$postApi['classindexid'] = $key;
				}
				$postApi['orderid'] = $post['orderid'];
				$postApi['customerid'] = $post['customerid'];
				$postApi['classindexname'] = $post['classindexname'][$key];
				$postApi['relatedObjectId'] = $post['relatedObjectId'][$key];
				$postApi['text'] = $post['votingText'][$key];
				
				/*===========Put array element in items==================*/
				$itemArray = [];
				
				foreach($post['itemName'][$key] as $itemKey => $itemNames){
					
					if($itemNames != 'Gesamt'){
						$itemArray[] = [
							'itemIndex' => $itemKey,
							'itemName' => $itemNames,
							'itemValue' => !empty($post['ratings'][$key][$itemKey])?$post['ratings'][$key][$itemKey]:0
						];						
					}else{
						$postApi['totalVoting'] = !empty($post['ratings'][$key][$itemKey])?$post['ratings'][$key][$itemKey]:0;
					}						
				}
				
				
				$postApi['items'] = $itemArray;				
				$postApiData[] = $postApi;
				
			}
			
			$finalPostApi['votings']['voting'] = $postApiData;
			// echo json_encode($finalPostApi);
			
			$votingServiceUrl = GLOBAL_BOOKING_DOMAIN_LIVE."api/bookingservice/voting/".$post['orderid'];
			$response = PostJSONBooking($votingServiceUrl,json_encode($finalPostApi));
			$votingArray = json_decode($response, true); 
			
			// echo '<pre>';
			// print_r($votingArray);
			
			echo json_encode(['status' => '1', 'message' => 'Voting updated successfully.']);
			die;
		}		
		die;
	}
	
	function feedback_ajax(){
		
		if(isset($_POST) && !empty($_POST)){
			
			$post = $_POST;			
			if($post['active_tab'] == 'yacht'){
				include('feedback/ajax-yachts.php');
			}else if($post['active_tab'] == 'model'){
				include('feedback/ajax-model.php');
			}else if($post['active_tab'] == 'marinas'){
				include('feedback/ajax-marinas.php');
			}else if($post['active_tab'] == 'cities'){
				include('feedback/ajax-region.php');
			}else if($post['active_tab'] == 'company'){
				include('feedback/ajax-company.php');
			}else if($post['active_tab'] == 'sеrvices'){
				include('feedback/ajax-sеrvices.php');
			}			
		}
		
		die;
	}
	
	function searchFilterAjax(){
		ob_start();
		session_start();
		
		$post = $_POST;
		if($post){
			
			// echo '<pre>';
			foreach($post as $keyPas => $Valposts){
				$post[$keyPas] = urldecode($Valposts);
			}
			
			$post['orderName'] = $this->orderByLanguage($post['orderName']);
			if(!empty($_POST['equipment']) && count($_POST['equipment']) > 0){
				$post['equipment'] = implode(',',$_POST['equipment']);
			}else{
				$post['equipment'] = '';
			}
			
			if(empty($post['boats_type'])){ $post['boats_type'] = ''; }			
			$_SESSION['boats_type'] = urldecode($post['boats_type']);

			if(empty($post['districtHid'])){
				$post['districtHid'] = 'country_317,country_392,country_256';
			}

			if(empty($post['startdate'])){
				$end = strtotime('next saturday');
				$post['startdate'] = date('d.m.Y', strtotime("+1 weeks",$end));
			}else{
				$post['startdate'] = date('d.m.Y', strtotime($post['startdate']));
			}
			
			if(!empty($post['enddate'])){
				$post['enddate'] = date('d.m.Y', strtotime($post['enddate']));
			}else{
				$post['enddate'] = date('d.m.Y', strtotime("+1 weeks",strtotime($post['startdate'])));
			}
			
			if(empty($post['cabin_max'])){
				$post['cabin_max'] = '6';
			}	
			
			if(empty($post['service_type'])){
				$post['service_type'] = '0';
			}		
	
			$globalDistict = $globalFullDataDistict = [];
			$_SESSION['orderName'] = !empty($post['orderName'])?$post['orderName']:'Discount';
			$_SESSION['orderBy']  = !empty($post['orderBy'])?$post['orderBy']:'desc';			
			$post['min_rating'] = !empty($post['min_rating'])?$post['min_rating']:"0";
			$post['max_rating'] = !empty($post['max_rating'])?$post['max_rating']:"5";
			$post['periodHid'] = '1';
			
			/*=======Limit page parameter=========*/
			$pages = !empty($post['pagination'])?$post['pagination']:'1';
			$limit = 10; 
			$offset = $limit * ($pages - 1);
			
			
			// echo '<pre>';
			// print_r($post);
			// die;
			if(!empty($post['startdate'])){
				
				/*====Start filter week=========*/
				$strToDate = strtotime($post['startdate']);
				$date_date = date($strToDate);
				$week_number = date('W', $date_date) + 1;
				$filterWeek = date('Y',$strToDate).$week_number;
				
				$getDays = dateDiffInDays($post['startdate'] , $post['enddate']);
				
				if($getDays == 7){
					$post['periodHid'] = '1';
					$post['enddate'] = date('d.m.Y', strtotime("+1 weeks",strtotime($post['startdate'])));
				}else if($getDays == 14){
					$post['periodHid'] = '2';
					$post['enddate'] = date('d.m.Y', strtotime("+2 weeks",strtotime($post['startdate'])));
				}else if($getDays >= 21){
					$post['periodHid'] = '3';
					$post['enddate'] = date('d.m.Y', strtotime("+3 weeks",strtotime($post['startdate'])));
					$getDays = 21;
				}
			}else{
				$filterWeek = '';
			}
			
			if(!empty($post['districtHid'])){
				$districtHids = urldecode($post['districtHid']);
				$explodeSearch = explode(',',$districtHids);
				$district = $marina = $city = $country = [];
				foreach($explodeSearch as $search){				
					$explodeFilter = explode("_",$search);					
					switch ($explodeFilter[0]) {
						case "district":  
							$district[] = $explodeFilter[1];
							break;
							
						case "marina": 
							$marina[] = $explodeFilter[1];
							break;
							
						case "country": 
							$country[] = $explodeFilter[1];
							break;
						
						case "city": 
							$city[] = $explodeFilter[1];
							break;
					}
				}				
				
				if(!empty($country[0])){
					$yatchCountryList = country($country);
					$district = array_merge($district,$yatchCountryList['district_oid_fk']);
				}
			
				if(!empty($city[0])){
					$CityList = city($city);			
					$district = array_merge($district,$CityList);					
				}
			
				if(!empty($marina[0])){
					$yatchMarinaList = marina($marina);
					$district = array_merge($district,$yatchMarinaList);					
				}
				
				if(!empty($district[0])){
					$yatchDistrictList = district($district,$filterWeek,@$post['minPrice'],@$post['maxPrice'],@$post['minDiscount'],@$post['maxDiscount'],@$post['minLength'],@$post['maxLength'],@$post['minYear'],@$post['maxYear'],@$post['cabin_min'],@$post['cabin_max'],$post['boatsTypesHid'],$post['service_type'],$post['periodHid'],$post['min_rating'],$post['max_rating'],$post['equipment'],$post['pageId'],$limit,$offset); 
					$finalCommon = $yatchDistrictList;					
				}
			}
			
			include('template/search-ajax.php');
	
		
		}else{
			include(get_stylesheet_directory().'/template-parts/no_record_found.php');
		}
		
		die;
	}
	
	function searchOfferFilterAjax(){
		ob_start();
		session_start();
		
		$post = $_POST;
		if($post){
			
			foreach($post as $keyPas => $Valposts){
				$post[$keyPas] = urldecode($Valposts);
			}
			
			$post['orderName'] = $this->orderByLanguage($post['orderName']);
			if(!empty($_POST['equipment']) && count($_POST['equipment']) > 0){
				$post['equipment'] = implode(',',$_POST['equipment']);
			}else{
				$post['equipment'] = '';
			}
			
			if(empty($post['boats_type'])){ $post['boats_type'] = ''; }			
			$_SESSION['boats_type'] = urldecode($post['boats_type']);

			if(empty($post['startdate'])){
				$end = strtotime('next saturday');
				$post['startdate'] = date('d.m.Y', strtotime("+1 weeks",$end));
			}else{
				$post['startdate'] = date('d.m.Y', strtotime($post['startdate']));
			}
			
			if(!empty($post['enddate'])){
				$post['enddate'] = date('d.m.Y', strtotime($post['enddate']));
			}else{
				$post['enddate'] = date('d.m.Y', strtotime("+1 weeks",strtotime($post['startdate'])));
			}		
	
			$globalDistict = $globalFullDataDistict = [];
			$_SESSION['orderName'] = !empty($post['orderName'])?$post['orderName']:'Discount';
			$_SESSION['orderBy']  = !empty($post['orderBy'])?$post['orderBy']:'desc';
			$post['min_rating'] = !empty($post['min_rating'])?$post['min_rating']:"0";
			$post['max_rating'] = !empty($post['max_rating'])?$post['max_rating']:"5";		
			
			/*=======Limit page parameter=========*/
			$pages = !empty($post['pagination'])?$post['pagination']:'1';
			$limit = 10; 
			$offset = $limit * ($pages - 1);

			if(!empty($post['startdate'])){
				
				/*====Start filter week=========*/
				$strToDate = strtotime($post['startdate']);
				$date_date = date($strToDate);
				$week_number = date('W', $date_date) + 1;
				$filterWeek = date('Y',$strToDate).$week_number;
				
				$getDays = dateDiffInDays($post['startdate'] , $post['enddate']);
				
				if($getDays == 7){
					$post['periodHid'] = '1';
					$post['enddate'] = date('d.m.Y', strtotime("+1 weeks",strtotime($post['startdate'])));
				}else if($getDays == 14){
					$post['periodHid'] = '2';
					$post['enddate'] = date('d.m.Y', strtotime("+2 weeks",strtotime($post['startdate'])));
				}else if($getDays >= 21){
					$post['periodHid'] = '3';
					$post['enddate'] = date('d.m.Y', strtotime("+3 weeks",strtotime($post['startdate'])));
					$getDays = 21;
				}
			}else{
				$filterWeek = '';
			}
			
			$district = $marina = $city = $country = [];
			$post['service_type'] = '';
			
			if(!empty($post['districtHid'])){
				$districtHids = urldecode($post['districtHid']);
				$explodeSearch = explode(',',$districtHids);				
				foreach($explodeSearch as $search){				
					$explodeFilter = explode("_",$search);					
					switch ($explodeFilter[0]) {
						case "district":  
							$district[] = $explodeFilter[1];
							break;
							
						case "marina": 
							$marina[] = $explodeFilter[1];
							break;
							
						case "country": 
							$country[] = $explodeFilter[1];
							break;
						
						case "city": 
							$city[] = $explodeFilter[1];
							break;
					}
				}				
				
				if(!empty($country[0])){
					$yatchCountryList = country($country);
					$district = array_merge($district,$yatchCountryList['district_oid_fk']);
				}
			
				if(!empty($city[0])){
					$CityList = city($city);			
					$district = array_merge($district,$CityList);					
				}
			
				if(!empty($marina[0])){
					$yatchMarinaList = marina($marina);
					$district = array_merge($district,$yatchMarinaList);					
				}				
			}
			
			// echo '<pre>';
			// print_r($post);
			// echo '</pre>';
			// die;
			
			$yatchDistrictList = district($district,$filterWeek,@$post['minPrice'],@$post['maxPrice'],@$post['minDiscount'],@$post['maxDiscount'],@$post['minLength'],@$post['maxLength'],@$post['minYear'],@$post['maxYear'],@$post['cabin_min'],@$post['cabin_max'],$post['boatsTypesHid'],$post['service_type'],$post['periodHid'],$post['min_rating'],$post['max_rating'],$post['equipment'],$post['pageId'],$limit,$offset); 
			$finalCommon = $yatchDistrictList;
			
			// echo '<pre>';
			// print_r($yatchDistrictList);
			// echo '</pre>';
			include('template/search-ajax.php');
	
		
		}else{
			include(get_stylesheet_directory().'/template-parts/no_record_found.php');
		}
		
		die;
	}
	
	
	function orderByLanguage($orderName=null){		
		
		switch($orderName){
			case "Preis" :
				return 'price';
				break;
			case "Rabatt" :
				return 'discount';
				break;
			case "Jahr" :
				return 'year';
				break;
			case "Länge" :
				return 'length';
				break;
			case "Price" :
				return 'price';
				break;
			case "Discount" :
				return 'discount';
				break;
			case "Year" :
				return 'year';
				break;
			case "Length" :
				return 'length';
				break;
		}
		
	}
	
	function stripePayment(){
		
		$post = $_POST;
		
		$data = array();   
        $statusMsg =''; 
        if(!empty($post['stripeToken'])) {
			
			$params = array(
                'name' => $post['order_name'],
                'email' => $post['order_email'],
                'description' => $post['descriptionApi'],               
            );
            $jsonDataCustomer = get_curl_handle(STRIPE_CREATE_CUSTOMER_URL,$params,$post['Secretkey']);
			$resultCustomer = json_decode($jsonDataCustomer, true);
			
			if(!empty($resultCustomer['error']['message']) || empty($resultCustomer['id'])){
				echo json_encode(['status' => 0, 'message' => $resultCustomer['error']['message'] ]);
				die;
			}
			
			$customer_id = $resultCustomer['id'];	
			$params = array(
				"source" => $post['stripeToken']
			);

            $jsonDataCard = get_curl_handle(STRIPE_CREATE_CUSTOMER_URL.'/'.$customer_id.'/sources',$params,$post['Secretkey']);
            $resultCard = json_decode($jsonDataCard, true);
			if(!empty($resultCard['error']['message']) || empty($resultCard['id'])){
				echo json_encode(['status' => 0, 'message' => $resultCard['error']['message'] ]);
				die;
			}		
			
            $params = array(
				'customer' => $customer_id,
                'amount' => $post['amount']  * 100,
                'currency' => 'EUR',
                'description' => $post['descriptionApi'],
                "source" => $resultCard['id'],
                'metadata' => array( 
                    'order_id' => $post['order_id'],
                )
            );
			
            $jsonData = get_curl_handle(STRIPE_CHARGE_URL,$params,$post['Secretkey']);
            $resultJson = json_decode($jsonData, true);
			
		
            if($resultJson['amount_refunded'] == 0 && empty($resultJson['failure_code']) && $resultJson['paid'] == 1 && $resultJson['captured'] == 1){
				// Order details  
				$transactionID = $resultJson['balance_transaction']; 
				$currency = $resultJson['currency']; 
				$payment_status = $resultJson['status'];
				
				// If the order is successful 
				if($payment_status == 'succeeded'){ 
				
					$paymentUrl = GLOBAL_BOOKING_DOMAIN_LIVE."api/bookingservice/payment/stripe/".$post['order_id']."/".STRIPE_PAYMENT_MODE;

					$response = PostJSONBooking($paymentUrl,json_encode([]));
					$yachtArray = json_decode($response, true);
					
					if(!empty($yachtArray['exception']['reason'])){
						echo json_encode(['status' => 0, 'message' => $yachtArray['exception']['reason'] ]);
					}else{
						echo json_encode(['status' => 1, 'message' => "Your Payment has been done successfully." ]);
					}
	 
				}else{ 
					echo json_encode(['status' => 0, 'message' => "Your Payment has Failed!" ]);
				}
            } else {
				echo json_encode(['status' => 0, 'message' => "Transaction has been failed!" ]);
            }
        } else {
			echo json_encode(['status' => 0, 'message' => "Error on form submission." ]);
        }
		die;
		
	}
	
	
	function crewList(){
	
		$post = $_POST;
		$postApi = [];	
		
		// echo '<pre>';
		// print_r($post);
		// die;
		
		$documentExt = !empty($post['skipperDocumentNumberFile_name'])?get_ext_imagepath($post['skipperDocumentNumberFile_name']):'';
		$licenceNumberExt = !empty($post['skipperLicenceNumberFile_name'])?get_ext_imagepath($post['skipperLicenceNumberFile_name']):'';
		$vhfLicenceExt = !empty($post['skipperVHFLicenceNumberFile_name'])?get_ext_imagepath($post['skipperVHFLicenceNumberFile_name']):'';
		
		$documentName = !empty($post['skipperDocumentNumberFile_name'])?get_name_imagepath($post['skipperDocumentNumberFile_name']):'';
		$licenceNumberName = !empty($post['skipperLicenceNumberFile_name'])?get_name_imagepath($post['skipperLicenceNumberFile_name']):'';
		$vhfLicenceName = !empty($post['skipperVHFLicenceNumberFile_name'])?get_name_imagepath($post['skipperVHFLicenceNumberFile_name']):'';
		
		if(!empty($documentExt)){
			
			if($documentExt == 'jpeg' || $documentExt == 'jpg' || $documentExt == 'png' || $documentExt == 'gif' || $documentExt == 'pdf'){}else{
				echo json_encode(['status' => 0, 'message' => "Für die Skiper-Lizenz sind nur die Formate PNG, JPG und PDF erforderlich." ]);
				die;
			}
			
			if($documentExt == 'jpeg' || $documentExt == 'jpg'){
				$documentBase64String = str_ireplace('data:image/jpeg;base64,','',$post['skipperDocumentNumberFile_base64Data']);
			}else if($documentExt == 'png'){
				$documentBase64String = str_ireplace('data:image/png;base64,','',$post['skipperDocumentNumberFile_base64Data']);
			}else if($documentExt == 'gif'){
				$documentBase64String = str_ireplace('data:image/gif;base64,','',$post['skipperDocumentNumberFile_base64Data']);
			}else if($documentExt == 'pdf'){
				$documentBase64String = str_ireplace('data:application/pdf;base64,','',$post['skipperDocumentNumberFile_base64Data']);
			}
		}
		
		if(!empty($licenceNumberExt)){
			
			if($licenceNumberExt == 'jpeg' || $licenceNumberExt == 'jpg' || $licenceNumberExt == 'png' || $licenceNumberExt == 'gif' || $licenceNumberExt == 'pdf'){}else{
				echo json_encode(['status' => 0, 'message' => "Für das Funkzertifikat sind nur die Formate PNG, JPG und PDF erforderlich." ]);
				die;
			}
			
			if($licenceNumberExt == 'jpeg' || $licenceNumberExt == 'jpg'){
				$licenceBase64String = str_ireplace('data:image/jpeg;base64,','',$post['skipperLicenceNumberFile_base64Data']);
			}else if($licenceNumberExt == 'png'){
				$licenceBase64String = str_ireplace('data:image/png;base64,','',$post['skipperLicenceNumberFile_base64Data']);
			}else if($licenceNumberExt == 'gif'){
				$licenceBase64String = str_ireplace('data:image/gif;base64,','',$post['skipperLicenceNumberFile_base64Data']);
			}else if($licenceNumberExt == 'pdf'){
				$licenceBase64String = str_ireplace('data:application/pdf;base64,','',$post['skipperLicenceNumberFile_base64Data']);
			}
		}
		
		if(!empty($vhfLicenceExt)){
			
			if($vhfLicenceExt == 'jpeg' || $vhfLicenceExt == 'jpg' || $vhfLicenceExt == 'png' || $vhfLicenceExt == 'gif' || $vhfLicenceExt == 'pdf'){}else{
				echo json_encode(['status' => 0, 'message' => "Ausweis / Reisepass nur im PNG, JPG und PDF Format erforderlich." ]);
				die;
			}	
			
			if($vhfLicenceExt == 'jpeg' || $vhfLicenceExt == 'jpg'){
				$vhfLicenceBase64String = str_ireplace('data:image/jpeg;base64,','',$post['skipperVHFLicenceNumberFile_base64Data']);
			}else if($vhfLicenceExt == 'png'){
				$vhfLicenceBase64String = str_ireplace('data:image/png;base64,','',$post['skipperVHFLicenceNumberFile_base64Data']);
			}else if($vhfLicenceExt == 'gif'){
				$vhfLicenceBase64String = str_ireplace('data:image/gif;base64,','',$post['skipperVHFLicenceNumberFile_base64Data']);
			}else if($vhfLicenceExt == 'pdf'){
				$vhfLicenceBase64String = str_ireplace('data:application/pdf;base64,','',$post['skipperVHFLicenceNumberFile_base64Data']);
			}
		}			
		
		
		$postApi['crews'] = [
			"yachtCharterOrderId" => $post['yachtCharterOrderId'],
			"arrivalTime" => date('d.m.Y H:i',strtotime($post['arrival_date']. ' ' .$post['arrival_time'] )),
			"arrivalFlightNumber" => $post['arrivalFlightNumber'],
			"arrivalAirport" => $post['arrivalAirport'],
			"departureTime" => date('d.m.Y H:i',strtotime($post['departure_date'] . ' ' .$post['departure_time'])),
			"departureFlightNumber" => $post['departureFlightNumber'],
			"departureAirport" => $post['departureAirport'],
			"airportToBaseTransfer" => !empty($post['airportToBaseTransfer'])?$post['airportToBaseTransfer']:0,
			"crewListNote" => $post['crewListNote'],			
			"action" => $post['crewListStatus'],
			"skipper" => 1,
			"skipper_email" => $post['skipper_email'],
			"skipper_mobile" => $post['skipper_mobile'],
			"skipperVHFLicence" => $post['skipperVHFLicence'],
			"skipper_licence" => $post['skipper_licence'],
		];
		
		if(!empty($documentExt)){
			$postApi['crews']['skipperDocumentNumberFile'] = [
				'fileName' => $documentName,
				'fileBase64Data' => $documentBase64String
			];
		}
		
		if(!empty($licenceNumberExt)){
			$postApi['crews']['skipperLicenceNumberFile'] = [
				'fileName' => $licenceNumberName,
				'fileBase64Data' => $licenceBase64String
			];
		}
		
		if(!empty($vhfLicenceExt)){
			$postApi['crews']['skipperVHFLicenceNumberFile'] = [
				'fileName' => $vhfLicenceName,
				'fileBase64Data' => $vhfLicenceBase64String
			];
		}
		
		if(empty($post['firstname_skipper']) && !empty($post['skipper_email'])){
			$firstname_skipperExp = explode('@',$post['skipper_email']);
			$post['firstname_skipper'] = $firstname_skipperExp[0];
		}
		$postApi['crews']['crewMembers'][] = [
			'crew_id' => 1,
			'firstname' => $post['firstname_skipper'],
			'lastname' => $post['lastname_skipper'],
			'gender' => $post['gender_skipper'],
			'birth_date' => date('d.m.Y',strtotime($post['birth_date_skipper'])),
			'birth_country' => $post['birth_country_skipper'],
			'birth_place' => $post['birth_place_skipper'],
			'living_country' => $post['living_country_skipper'],
			'address' => $post['address_skipper'],
			'nationality' => $post['nationality_skipper'],
			'document_type' => $post['document_type_skipper'],
			'passport' => $post['passport_skipper']				
		];
		
		$postApi['crews']['crewMembers'][] = [
			'crew_id' => 2,
			'firstname' => $post['firstname_co_skipper'],
			'lastname' => $post['lastname_co_skipper'],
			'gender' => $post['gender_co_skipper'],
			'birth_date' => date('d.m.Y',strtotime($post['birth_date_co_skipper'])),
			'birth_country' => $post['birth_country_co_skipper'],
			'birth_place' => $post['birth_place_co_skipper'],
			'living_country' => $post['living_country_co_skipper'],
			'address' => $post['address_co_skipper'],
			'nationality' => $post['nationality_co_skipper'],
			'document_type' => $post['document_type_co_skipper'],
			'passport' => $post['passport_co_skipper']				
		];
		
		
		$ij = 0;
		foreach($post['firstname'] as $first_name){	
			if(!empty($post['firstname'][$ij]) && !empty($post['lastname'][$ij])){
				$postApi['crews']['crewMembers'][] = [
					'crew_id' => $ij + 3,
					'firstname' => $first_name,
					'lastname' => $post['lastname'][$ij],
					'gender' => $post['gender'][$ij],
					'birth_date' => date('d.m.Y',strtotime($post['birth_date'][$ij])),
					'birth_country' => $post['birth_country'][$ij],
					'birth_place' => $post['birth_place'][$ij],
					'living_country' => $post['living_country'][$ij],
					'address' => $post['address'][$ij],
					'nationality' => $post['nationality'][$ij],
					'document_type' => $post['document_type'][$ij],
					'passport' => $post['passport'][$ij]				
				];	
				$ij++;
			}
		}
	
		$crewlistUrl = GLOBAL_BOOKING_DOMAIN_LIVE."api/bookingservice/crewlist/submit";
		$response = PostJSONBooking($crewlistUrl,json_encode($postApi));
		$crewlistArray = json_decode($response);
		
		if(empty($crewlistArray) && !isset($crewlistArray)){
			echo json_encode(['status' => 0, 'message' => "Something went wrong with the api." ]);	
		}else if(!empty($crewlistArray->error->message)){
			echo json_encode(['status' => 0, 'message' => ucfirst($crewlistArray->error->message) ]);	
		}else{
			echo json_encode(['status' => 1, 'message' => "Crew list inserted successfully." , "data" => $crewlistArray , 'crewListStatus' => $post['crewListStatus'] ]);	
		}
		
		
		die;
		
	}
	
	function BookingNow(){
	
		$post = $_POST;	
		
		if(empty($post['FirstName']) || empty($post['LastName']) || empty($post['Email']) ){			
			echo json_encode(['status' => 0, 'message' => "* Fields required ."]);
		}else if($post['booking_status'] == 1 && (empty($post['Street']) || empty($post['StreetNumber']) || empty($post['Zipcode']) || empty($post['City']) || empty($post['Telefon']) )){
			echo json_encode(['status' => 0, 'message' => "** Fields required ."]);
		}else{
			$type = !empty($post['booking_status'])?$post['booking_status']:0;
			
			$duration = $post['days']/7;
			$postApi['yachtorder'] = [
				'duration' => $duration,
				'yachtweek' => $post['yachtweek_oid'],
				'type' => $type
			];
			
			if(!empty($post['orderid'])){
				$postApi['yachtorder']['orderid'] = $post['orderid'];
			}
			
			$postApi['yachtorder']['customer'] = [
				'email' => $post['Email'],
				'firstname' => $post['FirstName'],
				'lastname' => $post['LastName'],
				'company' => !empty($post['Company'])?$post['Company']:'',
				'street' => !empty($post['Street'])?$post['Street']:'',
				'streetnumber' => !empty($post['StreetNumber'])?$post['StreetNumber']:'',
				'city' => !empty($post['City'])?$post['City']:'',
				'zipcode' => !empty($post['Zipcode'])?$post['Zipcode']:'',
				'telefon' => !empty($post['Telefon'])?$post['Telefon']:'',
				'title' => $post['Title'],
				'countryId' => !empty($post['Country'])?$post['Country']:'',
				'language' => !empty($post['Language'] && $post['Language'] == 0)?$post['Language']:0,
				'fax' => !empty($post['Fax'])?$post['Fax']:'',
			];
			
			/*======insert extra in api==============*/
			// print_r($post['optional_extras']);
			$apiExtra = [];
			foreach($post['optional_extras'] as $optional_extras){
				$explodeExtra = explode('::',$optional_extras);
				$apiExtra[] = [
					'oid' => $explodeExtra[0],
					'count' => $explodeExtra[1],
				];
			}
			
			$postApi['yachtorder']['extras'] = $apiExtra;
			
			// echo '<pre>';
			// print_r($postApi);
			// die;

			$bookingServiceUrl = GLOBAL_BOOKING_DOMAIN_LIVE."api/bookingservice/submit";
			$response = PostJSONBooking($bookingServiceUrl,json_encode($postApi));
			$yachtArray = json_decode($response, true);
			

			// $yachtArray = json_decode('{"yachtorder":{"customer":{"id":142309347,"email":"sdfsdf@sdfsdf.sds","firstname":"dsfsdf","lastname":"sdfsdf","company":"sdfsdf","street":"sdfsdf","streetnumber":"sdfsdf","city":"sdfsdf","zipcode":"sdfsdf","telefon":"sdfsdfsf","title":0,"countryId":256,"language":0,"fax":"sdfsdf"},"duration":3,"yachtweek":130819224,"type":0,"orderid":142309440}}', true);
			// echo json_encode($postApi);
			// print_r($yachtArray);
			
			// die;
			
			if(empty($yachtArray['yachtorder']['customer']['id']) || empty($yachtArray['yachtorder']['orderid'])){
				if(empty($yachtArray['error']['message'])){					
					echo json_encode(['status' => 0, 'message' => "Something went wrong with the api. Please try again." ]);
				}else{
					echo json_encode(['status' => 0, 'message' => ucfirst($yachtArray['error']['message'])  ]);
				}
			}else{			
				$stringValues = "customer_id=".$yachtArray['yachtorder']['customer']['id']."@@orderid=".$yachtArray['yachtorder']['orderid'];
				$redirectToken = base64_encode($stringValues);
				if($type == 0){
					$message = "Request an Offer selected successfully.";
				}else if($type == 2){
					$message = "Request an Option selected successfully.";
				}else{
					$message = "Requested for booking successfully.";
				}
				echo json_encode(['status' => 1, 'message' => $message , "data" => $yachtArray, 'redirectToken' => $redirectToken ]);
			}
			
		}
		die;
	}
	
	function addressSearch($tags=null,$scrollType=null){
		global $wpdbpro;
		$marinaTags = $cityTags = $countryTags = $districtTags = $allTags = [];
		
		if(empty($scrollType)){
			$limit = " ";
		}else{
			$limit = "";
		}
		
		/* ==========fetch from country ============*/
		if(!empty($tags) && !empty($scrollType)){
			$countryWhere = " where name_en like '$tags%' ";
		}elseif(!empty($tags)){
			$countryWhere = " where name_en like '$tags%' or name_de like '$tags%' ";
		}else{
			$countryWhere = "";
		}
		
		$country = $wpdbpro->get_results("select oid as id,name_de as name,sign2 from country $countryWhere order by oid $limit");
		
		if (!empty($wpdbpro->num_rows) && count($wpdbpro->num_rows) != 0) {
			foreach($country as $countryTag) {				
				$countryTags['id'] = $countryTag->id;
				$countryTags['name'] = $countryTag->name;
				$countryTags['type'] = 'country';
				$countryTags['sign2'] = strtolower($countryTag->sign2);
				$allTags[] = $countryTags;
			}
		}
		
		/* ==========fetch from yatch ============*/
		if(!empty($tags) && !empty($scrollType)){
			$districtWhere = " where name_en like '$tags%' ";
		}else if(!empty($tags)){
			$districtWhere = " where name_en like '$tags%' or name_de like '$tags%' or shortname_de like '$tags%' or description like '$tags%' ";
		}else{
			$districtWhere = "";
		}
		
		$district = $wpdbpro->get_results("select oid as id,name_de as name from yachtcharterdistrict $districtWhere order by oid $limit");
		
		if (!empty($wpdbpro->num_rows) && count($wpdbpro->num_rows) != 0) {
			foreach($district as $districtTag) {				
				$districtTags['id'] = $districtTag->id;
				$districtTags['name'] = $districtTag->name;
				$districtTags['type'] = 'district';
				$allTags[] = $districtTags;
			}
		}
		
		/* ==========fetch from city ============*/
		if(!empty($tags) && !empty($scrollType)){
			$cityWhere = " where name like '$tags%' ";
		}elseif(!empty($tags)){
			$cityWhere = " where name like '$tags%' ";
		}else{
			$cityWhere = "";
		}
		
		$city = $wpdbpro->get_results("select oid as id,name from city $cityWhere order by oid $limit");
		if (!empty($wpdbpro->num_rows) && count($wpdbpro->num_rows) != 0) {
			foreach($city as $cityTag) {
				$cityTags['id'] = $cityTag->id;
				$cityTags['name'] = $cityTag->name;
				$cityTags['type'] = 'city';
				$allTags[] = $cityTags;
			}
		}
		
		/* ==========fetch from marina ============*/
		if(!empty($tags) && !empty($scrollType)){
			$marinaWhere = " where name like '$tags%' ";
		}elseif(!empty($tags)){
			$marinaWhere = " where name like '$tags%' or city like '$tags%' ";
		}else{
			$marinaWhere = "";
		}
		
		$marina = $wpdbpro->get_results("select oid as id,name from marina $marinaWhere order by oid $limit");
		if (!empty($wpdbpro->num_rows) && count($wpdbpro->num_rows) != 0) {
			foreach($marina as $marinaTag) {
				$marinaTags['id'] = $marinaTag->id;
				$marinaTags['name'] = $marinaTag->name;
				$marinaTags['type'] = 'marina';
				$allTags[] = $marinaTags;
			}
		}
		
		return $allTags;
		
	}

    // function for get tags address region
    function get_tags_address()
    {
    	global $wpdb;
    	$tags = end(explode(',',$_POST['tags']));
    	$DistrictSearch = explode(',',$_POST['DistrictSearch']);
		$scrollType = !empty($_POST['scrollType'])?$_POST['scrollType']:''; 
	
    	$url  = get_site_url();
    	if(isset($tags) && !empty($tags))
    	{
			$address = $this->addressSearch(trim($tags),$scrollType);
			
    		$type = $allTag = '';
			$countRow = 0;
			if(count($address) != 0 && !empty($address)){
				
				foreach ($address as $value) 
				{
					$idcheck = $value['type'].'_'.$value['id'];
					$found = 0;
					foreach($DistrictSearch as $search){
						if($idcheck == $search){
							$found = 1;
							break;
						}
					}

					$type = $value['type'];
					
					if($type == 'district'){
						$textType = 'Reviere';
						$iconValue = '<img alt="Reviere" src="'.get_stylesheet_directory_uri().'/assets/svg/district.svg" style="width: 20px;" />';
					}else if($type == 'marina'){
						$textType = 'Marinas';
						$iconValue = '<img alt="Marinas" src="'.get_stylesheet_directory_uri().'/assets/svg/marina.svg" style="width: 20px;" />';
					}else if($type == 'city'){
						$textType = 'Städte';
						$iconValue = '<img alt="Städte" src="'.get_stylesheet_directory_uri().'/assets/svg/city.svg" style="width: 20px;" />';
					}else if($type == 'country'){
						$textType = 'Länder';
						$iconValue = '<img alt="'.$value['sign2'].'" src="'.get_stylesheet_directory_uri().'/assets/svgFlag/'.$value['sign2'].'.svg" style="width: 20px;" />';
					}						
					
					if($found == 0){				
						$allTag .= '<li class="'.$idcheck.'" ><div class="liField"><div class="filedIcon">'.$iconValue.'</div><div class="filedTextValue"><label class="searchCheckBox">'.$value['name'].'<input type="checkbox" class="checkboxTags" alt="'.$value['type'].'" rel="'.$value['name'].'" value="1" id="'.$idcheck.'" data="'.$value['sign2'].'" /><span class="checkmark"></span></label></div></div></li>';
					}
					
				}
				
				
				echo $allTag;
			}else if(empty($allTag)){
				echo '<label class="noFoundsOuter" ><div tabindex="-1" class="ui-menu-item-wrapper"><div class="noFounds">Kein Eintrag gefunden</div></div></label>';
			}
    	}
   
		die;
    }
	
	// function for get tags address region
    function get_load_tags()
    {
    	global $wpdb;
    	$DistrictSearch = explode(',',$_POST['DistrictSearch']);
		
		$address = [
			'country_317' => ['Kroatien','hrv'],
			'country_392' => ['Spanien','esp'],
			'country_256' => ['Deutschland','deu'],
			'country_295' => ['Italien','ita'],
			'country_412' => ['Türkei','tur'],
			'country_278' => ['Griechenland','grc'],
			'district_2695' => ['Mallorca-Menorca',''],
			'district_2732' => ['Istrien-Kvarner',''],
		];
		$type = $allTag = '';
		$countRow = 0;
		if(count($address) != 0 && !empty($address)){
			
			foreach ($address as $key => $value) 
			{
				$explodeType = explode('_',$key);				
				$idcheck = $key;
				$found = 0;
				
				foreach($DistrictSearch as $search){
					
					if($idcheck == $search){
						$found = 1;
						break;
					}
				}
				
				
				if($explodeType[0] == 'district'){
					$textType = 'Reviere';
					$iconValue = '<img alt="Reviere" title="Kreis" src="'.get_stylesheet_directory_uri().'/assets/svg/district.svg" style="width: 20px;" />';
				}else if($explodeType[0] == 'marina'){
					$textType = 'Marinas';
					$iconValue = '<img alt="Marinas" title="Yachthafen" src="'.get_stylesheet_directory_uri().'/assets/svg/marina.svg" style="width: 20px;" />';
				}else if($explodeType[0] == 'city'){
					$textType = 'Städte';
					$iconValue = '<img alt="Städte" title="Städte" src="'.get_stylesheet_directory_uri().'/assets/svg/city.svg" style="width: 20px;" />';
				}else if($explodeType[0] == 'country'){
					$textType = 'Länder';
					$iconValue = '<img alt="'.$value[1].'" title="'.$value[1].'" src="'.get_stylesheet_directory_uri().'/assets/svgFlag/'.$value[1].'.svg" style="width: 20px;" />';
				}
			
				if($found == 0){				
					$allTag .= '<li class="'.$idcheck.'"><div class="liField"><div class="filedIcon">'.$iconValue.'</div><div class="filedTextValue"><label class="searchCheckBox">'.$value[0].'<input type="checkbox" class="checkboxTags" alt="'.$explodeType[0].'" rel="'.$value[0].'" value="1" id="'.$idcheck.'" data="'.$value[1].'" /><span class="checkmark"></span></label></div></div></li>';
				}
				
			}
			
			echo $allTag;
		}else if(empty($allTag)){
			echo '<label class="noFoundsOuter" ><div tabindex="-1" class="ui-menu-item-wrapper"><div class="noFounds">Kein Eintrag gefunden</div></div></label>';
		}
    	
   
		die;
    }


	function ps_redirect_after_logout(){
		wp_redirect( site_url() );
		exit();
	}
 
	function remove_admin_bar() {
		if (!current_user_can('administrator') && !is_admin()) {
		  show_admin_bar(false);
		}
	}
	
	function Change_password_Form_Popup(){
		
		$post = $_POST;
		$UserId = email_exists($post['change_email']);
		if($UserId)
		{	
			$UserToken = get_user_meta($UserId, 'UserToken' , true);
			$link = get_site_url().'/reset-password/?token='.$UserToken;
			
			$msg  = __( "<div><h1>Hello!</h1>", 'twentytwenty' ) . "\r\n\r\n";
			$msg  = __( "<p>Please click on the <a href='".$link."'>link </a> to Reset your password</p>", 'twentytwenty' ) . "\r\n\r\n";			
			$msg  = __( "<p> Thanks,</p>", 'twentytwenty' ) . "\r\n\r\n";
			
			if(wp_mail($post['change_email'],'Change Password',$msg))
			{
				echo json_encode(['status' => 1, 'message' => __('Please check your email.','twentytwenty')]);
			}
			else
			{
				echo json_encode(['status' => 0, 'message' => __('Something went wrong with sending email.','twentytwenty')]);
			}
		}
		else
		{
			echo json_encode(['status' => 0, 'message' => __('Email does not exist.','twentytwenty')]);
		}
		die;
	}
	
	
	// function for login user data
	public function Login_Form_Popup()
	{
		$userdata = $_POST;
		$user_verify = wp_signon( $userdata, true ); 
	
		if ( is_wp_error($user_verify)){
			echo json_encode(['status' => 0, 'message' => __('Please add correct email or password.','twentytwenty') ]);
		}else{
			echo json_encode(['status' => 1, 'message' => __('Login Successfully.','twentytwenty') ]);
		}
		die();
	}


	// function for reset password
	function Reset_password_Form()
	{		
		$UserToken  = $_POST['UserToken'];
		$RstPswd    = $_POST['RstPswd'];

		if(!empty($_POST['UserToken']) && !empty($_POST['RstPswd']))
		{
			$args = array(
			    'meta_query' => array(
			        array(
			            'key' => 'UserToken',
			            'value' => $UserToken,
			            'compare' => '='
			        )
			    )
			);
			$UserData = get_users($args);
			if(!empty($UserData))
			{
				$userID     = $UserData[0]->ID;
				$user       = get_user_by( 'ID', $userID );
				$UserEmail  = $user->user_email;

				wp_set_password($_POST['RstPswd'], $userID);

				$msg  = __( "<div><h1>Hello!</h1>", 'twentytwenty' ) . "\r\n\r\n";
				$msg  = __( "<p>Your Password is Reset Successfully</p>", 'twentytwenty' ) . "\r\n\r\n";
				$msg  = __( "<p> Thanks,</p>", 'twentytwenty' ) . "\r\n\r\n";

				wp_mail($UserEmail,'Reset Password',$msg);
				echo json_encode(['status' => 1, 'message' =>'Password changed Successfully']);				
				
			}
			else
			{
				echo json_encode(['status' => 0, 'message' =>'Invalid Token Url'])	;
			}
			
		}
		else
		{
			echo json_encode(['status' => 0, 'message' =>'Something Wrong']);
		}

		
		die();
	}



	// function to submit reg form for desktop
	function Submit_Registartion_Form()
	{
		if (isset( $_POST['User_profile'] ) || wp_verify_nonce( $_POST['User_profile'], 'user_profile_submit' )) 
		{
			$username        =  $_POST['name']. $_POST['lastname'].rand(1000,9999);
			$token           =  md5(rand(10000000,99999999).time());
			$useremail       =  $_POST['email'];
			$userpass        =  $_POST['password'];
			$EmailExists     =  email_exists( $useremail );
			$usernameExists  =  username_exists( $username );
			if(!empty($EmailExists)  || !empty($usernameExists)) 
			{
				echo json_encode(['status' => 0, 'message' => 'User already exist.']);
				die;
			} 
			else 
			{
				global $wpdb;
				$userID = wp_create_user( $username, $userpass, $useremail );

				if(!empty($userID))
				{
					update_user_meta( $userID, 'first_name' , $_POST['name']);
					update_user_meta( $userID, 'useremail'  , $_POST['email']);
					update_user_meta( $userID, 'last_name'  , $_POST['lastname']);
					update_user_meta( $userID, 'phone'      , $_POST['phone']);
					update_user_meta( $userID, 'dateofbirth', $_POST['dateofbirth']);
					update_user_meta( $userID, 'address'    , $_POST['address']);
					update_user_meta( $userID, 'UserToken'  , $token);

					$userID_role = new WP_User($userID);
					$userID_role->set_role('subscriber');
					
					
					echo json_encode(['status' => 1, 'message' => 'Register Successfully.']);

				}
				else
				{
					echo json_encode(['status' => 0, 'message' => 'Something went wrong.']);
				}				
				die;
			}
		}
	}
	
	public function stateby_country(){ 
		global $wpdb;
		
		$sign_up_country = $_POST['sign_up_country'];
		$stateList = $wpdb->get_results("select * from ".$wpdb->prefix."state where country_id = ".$sign_up_country);
		echo "<option value=''> Select State</option>";
		foreach($stateList as $state)
		{
			echo "<option value='".$state->state_id."' >".$state->state_name."</option>";
		}
		die;
	}

	// function for submit reg form for mobile
	function Submit_Reg_Form_Mobile()
	{
		
		if (isset( $_POST['User_profile'] ) || wp_verify_nonce( $_POST['User_profile'], 'user_profile_submit' )) 
		{
		
			$username        =  $_POST['m_fname']. $_POST['m_lastname'].rand(1000,9999);
			$token           =  md5(rand(10000000,99999999).time());
			$useremail       =  $_POST['m_mail'];
			$userpass        =  $_POST['m_password'];
			$EmailExists     =  email_exists( $useremail );
			$usernameExists  =  username_exists( $username );
			
			if(!empty($EmailExists)  || !empty($usernameExists)) 
			{
				echo json_encode(['status' => 0, 'message' => 'User already exist.']);
				die;
			} 
			else 
			{
				
				global $wpdb;
				$userID = wp_create_user( $username, $userpass, $useremail );
				
				if(!empty($userID))
				{
					update_user_meta( $userID, 'first_name' , $_POST['m_fname']);
					update_user_meta( $userID, 'useremail'  , $_POST['m_mail']);
					update_user_meta( $userID, 'last_name'  , $_POST['m_lastname']);
					update_user_meta( $userID, 'phone'      , $_POST['m_phone']);
					update_user_meta( $userID, 'dateofbirth', $_POST['m_dateofbirth']);
					update_user_meta( $userID, 'address'    , $_POST['m_street']);
					update_user_meta( $userID, 'city'       , $_POST['m_city']);
					update_user_meta( $userID, 'country'    , $_POST['m_country']);
					update_user_meta( $userID, 'pincode'    , $_POST['m_code']);
					update_user_meta( $userID, 'UserToken'  , $token);
					$userID_role = new WP_User($userID);
					$userID_role->set_role('subscriber');
					echo json_encode(['status' => 1, 'message' => 'Register Successfully.']);
				}
				else
				{
					echo json_encode(['status' => 0, 'message' => 'Something went wrong.']);
				}				
				die;
			}
		}
	}

	
	// function for login user data Mobile
	public function Login_Form_Popup_Mobile()
	{
		$userdata = $_POST;
		$user_verify = wp_signon( $userdata, true ); 
	
		if ( is_wp_error($user_verify)){
			echo json_encode(['status' => 0, 'message' => __('Please add correct email or password.','twentytwenty') ]);
		}else{
			echo json_encode(['status' => 1, 'message' => __('Login Successfully.','twentytwenty') ]);
		}
		die();
	}
	
	//Function For  Unsubscribe Newslatter email 
	  
	Function unsnewsLetter(){
		
		if($_POST){
			
			$post = $_POST;
			
			if(empty($post['customer_id']) || empty($post['segment'])){
				$data = array(
					'Status' => 403,
					'message' => 'Unsubscribe Error: Something went wrong.',
				);			
				echo json_encode($data);
				exit;
			}
			
			$newsletterUrl = GLOBAL_BOOKING_DOMAIN_LIVE."api/newsletterservice/user/remove/".$post['customer_id']."/".$post['segment'];
			$response = GetJSONBooking($newsletterUrl,'','DELETE');	
			
			
			$data = array(
				'Status' => 200,
				'message' => 'Unsubscribe successfully',
			);
			
			echo json_encode($data);
		 
		}else{
			$data = array(
				'Status' => 403,
				'message' => 'Unsubscribe Error: Something went wrong.',
			);			
			echo json_encode($data);
		}
		exit;
	}
	
}
