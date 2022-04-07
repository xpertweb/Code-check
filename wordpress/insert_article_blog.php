<?php 
/* Template Name: Insert Article Blog */ 

global $post, $wpdb;
$tn =  $wpdb->prefix."posts";
$tn2 =  $wpdb->prefix."temp_posts";
$url = get_site_url();

if(!empty($_GET['template_id']) && !empty($_GET['pagination']) ){
	$articleData = getJSONS($url."/crmapi/getArticleBlog.php?template_id=".$_GET['template_id']."&pagination=".$_GET['pagination']);
	
	$articleData = json_decode($articleData,true);
	echo '<pre>';
	
	if(!empty($articleData)){
		foreach($articleData as $value){
		
			$GetArticle = $wpdb->get_results("SELECT * FROM ".$tn." WHERE articleID =".$value['articleID']." OR post_title='".$value['title']."'");

			if(empty($GetArticle))
			{
				$data_array   = array(
					'post_content'   => $value['txt1'],
					'post_title'     => $value['title'],
					'post_status'    => 'publish',                         
					'post_name'      => strtolower($post_name),                       
					'post_type'      => 'articles',
					'articleID'      => $value['articleID'], 
					'post_date'      => $value['creation_date']                        
				);
				 
				try
				{
					$postID   = wp_insert_post($data_array);
					$wpdb->update( $tn,array('articleID' => $value['articleID'] , 'is_short' => 1 , 'comment_count' => 1), array( 'ID' => $postID ) );
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
			}else{
				echo "Record Already Exist<br>";
				
				/*==============insert category =============*/
				$result1 = $wpdb->get_row("SELECT * FROM ".$tn." WHERE articleID = ".$value['articleID']);
				$GetPostID = $result1->ID;
				
				$categoryArray = getJSONS($url."/crmapi/get_categories.php?article_id=".$value['articleID']);
				$categoryArray = json_decode($categoryArray, true);
				// echo '<pre>';
				// print_r($categoryArray);
				// die;
				if (empty($categoryArray)){  
					print "<p>Nothing returned from url.<p>";
				}else{	
					$parentCategory = 440;
					insertCategoryHierarchyFn($categoryArray, $parentCategory , $GetPostID);
				}
			}
		}
	}else{
		print "Nothing returned from url.<p>";
	}
}else{
	print "Nothing returned from url.<p>";
}