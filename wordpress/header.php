<?php
/**
 * Header file for the Twenty Twenty WordPress default theme.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package WordPress
 * @subpackage Twenty_Twenty
 * @since 1.0.0
 */

?>
<!DOCTYPE html>
<html class="no-js" <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=yes"/>
    <link rel="profile" href="https://gmpg.org/xfn/11">
    <!--link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/fontawesome.min.css" /-->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" />
    <?php
		$longTitle = $keywords = $description = $Title = '';
		$trimRequestUri = trim($_SERVER['REQUEST_URI'],'/');
		$expTrimRequestUri = explode('/',$trimRequestUri);
        $urlCategory  = end($expTrimRequestUri);		
        $PostID = get_the_ID();
        if (is_single())
        {
			$Title = get_single_article($PostID);
			$TotalTags = get_single_article_tags($PostID);
			$description = $TotalTags['description'];
			$keywords = $TotalTags['keywords'];
			$longTitle = $TotalTags['link_description'];
        }
        else
        {
            $categoryData = get_term_by('slug', $urlCategory, 'article_category');
			if(!empty($categoryData->term_id)){
				$Title = get_term_meta($categoryData->term_id, 'cat_site_title',  true);
				$description = $categoryData->description;
				$keywords = "Yachtcharter, Bootscharter, Charter, ".$categoryData->name.", Yachtcharter ".$categoryData->name.", Marinas ".$categoryData->name.", Yachten";
			}else{
				$keywords = $Title = $description = '';
			}
        }
		
		if(empty($Title)){
			if(is_front_page()){
				$Title = 'Yachtcharter Preisvergleich - bis zu 60% Rabatt1';
			}else{
				$Title = get_bloginfo( 'name' ).' '.get_the_title();
			}
			
			if(!is_front_page()){
				$get_meta_values = get_meta_values($PostID);
				$keywords = !empty($get_meta_values['meta_keyword'])?$get_meta_values['meta_keyword']:'';
				$longTitle = !empty($get_meta_values['meta_description'])?$get_meta_values['meta_description']:'';
				$Title = !empty($get_meta_values['meta_title'])?$get_meta_values['meta_title']:$Title;
			}			
		}
		
		
		if($PostID == 22079){
			$REQUEST_URI = explode('/',trim($_SERVER['REDIRECT_URL'],'/'));
			$Title = "Yachtcharter Gro&szlig;britannien ".ucwords(str_ireplace('-',' ',$REQUEST_URI[3])).' '.ucwords(str_ireplace('-',' ',$REQUEST_URI[1])).' '.ucwords(str_ireplace('-',' ',$REQUEST_URI[2]));
			
			$description = ucwords(str_ireplace('-',' ',@$REQUEST_URI[5]))." - Charter ".ucwords(str_ireplace('-',' ',@$REQUEST_URI[4]))." Yachtcharter Gro&szlig; britannien: Chartern Sie unsere ".ucwords(str_ireplace('-',' ',$REQUEST_URI[2]))." ish ab ".ucwords(str_ireplace('-',' ',$REQUEST_URI[3]))." Marina bereits";
			
			$keywords = "Yachtcharter, Großbritannien, Kleine Antillen, Yacht Details, Preis , ".ucwords(str_ireplace('-',' ',$REQUEST_URI[3]));
		}
		
        if(!empty($Title)) echo '<title>'.ucwords($Title).'</title>';	
		
    ?>
	
	<meta name="description" content="<?php echo !empty($longTitle)?@$longTitle:$Title;  echo @$description; ?>" />
	<meta name="keywords" content="<?php echo !empty($keywords)?$keywords:"Yachtcharter, Charter, Bootscharter, Yacht suchen, Reviere"; ?>" />
	<meta name="page-topic" content="Euroboats Yachtcharter GmbH" />
	
    <?php wp_head(); ?>
	
	<!------- google Verification code start------->
	<meta name="verify-v1" content="FsxwZ25IGlmjYWIEZkYo5xJhzOl9WTYcP/QRCD4QRSc=" />
	<meta name="verify-v1" content="FuWf7jNHX7BWoUah9MluSzBeOW8WQPmeKl9xt6cpi4w=" />
	<!------- google Verification code end------->
	
	
	<!------- google gtm start------->
	<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
	new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
	j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
	'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
	})(window,document,'script','dataLayer','GTM-584JJLQ');</script>
	<!------- google gtm start------->
	<script id="Cookiebot" src="https://consent.cookiebot.com/uc.js" data-cbid="4e0a0599-23d0-4973-8ca9-2190804c77ec" data-blockingmode="auto" type="text/javascript"></script>
</head>

<body <?php body_class(); ?>>
	<!------- google gtm start------->
	<noscript>
		<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-584JJLQ" height="0" width="0" style="display:none;visibility:hidden"></iframe>
	</noscript>
	<!------- google gtm start------->
	<?php 	
	if($PostID == 431 || $PostID == 12447){ ?>
		<div id="loader" rel="" >
			<svg width="200" height="200" viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg" stroke="green" aria-label="audio-loading"><g fill="none" fill-rule="evenodd" transform="translate(1 1)" stroke-width="2"><circle cx="22" cy="22" r="9.09795" stroke-opacity="0"><animate attributeName="r" begin="1.5s" dur="3s" values="6;22" calcMode="linear" repeatCount="indefinite"></animate><animate attributeName="stroke-opacity" begin="1.5s" dur="3s" values="1;0" calcMode="linear" repeatCount="indefinite"></animate><animate attributeName="stroke-width" begin="1.5s" dur="3s" values="2;0" calcMode="linear" repeatCount="indefinite"></animate></circle><circle cx="22" cy="22" r="17.0979" stroke-opacity="0"><animate attributeName="r" begin="3s" dur="3s" values="6;22" calcMode="linear" repeatCount="indefinite"></animate><animate attributeName="strokeOpacity" begin="3s" dur="3s" values="1;0" calcMode="linear" repeatCount="indefinite"></animate><animate attributeName="strokeWidth" begin="3s" dur="3s" values="2;0" calcMode="linear" repeatCount="indefinite"></animate></circle><circle cx="22" cy="22" r="2.32346"><animate attributeName="r" begin="0s" dur="1.5s" values="6;1;2;3;4;5;6" calcMode="linear" repeatCount="indefinite"></animate></circle></g></svg>
		</div>
	<?php } ?>
    <?php  echo do_shortcode('[reset-password]'); ?>
    <?php  echo do_shortcode('[news-letter]'); ?>
    <?php  echo do_shortcode('[new-password]'); ?>
    <?php  echo do_shortcode('[log-in]'); ?>
    <?php  echo do_shortcode('[sign-up]'); ?>

    <div>
        <?php  echo do_shortcode('[how-it-works]'); ?>

        <div class="nav-fixed-flag">
            <?php  include_once ('include/navbar.php')?>
        </div>
		
		<?php
            $PageID     = get_the_ID();
            $HeaderType =  get_post_meta($PageID, "select_header_type", true);		
			
            if($HeaderType == 'without-search-filter')
            {
                echo '<style>.Remove_search_filter{display: none;}</style>';
                echo '<script>
                        jQuery(document).ready(function(){
                            jQuery("body").addClass("NavFixes");
                        });
                    </script> ' ;   
				$searchBar = 'no-searchBar';
            }else{
				$searchBar = 'has-searchBar';
			} 
			
            if(!is_front_page())
            {
    		  echo '<div class="animated-block '.$searchBar.'">';    			
                $GlobalFilterNav   = get_post( 418 );
                echo $output =  apply_filters( 'the_content', $GlobalFilterNav->post_content );
    		  echo '</div>';
		    }
        ?>
		
        <!----------------------- mobile HTML start here -------------------------------------------->

        <header class="mobHeader">
            <div class="container container_header">
                <div class="header_row header_row__1">
                    <div class="logo header_logo">
                        <a href="<?php echo get_site_url(); ?>">
                            <img alt="cropped logo" src="<?php echo get_site_url(); ?>/wp-content/uploads/2019/12/cropped-logo-e1576141562489-2.png" class="custom-logo" alt="WP" width="180" height="85">
                        </a>
                        <div class="language dropdown-hover mobile-in ">
							<span class="nav-round" style="line-height:0;">
								<img alt='Germany' class="lan" src="<?php echo LIVE_IMG_URL; ?>/107541756-Germany-germany.png.jpg">
							</span>
							<span class="lan-2">DE</span>
							<ul class="nav-dropdown nav-dropdown_flags mobile_flags">
								<span class="little-triangle little-triangle_flags"></span>                                    
								<a>
									<li class="lang-li "><span class="lang-img"><img name="DE" alt="DE" src="<?php echo LIVE_IMG_URL; ?>/107541756-Germany-germany.png.jpg"><span class="lang-name">Deutschland</span>
									</span>
									</li>
								</a>
							</ul>
						</div>
                    </div>
				</div>
			</div>
                <!--Header navigation-->
                <div class="header_row">
                    <div class="header_col header_col__1">
                        <button class="main-menu_button main-menu_button__bg-red">
                            <span class="hamburger__top"></span>
                            <span class="hamburger__mid"></span>
                            <span class="hamburger__bot"></span>
                        </button>
                    </div>
                    <div class="header_col header_col__2">
                        <button class="main-menu_button main-menu_button__bg-blue" id="searchs">
                            <i class="icon-search"></i>
                        </button>
                    </div>
                    <?php if(is_user_logged_in()){ ?>
                    <div class="header_col header_col__3">
                        <button class="main-menu_button main-menu_button__bg-blue noPageFound " >
                            <i class="icon-user"></i>
                        </button>
                    </div>
                    <?php }else{ ?>
                    <div class="header_col header_col__3">
                        <button class="main-menu_button main-menu_button__bg-blue noPageFound " >
                            <i class="icon-user"></i>
                        </button>
                    </div>
                    <?php }?>

                    <div class="header_col header_col__4">
                        <button class="main-menu_button main-menu_button__bg-red calls noPageFound ">
                            <i class="icon-call"></i>
                        </button>
                    </div>
                </div>

                <!--Include main menu-->
                <!--Main menu-->
                <div class="main-menu">
                    <div class="container">
                        <div class="call-us">
                            <span class="main-txt txtReg txtwhite call-us_txt">Call Us</span>
                            <span class="main-txt mtxt txtwhite">0800 0704700</span>
                        </div>
                        <nav>
                            <?php echo wp_nav_menu( array( 'theme_location' => 'mobile-menu' ,'container' => false ) ); ?>
                        </nav>
                        <div class="menuBtm">
                            <a class="linkBtm main-txt txtReg mtxt txtwhite sign-up_link">
                                Sign Up
                            </a>
                            <span class="main-menu_dash"></span>
                            <a class="linkBtm main-txt txtReg mtxt txtwhite">
                                Log In
                            </a>
                        </div>
                    </div>
                </div>


                <!--Main Mobile Profile menu-->
                <div class="main-menu mobile-profile-menu">
                    <div class="container">
                        <nav>
                            <?php //echo wp_nav_menu( array( 'theme_location' => 'mobile-profile-menu' ,'container' => false ) ); ?>
                           
                            
                        </nav>
                    </div>
                </div>
                
                
                <div class="UserDrop">
                    <div class="user-menu" id="user-menu">
						<div class="container">
							<nav>
								<?php echo wp_nav_menu( array( 'theme_location' => 'mobile-profile-menu' ,'container' => false ) ); ?>
								
								<a class="user-menu_link user-menu_link__small" href="<?php echo wp_logout_url(); ?>">Logout
								</a>
								<a id="user-menu_close" class="user-menu_link user-menu_link__small" >
									Close
									<svg class="svg-inline--fa fa-times fa-w-12 fa-lg ml__1 middle" aria-hidden="true" data-prefix="far" data-icon="times" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" data-fa-i2svg=""><path fill="currentColor" d="M231.6 256l130.1-130.1c4.7-4.7 4.7-12.3 0-17l-22.6-22.6c-4.7-4.7-12.3-4.7-17 0L192 216.4 61.9 86.3c-4.7-4.7-12.3-4.7-17 0l-22.6 22.6c-4.7 4.7-4.7 12.3 0 17L152.4 256 22.3 386.1c-4.7 4.7-4.7 12.3 0 17l22.6 22.6c4.7 4.7 12.3 4.7 17 0L192 295.6l130.1 130.1c4.7 4.7 12.3 4.7 17 0l22.6-22.6c4.7-4.7 4.7-12.3 0-17L231.6 256z"></path></svg>
								</a>
							</nav>
						</div>
					</div>
                </div>                
            </div>
            <div class="wrappers">
                <!--'Log In' block-->
                <div class="container pop-up  container-inner loginspopup">
                    <form method="post" id="Login_Form_Popup_Mobile">
                        <div class="inners">
                            <a class="main-txt txtwhite pop-up_close"><i class="icon-close"></i></a>
                            <p class="main-txt mtxt pop-up_head">Log in</p>
                        </div>
                        <div class="inners">

                            <input class="form_input pop-up_input" type="email" name="user_login" placeholder="Email address*" required />

                            <input class="form_input pop-up_input" type="password" name="user_password" placeholder="Password*" required />
                            <div class="mt-1">
                                <input id="remember_me" class="checkbox" type="checkbox" title="Remember me" value="1" name='remember'>
                                <label class="checkbox_txt" for="remember_me">Remember me</label>

                                <a class="main-txt  mainXs txtReg forgot-pass" onclick="$('.overlay#log-in').trigger('hide');return false;" data-overlay-trigger="reset-password">
                                    Forgot password?
                                </a>
                                <div class="clearfix"></div>
                            </div>
                        </div>

                        <div class="line mt-1"></div>

                        <div class="inners">

                            <input type="submit" class="button pop-up_button" value="Log in">
                            <div class='errorLogin error'></div>

                        </div>
                        <div class="social_login_desktop social_login_mobile">
                            <div class="inners">
                            <?php echo do_shortcode('[nextend_social_login]');?>
                            </div>
                        </div>
                        <div class="line mb__2"></div>

                        <div class="inners">
                            <span class="main-txt txtReg  mainXs mr-1">Dont have an account?</span>
                            <a class="button btntrans main-menu_button btnLittle sign-up_link" id="signs">Sign Up</a>
                        </div>
                    </form>
                </div>
                <!--'Sign Up' block-->
                <div class="container container-inner pop-up signspopup  sign-up">
                    <form method="post" id="form_sign-up">
                        <div class="inners">
                            <a class="main-txt txtwhite pop-up_close "><i class="icon-close"></i></a>
                            <p class="main-txt mtxt pop-up_head mb-9">Sign Up</p>
                        </div>


                        <div class="social_login_desktop social_login_mobile">
                            <div class="inners">
                            <?php echo do_shortcode('[nextend_social_login]');?>
                            </div>
                        </div>

                        <div class="line mt-1 mb-1 line-js"></div>

                        <div class="inners">

                            <input class="form_input pop-up_input" type="email" name="m_mail" placeholder="Email address*" required />


                            <input class="form_input pop-up_input" type="text" name="m_fname" placeholder="First name*" required />

                            <input class="form_input pop-up_input" type="text" name="m_lastname" placeholder="Last name*" required />

                            <input class="form_input pop-up_input" type="tel" name="m_phone" placeholder="Phone*" required />

                            <select name="m_country" class="form_input pop-up_input sign_up_country" required>
                                <?php
									$countryList = $wpdb->get_results("select * from ".$wpdb->prefix."country where 1");
									echo "<option value=''> Select Country</option>";
									foreach($countryList as $country){
										echo "<option value='".$country->country_id."' >".$country->name."</option>";
									}
								?>
                            </select>

                            <select class="form_input pop-up_input sign_up_state" name="m_state" required>
                                <option value="0">Select State</option>
                            </select>
                            <input class="form_input pop-up_input" type="text" name="m_city" placeholder="City*" required />


                            <input class="form_input pop-up_input" type="text" name="m_street" placeholder="Street and number*" required />

                            <input class="form_input pop-up_input" type="text" name="m_code" placeholder="Post code*" required />


                            <div class="rel">
                                <input class="form_input pop-up_input" type="password" name="m_password" id="m_password" placeholder="Create a password*" required />

                                <input class="password-show" type="checkbox" value="false">

                                <label for="sign-up_password-show__1" class="password-show_label">
                                    <img src="<?php echo site_url(); ?>/wp-content/uploads/2019/12/eye.png" alt="Sign Up">
                                </label>
                            </div>

                            <div class="rel">
                                <input class="form_input" type="password" name="m_confirm_password" placeholder="Confirm a password*" required />

                                <input class="password-show" type="checkbox" value="false">

                                <label class="password-show_label">
                                    <img src="<?php echo site_url(); ?>/wp-content/uploads/2019/12/eye.png" alt="View">
                                </label>
                            </div>

                            <input class="form_input form_date pop-up_input dateofbirth" type="text" name="m_dateofbirth" placeholder="Date of birth*" required />
                            <?php wp_nonce_field( 'user_profile_submit', 'User_profile' ); ?>


                            <p class="signTxt">
                                To sign up, you must be 18 or older. Other people won’t see your birthday.
                            </p>
                            <div class="center termms">
                                <input id="privacy-policy" class="checkbox" type="checkbox" name="privacy-policy" required>
                                <label class="checkbox_txt checkbox_txt__m" for="privacy-policy">
                                    Yes, I accept the
                                    <a class="main-txt main-menu_button txtReg main-txt__bright-blue main-txt__underline" id="privacies">
                                        privacy policy.
                                    </a>
                                </label>
                            </div>

                            <input type="submit" id="sign-up_submit" class="button pop-up_button mt-1 mb-1" value="Sign Up">
                        </div>

                        <div class='errorRegister error'></div>
                        <div class="line"></div>

                        <div class="line mb__2"></div>

                        <div class="inners">
                            <span class="main-txt txtReg mainXs mr-1">Dont have an account?</span>
                            <a class="button btntrans main-menu_button btnLittle log-in_link__js" id="logins">Log In</a>
                        </div>
                    </form>
                </div>
             
			</div>

        </header>
        <div class="shadow"></div>
        <script>
            $(function() {

                $('.main-menu_button:not(.calls)').on('click', function() {
                    var $thisId = $(this).attr('id')
                    $('.' + $thisId + 'popup').addClass('active');
                    $('.shadow').addClass('active');
                    $(this).closest('.pop-up').removeClass('active');

                });
                $('.pop-up_close').on('click', function() {
                    $(this).closest('.pop-up').removeClass('active');
                    $('.shadow').removeClass('active');

                });

                $('.pop-up_privacy').on('click', function() {
                    $(this).closest('.popup_privacy').removeClass('active');
                    $('.signspopup').addClass('active');
                    $('.shadow').addClass('active');
                    $("input[name=privacy-policy]").prop("checked", true);
                    $('html, body').animate({
                        scrollTop: $("#sign-up_submit").offset().top
                    }, 2000);
                });
				
				$(document).on('click','.desktop-pop-up_privacy',function(){
					$(this).closest('.popup_privacy').removeClass('active');
                    $('.overlay#sign-up').trigger('show');
                    $('.shadow').addClass('active');
                    $("input[name=privacy]").prop("checked", true);					
					$('.mobHeader').css('display','none');
				})


                $('.password-show_label').click(function() {
                    var pass = $(this).parent().find('.form_input');
                    if (pass.attr('type') == "password") {
                        pass.attr('type', 'text');
                    } else {
                        pass.attr('type', 'password');
                    }
                });
                $('.desktop-eye img').click(function() {
                    var pass = $(this).parent().parent().find('.form_input');
                    if (pass.attr('type') == "password") {
                        pass.attr('type', 'text');
                    } else {
                        pass.attr('type', 'password');
                    }
                });

                $('.header_col__1 > .main-menu_button').on('click', function() {
                    $(this).toggleClass('hamburger__opened');
                    $(this).parents('.header_row').next('.main-menu').toggleClass('active');
                    $('.shadow').removeClass('active');
                });
				
				$('#afterLogin').click(function(){
					$('#user-menu').addClass('active');
					$('.shadow').removeClass('active');
				});	
				
				$('#user-menu_close').click(function(){
					$('#user-menu').removeClass('active');
				});	
				
				$('#popupPrivacy').click(function(){
					$('.privaciespopup').addClass('active');
					$('.overlay#sign-up').trigger('hide');
					$('.shadow').addClass('active');
					$('.mobHeader').css('display','block');
					$('.pop-up_close').removeClass('pop-up_privacy').addClass('desktop-pop-up_privacy');
					$('.privacy_button').removeClass('pop-up_privacy').addClass('desktop-pop-up_privacy');
				});
                
                $('.loginConfirmPopup').find('#logins').click(function()
                 {
                    window.scrollTo(0, 0);
                });

            });  
        </script>
        