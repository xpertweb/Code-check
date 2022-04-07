<?php
	/*Template Name: Insert Short Article */

	
	$url = get_site_url();
	$curl_handle=curl_init();
	$articleID = $template_id = $whereArticle = '';
	$parentCategory = 440;
	$RootCat = '12239970';
	global $wpdbpro;
	
	if(!empty($_GET['articleID'])){
		$articleID = $_GET['articleID'];
	}
	
	if(empty($_GET['template_id'])){		
		echo "Please provide template_id.";		
		die;
	}else{
		$template_id = $_GET['template_id'];
	}
	
	if(!empty($articleID)){
		$whereArticle = " AND `article`.`oid` = '$articleID'";
	}

	
	$article1 = $wpdbpro->get_results("SELECT 
	`article`.`oid` as `articleID`, 
	`category`.`name` as `category_name`,  
	`category`.`link` as `category_slug`, 
	`article`.`category_oid_fk` as `category_id`,
	`category`.`alt` as description ,
	`category`.`link_description` as link_description ,
	`article`.`creation_date` 
	FROM `component` LEFT JOIN `article` ON `component`.`article_oid_fk` = `article`.`oid` LEFT JOIN `category` ON `category`.`oid` = `article`.`category_oid_fk` WHERE   `article`.`template_oid_fk` = '$template_id' $whereArticle AND `article`.`online` = 1 and `article`.`oid` not in (17141178,17141166,17141142,17141108,23410511,23410499,23410463,17141120,23416533) GROUP BY `article`.`oid` ORDER BY `article`.`oid` ASC");
	
	
	$article1 = json_decode(json_encode($article1),true);
	
	if (count($article1) > 0) {
		foreach($article1 as $keyArt => $row_article1){
			
			$mainCat = get_YCF_articles($row_article1['category_id']);			
			if($mainCat != $RootCat){					
				unset($article1[$keyArt]);
				continue;
			}
			
			$getCat_slug = create_slugs($row_article1['category_name']);
			
			$article1[$keyArt]['category_slug'] = !empty($row_article1['category_slug'])?strtolower($row_article1['category_slug']):$getCat_slug;
			$article1[$keyArt]['site_title'] = strtolower($row_article1['link_description']);
			
			$article = $wpdbpro->get_results("SELECT * FROM `component` WHERE `article_oid_fk` = '".$row_article1['articleID']."' AND `lang` = 1 ORDER BY `pos` ASC");
			
			$max_pos = $wpdbpro->get_results("SELECT max(pos) as max_pos FROM `component` WHERE `article_oid_fk` = '".$row_article1['articleID']."' AND `lang` = 1 ORDER BY `pos` ASC");

			foreach($article as $row_article){
				
				$row_article = json_decode(json_encode($row_article),true);
				
				if($row_article['type'] == 0 && $row_article['pos'] == 0 && $row_article['name'] != ''){						
					$article1[$keyArt]['img1_url'] = LIVE_IMG_URL.$row_article['oid'].'-'.create_slug($row_article['name']).'.jpg';
					$article1[$keyArt]['img1_componentID'] = $row_article['oid'];
					$article1[$keyArt]['img1_image_name'] = create_slug($row_article['name']);
				}else if($row_article['type'] == 1 && $row_article['pos'] == 0 && $row_article['name'] != ''){						
					$article1[$keyArt]['img1_url'] = LIVE_IMG_URL.$row_article['oid'].'-'.create_slug($row_article['name']).'.jpg';
					$article1[$keyArt]['img1_componentID'] = $row_article['oid'];
					$article1[$keyArt]['img1_image_name'] = create_slug($row_article['name']);
				}else if($row_article['type'] == 1 && $row_article['pos'] == 1 && $row_article['name'] != ''){ 
					$article1[$keyArt]['img1_url'] = LIVE_IMG_URL.$row_article['oid'].'-'.create_slug($row_article['name']).'.jpg';
					$article1[$keyArt]['img1_componentID'] = $row_article['oid'];
					$article1[$keyArt]['img1_image_name'] = create_slug($row_article['name']);
				}
				
				if($row_article['type'] == 1 && $row_article['pos'] == 0 && !empty($row_article['headline']))
				{
					$article1[$keyArt]['image_alt_text'] = !(empty($row_article['headline']))?htmlspecialchars($row_article['headline']):'';
				}
				
				if($row_article['type'] == 2 && $row_article['pos'] == 1 && !empty($row_article['text']))
				{
					$articleTxt = htmlspecialchars($row_article['text']);					
					$without_replace1 = !(empty($articleTxt))?($articleTxt):'';
					
					$replace_first1 = str_ireplace("##link_article##","[link_article shortarticleid='".$row_article1['articleID']."'  articleid='",$without_replace1);
					$replace_second1 = str_ireplace("##link_oid##","' articletext='",$replace_first1);
					$replace_third1 = str_ireplace("##link_end##","']",$replace_second1);
					
					$article1[$keyArt]['txt1'] = $replace_third1;
					
					$article1[$keyArt]['linked_article_id'] = get_string_between($articleTxt,'##link_article##','##link_oid##');
					$article1[$keyArt]['linked_article_text'] = get_string_between($articleTxt,'##link_oid##','##link_end##');
				}					

				if($row_article['type'] == 3 && $row_article['pos'] == 2 && !empty($row_article['headline']))
				{
					$article1[$keyArt]['title'] = !(empty($row_article['headline']))?htmlspecialchars($row_article['headline']):'';
				}				
				
				if($max_pos[0]->max_pos == 3){
				
					if($row_article['type'] == 4 && $row_article['pos'] == 2 && !empty($row_article['headline']))
					{
						$article1[$keyArt]['top_img_title'] = !(empty($row_article['headline']))?htmlspecialchars($row_article['headline']):'';
					}
					
					if($row_article['type'] == 4 && $row_article['pos'] == 3 && !empty($row_article['headline'])){
						$article1[$keyArt]['very_top_title'] = !(empty($row_article['headline']))?htmlspecialchars($row_article['headline']):'';
					}
					
				}else if($max_pos[0]->max_pos == 4){
					
					if($row_article['type'] == 4 && $row_article['pos'] == 3 && !empty($row_article['headline']))
					{
						$article1[$keyArt]['top_img_title'] = !(empty($row_article['headline']))?htmlspecialchars($row_article['headline']):'';
					}
					
					if($row_article['type'] == 4 && $row_article['pos'] == 4 && !empty($row_article['headline'])){
						$article1[$keyArt]['very_top_title'] = !(empty($row_article['headline']))?htmlspecialchars($row_article['headline']):'';
					}
					
				}
			
			}
		}
	}	
	
	$ArticleArray = $article1;	
	echo '<pre>';
	print_r($ArticleArray);
	// die;

	if (empty($ArticleArray))
	{  
		print "Nothing returned from url.<p>";
	}
	else
	{
		global $wpdb; 
		$tn =  $wpdb->prefix."posts";
		$tn2 =  $wpdb->prefix."temp_posts";

		// Get WP directory path (Uploads Folder)
		$path = preg_replace('/wp-content(?!.*wp-content).*/','',__DIR__);
		include($path.'wp-load.php');
		$wordpress_upload_dir = wp_upload_dir();
		$subdir   =  substr($wordpress_upload_dir['subdir'], 1);        
		$fullpath = $wordpress_upload_dir['path'];         
		$imageUrl = $wordpress_upload_dir['url'].'/';
		
		foreach ($ArticleArray as $key => $value) 
		{
			// echo '<pre>';
			// print_r($value);
			// die;
			
			/*======Update post Slug=========*/
			$post_name  = str_replace(" ","-" ,$value['title']); 
			$post_name  = preg_replace('/[^a-zA-Z0-9_ -]/s','',$post_name);
			
			$my_img = $value['img1_url'];
			$GetArticle = $wpdb->get_results("SELECT * FROM ".$tn." WHERE articleID = ".$value['articleID']." and is_short = 1 ");
		
			$contentImg1  = [];
			$attach_id = '';
			
			
			/*======Update Description=========*/
			$post_content = htmlspecialchars_decode($value['txt1']);
			
			
			if(empty($GetArticle))
			{
				/*=========insert Image of post==============*/
			
				if(UR_exists($my_img))
				{
					// Get IMage form URL
					image_save_from_url($my_img,$fullpath);
					$my_img = str_replace(' ', '-', $my_img);
					$IMGUrl = $imageUrl.basename($my_img);	    	
					$attachment_file = $imageUrl.basename($my_img);			    	
					
					$post_info = array(
						'guid'              => $IMGUrl, 
						'post_mime_type'    => 'image/jpg',
						'post_content'      => !(empty($value['top_img_title']))?$value['top_img_title']:'',
						'post_excerpt'      => !(empty($value['top_img_title']))?$value['top_img_title']:'',
						'post_title'        => 'image'.uniqid(),
						'post_type'         => 'attachment',
						'post_status'       => 'inherit',
						'post_date'         => date('Y-m-d h:i:s') 
					);
				   
					// INsert image in WP directory
					$attach_id = wp_insert_attachment( $post_info,$attachment_file); 
					require_once( ABSPATH . 'wp-admin/includes/image.php' );
					$attach_data = wp_generate_attachment_metadata( $attach_id,$attachment_file);
					wp_update_attachment_metadata( $attach_id, $attach_data);
					
				}
				
				if(empty($attach_id)){
					$attach_id = '1348';
				}		        
				
				if(empty($my_img)){
					$contentImg1[] = get_site_url().'/wp-content/uploads/2020/07/related_post_no_available_image.png';
				}
				else{
					$contentImg1 = wp_get_attachment_image_src( $attach_id );
				}
				
				$data_array   = array(
					'post_content'   => $post_content,
					'post_title'     => $value['title'],
					'post_status'    => 'publish',                         
					'post_name'      => strtolower($post_name),                       
					'post_type'      => 'articles',
					'articleID'      => $value['articleID'], 
					'comment_count'  => 1,
					'post_date'      => $value['creation_date']                        
				);

				// Insert Post
				try
				{	
					$postID   = wp_insert_post($data_array);
					$wpdb->update( $tn,array('articleID' => $value['articleID'] , 'is_short' => 1 ), array( 'ID' => $postID ) );
					update_post_meta($postID,'article_top_title',$value['very_top_title']);
					update_post_meta($postID,'short_img_desc',$value['top_img_title']);
					update_post_meta($postID,'image_alt_text',$value['image_alt_text']);
					update_post_meta($postID,'linked_article_id',$value['linked_article_id']);
					update_post_meta($postID,'linked_article_text',$value['linked_article_text']);
					update_post_meta($postID,'linked_article_text',$value['linked_article_text']);
					update_post_meta($postID,'img1_image_name',$value['img1_image_name']);
					
					update_post_meta($postID,'image1_full_path',$contentImg1[0]);
					
					set_post_thumbnail($postID, $attach_id);

				}				
				catch (exception $e) 
				{

					$exc_msg    = $e->getMessage();
					$Temp_data  = array(
						'ArticleID'   => $value['articleID'],
						'post_type'   => 'articles',
						'CatchMsg'    => $exc_msg                        
					);
					$wpdb->insert($tn2, $Temp_data);
					continue;

				}
				
				// assign post id to image (as post_parent)
				wp_update_post(
					array(
						'ID' => $attach_id, 
						'post_parent' => $postID
					)
				);
				
				echo  $postID.'..   inserted'.'<br>';
			}
			else
			{				
				$postID = $GetArticle[0]->ID;	
				echo "<br>Record Already Exist ".$postID."<br>"; 
				
				$img1_image_name = get_post_meta($postID,'img1_image_name',true);
				if($img1_image_name != $value['img1_image_name']){					
					if(UR_exists($my_img))
					{
						/*======Delete attachment image===========*/
						$media = get_attached_media( 'image', $GetArticle[0]->ID );
						if(!empty($media) && count($media) > 0){
							foreach($media as $media_File){
								wp_delete_attachment( $media_File->ID );
							}
						}
					
						// Get IMage form URL
						image_save_from_url($my_img,$fullpath);
						$my_img = str_replace(' ', '-', $my_img);
						$IMGUrl = $imageUrl.basename($my_img);	    	
						$attachment_file = $imageUrl.basename($my_img);			    	
						
						$post_info = array(
							'guid'              => $IMGUrl, 
							'post_mime_type'    => 'image/jpg',
							'post_content'      => !(empty($value['top_img_title']))?$value['top_img_title']:'',
							'post_excerpt'      => !(empty($value['top_img_title']))?$value['top_img_title']:'',
							'post_title'        => 'image'.uniqid(),
							'post_type'         => 'attachment',
							'post_status'       => 'inherit',
							'post_date'         => date('Y-m-d h:i:s') 
						);
					   
						// INsert image in WP directory
						$attach_id = wp_insert_attachment( $post_info,$attachment_file); 
						require_once( ABSPATH . 'wp-admin/includes/image.php' );
						$attach_data = wp_generate_attachment_metadata( $attach_id,$attachment_file);
						wp_update_attachment_metadata( $attach_id, $attach_data);
						
					}
					
					
					
					if(empty($attach_id)){
						$attach_id = '1348';
					}		        
					
					if(empty($my_img)){
						$contentImg1[] = get_site_url().'/wp-content/uploads/2020/07/related_post_no_available_image.png';
					}
					else{
						$contentImg1 = wp_get_attachment_image_src( $attach_id );
					}
					
					set_post_thumbnail($postID, $attach_id);
				
					wp_update_post(
						array(
							'ID' => $attach_id, 
							'post_parent' => $postID
						)
					);

					update_post_meta($postID,'image1_full_path',$contentImg1[0]);					
				}
				
				$data_array   = array(
					'post_content'   => $post_content,
					'post_title'     => $value['title'],                  
					// 'post_name'      => strtolower($post_name),
					'is_short'       => 1 ,
					'comment_count'  => 1 
				);

				$where = array('ID' => $postID );
				$update = $wpdb->update( $tn, $data_array, $where );
				
				update_post_meta($postID,'article_top_title',$value['very_top_title']);
				update_post_meta($postID,'short_img_desc',$value['top_img_title']);
				update_post_meta($postID,'image_alt_text',$value['image_alt_text']);
				update_post_meta($postID,'linked_article_id',$value['linked_article_id']);
				update_post_meta($postID,'linked_article_text',$value['linked_article_text']);
				update_post_meta($postID,'img1_image_name',$value['img1_image_name']);			
				
			}
			
			
			$taxonomy1 = 'article_category';		
			$GetExistingTerm1 = get_term_by('slug', $value['category_slug'] , $taxonomy1);				
			wp_set_post_terms($postID, $GetExistingTerm1->term_id , $taxonomy1);
			
		}

	}

?>