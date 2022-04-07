<?php 
/** Template Name: Insert all catgories*/

$parentCategory = 440;
global $wpdb;


$categoryListArray = [
	7152182,
	17980095,
	17983761,
	23111536
];

// echo '<pre>';
foreach($categoryListArray as $categoryList){		
	$api_url = LIVE_ARTICLE_DOMAIN.'article/article_category/'.$categoryList;
	$categoryArticle = getJSONS($api_url);
	$categoryArticleArr = json_decode($categoryArticle,true);	
	// print_r($categoryArticleArr);	

	foreach($categoryArticleArr['data'] as $cateArrKey =>  $cateArrValue){

		$articleData = $wpdb->get_results("select * from ".$wpdb->prefix."posts where articleID = ".$cateArrKey);
		
		$i = 0;
		if(!empty($articleData[0]->ID)){
			insertCateHierarchy1($cateArrValue, $parentCategory , $articleData[0]->ID );
		}else{
			echo "<br>post not found . ========== articleID=".$cateArrKey;
			insertCateHierarchy1($cateArrValue, $parentCategory );
		}
	}
}
?>