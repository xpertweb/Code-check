<?php

/*Template Name: Insert Article Ref Title*/





global $wpdb; 

$articleref = $wpdb->prefix . "articleref";

$result_ref = $wpdb->get_results("SELECT * FROM ".$articleref);



$url = get_site_url();


foreach($result_ref as $ref){	

	

	$curl_handle=curl_init();

	curl_setopt($curl_handle,CURLOPT_URL,$url.'/crmapi/getArticleRef.php?object_oid_fk='.$ref->object_oid_fk);

	curl_setopt($curl_handle,CURLOPT_CONNECTTIMEOUT,2);

	curl_setopt($curl_handle,CURLOPT_RETURNTRANSFER,1);

	$buffer = curl_exec($curl_handle);

	curl_close($curl_handle);

	$ArticleArray = json_decode($buffer, true);

	

	if (empty($ArticleArray))

	{

		print "Nothing returned from url222.<p>";

	}

	else

	{

		print_r($ArticleArray);

		foreach($ArticleArray as $Articles){

			$where = [

				'object_oid_fk' => $ref->object_oid_fk,

				'article_oid_fk' => $Articles['oid']

			];

			$update = $wpdb->update( $articleref, ['articleref_title' => $Articles['h1'] ], $where );

		}

		

	}

}

