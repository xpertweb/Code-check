<?php

include_once('class-shortcode.php');
include_once('class-admin-ajax.php');
include_once('class-front-ajax.php');
include_once('editprofile.php');
include_once('include/function.php');
include_once('include/searchDatabaseFunction.php');
new SearchForm();
new AjaxForm();
new AdminForm();

remove_action( 'wp_head', '_wp_render_title_tag', 1 );

add_action( 'wp_enqueue_scripts', 'my_theme_enqueue_styles' );
function my_theme_enqueue_styles() {
    wp_enqueue_style( 'parent-style', get_template_directory_uri() . '/style.css' ); 
}
function register_my_menu() {
	register_nav_menu('red-menu',__( 'Red Top Menu' ));
	register_nav_menu('mobile-menu',__( 'Mobile Menu' ));
	register_nav_menu('mobile-profile-menu',__( 'Mobile Profile Menu' ));	
	
	global $wpdbpro;
	$wpdbpro = new wpdb('fmi0m1i9ddt3', 'g77#18dlsM!YObza5qUL%hVxLf', 'db4984', '192.168.11.102');
	$wpdbpro->show_errors();
	
	global $wpdbadmin;
	$wpdbadmin = new wpdb('fmi0m1i9ddt3', 'g77#18dlsM!YObza5qUL%hVxLf', 'admin', '192.168.11.102');
	$wpdbpro->show_errors();
	

}
add_action( 'init', 'register_my_menu' );


// function to add theme option
function theme_option_yatch()
{
	add_menu_page(__('Theme Option'), __('Theme Option'), 'edit_themes', 'theme_option_settings', 'theme_option_yatch_settings', '', 8); 
}
add_action('admin_menu', 'theme_option_yatch');

 
function theme_option_yatch_settings()
{
	wp_enqueue_style('themeOption',get_stylesheet_directory_uri().'/template/admin/option.css',array());
	wp_enqueue_style('bootstrap_min','https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css',array());
	
	include('template/admin/theme-option-data.php');
}

function get_breadcrumb() {
    echo '<a href="'.home_url().'" rel="nofollow">Home</a>';
    if (is_category() || is_single()) {
        echo "&nbsp;&nbsp;&#187;&nbsp;&nbsp;";
        the_category(' &bull; ');
            if (is_single()) {
                echo " &nbsp;&nbsp;&#187;&nbsp;&nbsp; ";
                the_title();
            }
    } elseif (is_page()) {
        echo "&nbsp;&nbsp;&#187;&nbsp;&nbsp;";
        echo the_title();
    } elseif (is_search()) {
        echo "&nbsp;&nbsp;&#187;&nbsp;&nbsp;Search Results for... ";
        echo '"<em>';
        echo the_search_query();
        echo '</em>"';
    }
}



/*********** Remove Taxonomy Slug start *************/
function remove_tax_slug_link( $link, $term, $taxonomy ) {
    if ( $taxonomy !== 'article_category' )
        return $link;
 
    return str_replace( 'article_category/', '', $link );
}
add_filter( 'term_link', 'remove_tax_slug_link', 10, 3 );
 
function custom_tax_rewrite_rule() {

	// echo get_the_ID();
	
    $cats = get_terms(
		'article_category', array(
			'hide_empty' => false,
		)
    );
    if(sizeof($cats)){
        foreach($cats as $cat){
			
			$childCats = get_categories(array('taxonomy' => 'article_category', 'parent'=>$cat->term_id ));
			if(count($childCats) != 0){
				foreach($childCats as $childCat){
					add_rewrite_rule( $cat->slug.'/'.$childCat->slug.'/?$', 'index.php?article_category='.$cat->slug.'&page='.@$matches[1], 'top' );
					// echo get_site_url().'/'.$cat->slug.'/'.$childCat->slug.'<br>';
				}
			}
			add_rewrite_rule( $cat->slug.'/?$', 'index.php?article_category='.$cat->slug.'&page='.@$matches[1], 'top' );
			// echo get_site_url().'/'.$cat->slug.'<br>';
		}
	}
	
	add_rewrite_rule('^Werft/([^/]*)/([^/]*)/([^/]*)/?','index.php?page_id=533&job_title='.@$matches[1],'top');
	
	add_rewrite_rule('^q/([^/]*)/?','index.php?page_id=20549&job_title='.@$matches[1],'top');
	add_rewrite_rule('^voting/([^/]*)/?','index.php?page_id=20560&token='.@$matches[1],'top');
	add_rewrite_rule('^Voting/([^/]*)/?','index.php?page_id=20560&token='.@$matches[1],'top');
	add_rewrite_rule('^([^/]*)/([^/]*)/([^/]*)/([^/]*)/([^/]*)/([^/]*)/?','index.php?page_id=22079&yacht_id='.@$matches[1],'top');
	add_rewrite_rule('^([^/]*)/([^/]*)/([^/]*)/([^/]*)/([^/]*)/?','index.php?page_id=22079&yacht_id='.@$matches[1],'top');
	add_rewrite_rule('^([^/]*)/([^/]*)/([^/]*)/([^/]*)/?','index.php?page_id=22079&yacht_id='.@$matches[1],'top');
	
	add_rewrite_rule('^werft/Letter/([^/]*)/?','index.php?page_id=153985&job_title='.@$matches[1],'top');
	add_rewrite_rule('^werft/?','index.php?page_id=153985','top');
	
	add_rewrite_rule('^Werft/([^/]*)/?','index.php?page_id=153996&job_title='.@$matches[1],'top');
	
}
add_action('init', 'custom_tax_rewrite_rule', 10, 0);

/*********** Remove Taxonomy Slug end *************/







