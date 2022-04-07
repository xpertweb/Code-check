<?php
/* Template Name: General Terms */ 

get_header();

global $wpdbpro;

$articles = $wpdbpro->get_results("select * from article where category_oid_fk = 147084419 order by oid"); //147084419

?>
<div class="policy-class">
	<div class="max-width policies">
		<?php 
		foreach($articles as $article){
			
			$articlesHeading = $wpdbpro->get_results("select headline from component where type = 4 and article_oid_fk = ".$article->oid); 
			// echo $wpdbpro->last_query;
			$articlesText = $wpdbpro->get_results("select text from component where type = 2 and article_oid_fk = ".$article->oid); 
			
			
			?>
			<div class="wpb_wrapper termss">
				<?php if($article->oid == '147084420'){ ?>
					<h1><?php echo $articlesHeading[0]->headline; ?></h1>
				<?php }else{ ?>
					<h3><?php echo $articlesHeading[0]->headline; ?></h3>
				<?php } ?>			
				<p><?php echo ($articlesText[0]->text); ?></p>
			</div>
		<?php } ?>
	</div>
</div>
<?php get_footer();  ?>