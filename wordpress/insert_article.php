<?php
	/* Template Name: Insert Article */

	

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
	
	$article1 = $wpdbpro->get_results("SELECT `article`.`oid` as `articleID`, `category`.`name` as `category_name`, `article`.`category_oid_fk` as `category_id`, `article`.`creation_date` FROM `component` LEFT JOIN `article` ON `component`.`article_oid_fk` = `article`.`oid` LEFT JOIN `category` ON `category`.`oid` = `article`.`category_oid_fk` WHERE   `article`.`template_oid_fk` = '$template_id' $whereArticle AND `article`.`online` = 1 GROUP BY `article`.`oid` ORDER BY `article`.`oid` ASC ");
	
	$article1 = json_decode(json_encode($article1),true);
	
	
	if (count($article1) > 0) {
		foreach($article1 as $keyArt => $row_article1) {
			
			$mainCat = get_YCF_articles($row_article1['category_id']);			
			if($mainCat != $RootCat){					
				unset($article1[$keyArt]);
				continue;
			}
			
			/*======Image ===========*/
			$articleImg = $wpdbpro->get_results("SELECT * FROM `component` WHERE `article_oid_fk` = '".$row_article1['articleID']."' AND `lang` = 1 and type = 1 ORDER BY `pos` ASC");
			
			if(!empty($articleImg[0]->oid)){
				$article1[$keyArt]['img1_url'] = LIVE_IMG_URL.$articleImg[0]->oid.'-'.create_slug($articleImg[0]->name).'.jpg';
				$article1[$keyArt]['img1_componentID'] = $articleImg[0]->oid;
				$article1[$keyArt]['img1_image_name'] = create_slug($articleImg[0]->name);
				$article1[$keyArt]['image1_alt_text'] = !(empty($articleImg[0]->headline))?htmlspecialchars($articleImg[0]->headline):'';
			}
			
			if(!empty($articleImg[1]->oid)){
				$article1[$keyArt]['img2_url'] = LIVE_IMG_URL.$articleImg[1]->oid.'-'.create_slug($articleImg[1]->name).'.jpg';
				$article1[$keyArt]['img2_componentID'] = $articleImg[1]->oid;
				$article1[$keyArt]['img2_image_name'] = create_slug($articleImg[1]->name);
				$article1[$keyArt]['image2_alt_text'] = !(empty($articleImg[1]->headline))?htmlspecialchars($articleImg[1]->headline):'';
			}
			
			/*====== Text ===========*/
			$articleText = $wpdbpro->get_results("SELECT * FROM `component` WHERE `article_oid_fk` = '".$row_article1['articleID']."' AND `lang` = 1 and type = 2 ORDER BY `pos` ASC");
			
			if(!empty($articleText[0]->oid)){
				$without_replace1 = htmlspecialchars($articleText[0]->text);
				
				$replace_first1 = str_ireplace("##link_article##","[link_article articleid='",$without_replace1);
				$replace_second1 = str_ireplace("##link_oid##","' articletext='",$replace_first1);
				$replace_third1 = str_ireplace("##link_end##","']",$replace_second1);
				
				$article1[$keyArt]['txt1'] = $replace_third1;
			}
			if(!empty($articleText[1]->oid)){
				$without_replace2 = htmlspecialchars($articleText[1]->text);
				
				$replace_first2 = str_ireplace("##link_article##","[link_article articleid='",$without_replace2);
				$replace_second2 = str_ireplace("##link_oid##","' articletext='",$replace_first2);
				$replace_third2 = str_ireplace("##link_end##","']",$replace_second2);
				
				$article1[$keyArt]['txt2'] = $replace_third2;
			}
			if(!empty($articleText[2]->oid)){
				$without_replace3 = htmlspecialchars($articleText[2]->text);
				
				$replace_first3 = str_ireplace("##link_article##","[link_article articleid='",$without_replace3);
				$replace_second3 = str_ireplace("##link_oid##","' articletext='",$replace_first3);
				$replace_third3 = str_ireplace("##link_end##","']",$replace_second3);				
		
				$article1[$keyArt]['txt3'] = $replace_third3;			
				
			}
			
			
			/*====== Title ===========*/
			$articleTitle = $wpdbpro->get_results("SELECT * FROM `component` WHERE `article_oid_fk` = '".$row_article1['articleID']."' AND `lang` = 1 and type = 3 ORDER BY `pos` ASC");
			
			if(!empty($articleTitle[0]->oid)){
				$article1[$keyArt]['title'] = !(empty($articleTitle[0]->headline))?htmlspecialchars($articleTitle[0]->headline):'';
			}
			
			/*====== image title & alt  ===========*/
			$articleImgTitle = $wpdbpro->get_results("SELECT * FROM `component` WHERE `article_oid_fk` = '".$row_article1['articleID']."' AND `lang` = 1 and type = 4 ORDER BY `pos` ASC");
		
			
			if(!empty($articleImgTitle[0]->oid)){
				$article1[$keyArt]['image1_title'] = !(empty($articleImgTitle[0]->headline))?htmlspecialchars($articleImgTitle[0]->headline):'';				
			}
			
			if(!empty($articleImgTitle[1]->oid)){
				$article1[$keyArt]['very_top_title'] = !(empty($articleImgTitle[1]->headline))?htmlspecialchars($articleImgTitle[1]->headline):'';				
			}
			
			if(!empty($articleImgTitle[2]->oid)){
				$article1[$keyArt]['image2_title'] = !(empty($articleImgTitle[2]->headline))?htmlspecialchars($articleImgTitle[2]->headline):'';				
			}
			
		}		
	}
	
	$ArticleArray = $article1;
	
	
	echo '<pre>';
	print_r($ArticleArray);
	die;
	
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
            $GetArticle = $wpdb->get_results("SELECT * FROM ".$tn." WHERE articleID =".$value['articleID']);
			
            if(empty($GetArticle))
            {
	    		$img1 = $img2 = '';
            	$contentImg1 = $contentImg2 = $imageIDs = $my_img = [];
				
		    	if(UR_exists($value['img1_url'])){
		    		$my_img[] = $img1 = $value['img1_url'];
		    	}

		    	if(UR_exists($value['img2_url'])){
		    		$my_img[] = $img2 = $value['img2_url'];
		    	}

		    	// Get IMage form URL
		    	foreach($my_img as $ij)
	            {
			    	if(UR_exists($ij))
			    	{
				    	image_save_from_url($ij,$fullpath);
				    	$IMGUrl = $imageUrl.basename($ij);	    	
				    	$attachment_file = $imageUrl.basename($ij);	     
				    	
				    	$post_info = array(
			                'guid'           => $IMGUrl, 
			                'post_mime_type' => 'image/jpg',
			                'post_content'   => !(empty($value['image1_title']))?$value['image1_title']:'',
		                	'post_excerpt'   => !(empty($value['image1_title']))?$value['image1_title']:'',
			                'post_title'     => 'image'.uniqid(),
			                'post_type'      => 'attachment',
			                'post_status'    => 'inherit',
			                'post_date'      => date('Y-m-d h:i:s') 
			            );

			            // INsert image in WP directory
			            $attach_id = wp_insert_attachment( $post_info,$attachment_file);
			            require_once( ABSPATH . 'wp-admin/includes/image.php' );
			            $attach_data = wp_generate_attachment_metadata( $attach_id,$attachment_file);
			            wp_update_attachment_metadata( $attach_id, $attach_data);
			            $imageIDs[] = $attach_id; 
			        }
	            }
				
	            if(count($imageIDs) != 0){
	            	$attach_id = $imageIDs[0];
	            }
		        else
		        {
		        	$attach_id = '1348';
		        }
		        
		    	
		    	if(empty($img1)){
		    		$contentImg1[] = get_site_url().'/wp-content/uploads/2020/07/related_post_no_available_image.png';
		    	}
		    	else{
		    		$contentImg1 = wp_get_attachment_image_src( $imageIDs[0] );
		    	}

		    	if(empty($img2)){
		    		$contentImg2[] = get_site_url().'/wp-content/uploads/2020/07/related_post_no_available_image.png';
		    	}
		    	else{
		    		if(empty($img1)){
			    		$contentImg2 = wp_get_attachment_image_src( $imageIDs[0]);  
			    	}else{
			    		$contentImg2 = wp_get_attachment_image_src( $imageIDs[1]); 
			    	}
		    	}

				$post_name  = str_replace(" ","-" ,$value['title']); 
				$post_name  = preg_replace('/[^a-zA-Z0-9_ -]/s','',$post_name);
				
            	$post_content =  htmlspecialchars_decode($value['txt1']).'<div class="cont_img">[caption  align="alignnone"]<img src="'.$contentImg1[0].'" alt="'.$value['image1_alt_text'].'"  class="size-full" />[/caption]<div class="title_under_image">'.$value['image1_title'].'</div></div>'.htmlspecialchars_decode($value['txt2']).'<div class="cont_img">[caption  align="alignnone"]<img src="'.$contentImg2[0].'" alt="'.$value['image2_alt_text'].'"  class="size-full" />[/caption]<div class="title_under_image">'.$value['image2_title'].'</div></div>'.htmlspecialchars_decode($value['txt3']);

	            $data_array   = array(
	                'post_content'   => $post_content,
	                'post_title'     => $value['title'],
	                'post_status'    => 'publish',                         
	                'post_name'      => strtolower($post_name),                       
	                'post_type'      => 'articles',
	                'post_date'      => $value['creation_date']                        
	            );

	            // Insert Post     
				try
				{
					$postID = wp_insert_post($data_array);
					$wpdb->update( $tn , array('articleID' => $value['articleID']), array( 'ID' => $postID ) );
					
					update_post_meta($postID,'article_top_title',$value['very_top_title']);
					update_post_meta($postID,'img1_image_name',$value['img1_image_name']);
					update_post_meta($postID,'image1_alt_text',$value['image1_alt_text']);
					update_post_meta($postID,'image1_title',$value['image1_title']);
					update_post_meta($postID,'image1_full_path',$contentImg1[0]);
					update_post_meta($postID,'img2_image_name',$value['img2_image_name']);
					update_post_meta($postID,'image2_alt_text',$value['image2_alt_text']);
					update_post_meta($postID,'image2_title',$value['image2_title']);
					update_post_meta($postID,'image2_full_path',$contentImg2[0]);

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
				if(count($imageIDs) != 0){
					$imageIDs = array_reverse($imageIDs);
					foreach($imageIDs as $imageID_attach){
						wp_update_post(
							array(
								'ID' => $imageID_attach, 
								'post_parent' => $postID
							)
						);
						set_post_thumbnail($postID, $imageID_attach);
					}
				}else{
					wp_update_post(
						array(
							'ID' => $attach_id, 
							'post_parent' => $postID
						)
					);
					set_post_thumbnail($postID, $attach_id);
				}
				echo  $postID.'   inserted'.'<br>';
	        }
	        else
	        {
				$postID = $GetArticle[0]->ID;
            	echo "Record Already Exist".$postID."<br>";
				
				$img1 = $img2 = '';
            	$contentImg1 = $contentImg2 = $imageIDs = $my_img = [];
				
				/*==========Image1 check present==========*/
				$img1_image_name = get_post_meta($postID,'img1_image_name',true);
				if($img1_image_name != $value['img1_image_name']){
					if(UR_exists($value['img1_url'])){
						$my_img[] = $img1 = $value['img1_url'];
					}
				}else{
					$contentImg1 = get_post_meta($postID,'image1_full_path');
				}
				
				/*========image2 check present============*/
				$img2_image_name = get_post_meta($postID,'img2_image_name',true);
				if($img2_image_name != $value['img2_image_name']){
					if(UR_exists($value['img2_url'])){
						$my_img[] = $img2 = $value['img2_url'];
					}
				}else{
					$contentImg2 = get_post_meta($postID,'image2_full_path');
				}
			

		    	// Get IMage form URL
				if(count($my_img) > 0){
					foreach($my_img as $ij)
					{
						if(UR_exists($ij))
						{
							image_save_from_url($ij,$fullpath);
							$IMGUrl = $imageUrl.basename($ij);	    	
							$attachment_file = $imageUrl.basename($ij);	     
							
							$post_info = array(
								'guid'           => $IMGUrl, 
								'post_mime_type' => 'image/jpg',
								'post_content'   => !(empty($value['image1_title']))?$value['image1_title']:'',
								'post_excerpt'   => !(empty($value['image1_title']))?$value['image1_title']:'',
								'post_title'     => 'image'.uniqid(),
								'post_type'      => 'attachment',
								'post_status'    => 'inherit',
								'post_date'      => date('Y-m-d h:i:s') 
							);

							// INsert image in WP directory
							$attach_id = wp_insert_attachment( $post_info,$attachment_file);
							require_once( ABSPATH . 'wp-admin/includes/image.php' );
							$attach_data = wp_generate_attachment_metadata( $attach_id,$attachment_file);
							wp_update_attachment_metadata( $attach_id, $attach_data);
							$imageIDs[] = $attach_id; 
						}
					}
					
					if(count($imageIDs) != 0){
						$attach_id = $imageIDs[0];
					}
					else
					{
						$attach_id = '1348';
					}
					
					
					if(empty($img1)){
						$contentImg1[] = get_site_url().'/wp-content/uploads/2020/07/related_post_no_available_image.png';
					}
					else{
						$contentImg1 = wp_get_attachment_image_src( $imageIDs[0] );
					}

					if(empty($img2)){
						$contentImg2[] = get_site_url().'/wp-content/uploads/2020/07/related_post_no_available_image.png';
					}
					else{
						if(empty($img1)){
							$contentImg2 = wp_get_attachment_image_src( $imageIDs[0]);  
						}else{
							$contentImg2 = wp_get_attachment_image_src( $imageIDs[1]); 
						}
					}
				}				
	            
				
				$post_name  = str_replace(" ","-" ,$value['title']); 
				$post_name  = preg_replace('/[^a-zA-Z0-9_ -]/s','',$post_name);	
				
            	$post_content =  htmlspecialchars_decode($value['txt1']).'<div class="cont_img">[caption  align="alignnone"]<img src="'.$contentImg1[0].'" alt="'.$value['image1_alt_text'].'"  class="size-full" />[/caption]<div class="title_under_image">'.$value['image1_title'].'</div></div>'.htmlspecialchars_decode($value['txt2']).'<div class="cont_img">[caption  align="alignnone"]<img src="'.$contentImg2[0].'" alt="'.$value['image2_alt_text'].'"  class="size-full" />[/caption]<div class="title_under_image">'.$value['image2_title'].'</div></div>'.htmlspecialchars_decode($value['txt3']);
            	
				$data_array   = array(
					'post_content'   => $post_content,
					'post_title'     => $value['title'],
					'comment_count'  => 1 
				);

				$where = array('ID' => $postID );
				$update = $wpdb->update( $tn, $data_array, $where );
				
				update_post_meta($postID,'article_top_title',$value['very_top_title']);
				update_post_meta($postID,'img1_image_name',$value['img1_image_name']);
				update_post_meta($postID,'image1_alt_text',$value['image1_alt_text']);
				update_post_meta($postID,'image1_title',$value['image1_title']);
				update_post_meta($postID,'image1_full_path',$contentImg1[0]);
				update_post_meta($postID,'img2_image_name',$value['img2_image_name']);
				update_post_meta($postID,'image2_alt_text',$value['image2_alt_text']);
				update_post_meta($postID,'image2_title',$value['image2_title']);
				update_post_meta($postID,'image2_full_path',$contentImg2[0]);
				
				
				// assign post id to image (as post_parent)
				if(count($imageIDs) != 0){
					$imageIDs = array_reverse($imageIDs);
					foreach($imageIDs as $imageID_attach){
						wp_update_post(
							array(
								'ID' => $imageID_attach, 
								'post_parent' => $postID
							)
						);
						set_post_thumbnail($postID, $imageID_attach);
					}
				}else{
					wp_update_post(
						array(
							'ID' => $attach_id, 
							'post_parent' => $postID
						)
					);
					set_post_thumbnail($postID, $attach_id);
				}
	    	}
	    }

	}


?>