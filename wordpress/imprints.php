 <?php
/* Template Name: imprints */ 
get_header();

global $wpdbpro;

$getArticle = $wpdbpro->get_results("select * from article where category_oid_fk = 146808312 ");

?>
 <div class="policy-class imprints">
 	<div class="max-width">
 		<div class="bread-crumbs">
 			<ul>
 				<li><a href="<?php echo get_site_url(); ?>">Home</a></li>
 				<li>→</li>
 				<li><a class="current-page" href="javascript:void(0)">Impressum </a></li>
 			</ul>
 		</div>
 		<div class="">
 			<h1>Impressum</h1>
 		</div>
		
 		<div class="row">
 			<div class="addresses">
			
			<?php 
			if($wpdbpro->num_rows > 0){
				
				$found = 0;
				
				foreach($getArticle as $article){
					
					$found++;					
					
					$componentHeading = $wpdbpro->get_results("select headline from component where type = 4 and article_oid_fk = ".$article->oid);
					
					$componentText = $wpdbpro->get_results("select text from component where type = 2 and article_oid_fk = ".$article->oid);
					
					?>
					<div class="col-lg-4">
						<div class="lists">
							<h2 class="list-head">
								<?php echo $componentHeading[0]->headline; ?>
							</h2>
							<div class="list-contents">
								<p><?php echo nl2br(($componentText[0]->text)); ?></p>
							</div>
						</div>
					</div>
					<?php 
					
					if($found%3 == 0){
						echo '</div><div class="addresses back-fades">';
					}
				}
			} ?>
 			
		</div>
 	</div>
 </div>

 <?php get_footer();  ?>