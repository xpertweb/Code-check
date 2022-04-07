<?php
/**
 * The template for displaying single posts and pages.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package WordPress
 * @subpackage Twenty_Twenty
 * @since 1.0.0
 */

get_header();

?>
<!--<div class="breadcrumb"><?php //get_breadcrumb(); ?></div>-->
<main id="site-content" role="main">

	<?php

	if ( have_posts() ) {

		while ( have_posts() ) {
			the_post();
			global $post ;
			$PostType = $post->post_type;

			if($PostType == 'articles')
			{
				get_template_part( 'template-parts/article_single', get_post_type() );
			}
			else
			{
				get_template_part( 'template-parts/content', get_post_type() );
			}


			
		}
	}

	?>

</main><!-- #site-content -->

<?php get_template_part( 'template-parts/footer-menus-widgets' ); ?>

<?php get_footer(); ?>
