<?php
add_action( 'admin_notices', 'ecs_add_post_notice' );
function ecs_add_post_notice() {
	global $post;
	if( isset( $post->post_name ) && ( $post->post_name == 'edit-profile' ) ) {
	  /* Add a notice to the edit page */
		add_action( 'edit_form_after_title', 'ecs_add_page_notice', 1 );
		/* Remove the WYSIWYG editor */
		remove_post_type_support( 'page', 'editor' );
	}	
}
function ecs_add_page_notice() {
	echo '<div class="notice notice-warning inline"><p>' . __( 'You are currently editing the profile edit page. Do not edit the title or slug of this page!', 'textdomain' ) . '</p></div>';
}
?>