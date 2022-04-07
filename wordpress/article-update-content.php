<?php
/*Template Name: Article Api Update content*/

global $wpdb;
$args = ['post_type' => 'articles' , 'numberposts' => '-1'];

$articleList = get_posts($args);

foreach($articleList as $article){
	
	if (strpos($article->post_content, '##') !== false) {
		
		$mainContent = '';
		$post_content = explode('##link_article##',$article->post_content);
		foreach($post_content as $key => $content){
			
			if($key == 0){
				$mainContent .= $content;
				continue;
			}
			
			$InnerpostContent = explode('##',$content);
			
			$postsInner = $wpdb->get_results("select ID,guid from ".$wpdb->prefix."posts where articleID = ".$InnerpostContent[0]);
			
			if(count($postsInner) != 0){
				$mainContent .= "<a href='".$postsInner[0]->guid."'>".$InnerpostContent[2]."</a> ";				
				$mainContent .= end($InnerpostContent);
			}else{
				$mainContent .= end($InnerpostContent);
			}		
			
		}
		
		$article->post_content = $mainContent;		
		
		// put here update query
		// $data = [ 'post_content' => $mainContent ];
		// $where = [ 'ID' => $article->ID ];
		// $wpdb->update( $wpdb->prefix."posts" , $data, $where);
	
	}
}
echo '<pre>';
print_r($articleList);
