<?php 
/* Template Name: Update Alt Image */ 

global $post, $wpdb;

$url = get_site_url();

/*===========Short Article start=============*/
// $posts = get_posts([
  // 'post_type' => 'articles',
  // 'post_status' => 'publish',
  // 'comment_count' => 1,
  // 'posts_per_page' => 1000 
// ]);
// foreach($posts as $post){	
	// $thumb_id = get_post_thumbnail_id( $post->ID );
	// $short_img_desc = get_post_meta($post->ID,'short_img_desc',true);
	// update_post_meta($thumb_id,'_wp_attachment_image_alt',$short_img_desc);	
// }
/*===========Short Article end=============*/

/*===========Long Article start=============*/
// $posts = get_posts([
  // 'post_type' => 'articles',
  // 'post_status' => 'publish',
  // 'comment_count' => 0,
  // 'posts_per_page' => -1 
// ]);

// foreach($posts as $post){
	
	// $thumb_id = get_post_thumbnail_id( $post->ID );
	// if($post->articleID != 0){
		// $articleData = getJSONS($url.'/crmapi/getSingleArticle.php?articleID='.$post->articleID);
		// $ArticleArray = json_decode($articleData);
	
		// if(!empty($ArticleArray['top_img_title'])){
			// update_post_meta($thumb_id,'_wp_attachment_image_alt',$ArticleArray['top_img_title']);	
		// }else if(!empty($ArticleArray['bottom_img_title'])){
			// update_post_meta($thumb_id,'_wp_attachment_image_alt',$ArticleArray['bottom_img_title']);
		// }
	// }
// }
/*===========Long Article end=============*/

/*===========Category start=============*/
// $childCat = get_categories(array('taxonomy'=>'article_category'));
// foreach($childCat as $cat){
	
	// if($cat->term_id != 0){
		
		// $CategoryData = getJSONS($url.'/crmapi/getSingleCategory.php?categorySlug='.$cat->slug);
		// $CategoryDataArray = json_decode($CategoryData);
		// update_term_meta( $cat->term_id, 'cat_site_title', $CategoryDataArray[0]->link_description);
		// print_r($CategoryDataArray);
	// }
// }
/*===========Category end=============*/

/*===========Short Article Read more title start=============*/
$posts = get_posts([
  'post_type' => 'articles',
  'post_status' => 'publish',
  'comment_count' => 1,
  'posts_per_page' => 1000 
]);
foreach($posts as $post){	
	if($post->articleID != 0){
		
		$CategoryData = getJSONS($url.'/crmapi/getReadMore.php?articleID='.$post->articleID);
		$CategoryArray = json_decode($CategoryData);		
		update_post_meta($post->ID,'read_more_link_title',$CategoryArray->description);	
	}
}
/*===========Short Article Read more title end=============*/
