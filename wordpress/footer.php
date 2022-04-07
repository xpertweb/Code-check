<?php
/**
 * The template for displaying the footer
 *
 * Contains the opening of the #site-footer div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package WordPress
 * @subpackage Twenty_Twenty
 * @since 1.0.0
 */
global $wpdbpro;
?>
</div>
<footer>
	<div class="footer-blk2-blk2">
		<div class="max-width display-flex">
			<div class="footer-block-1">
			<?php 
            $theme_option_social_data = get_option('theme_option_social');
            $socialData = unserialize($theme_option_social_data);
         
            $theme_option_top_data = get_option('theme_option_top_data');
            $TopData = unserialize($theme_option_top_data);

            $custom_logo_id = get_theme_mod( 'custom_logo' );
            $image = wp_get_attachment_image_src( $custom_logo_id , 'full' );
            if(!empty($image))
            {
                $logo = $image[0];               
            }
            else
            {
                $logo = get_stylesheet_directory_uri()."assets/images/logo.png";
            }
            ?>
				<ul class="flex-ul">
					<li class=""><img alt='Logo' src="<?php echo $logo ; ?>"></li>
					<li class="footer-hide">
						<div class="label">Kontakt</div>
						<div class="footerContent"><span><img alt='phone' title='phone' src="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/phone.png"></span><span><a href="tel:<?php echo $TopData['phone'] ; ?>"><?php echo $TopData['phone']; ?></a></span></div>
					</li>
					<li class="footer-hide">
						<div class="label"> Email</div>
						<div class="footerContent"> <span><img alt='E-mail' title='E-mail' src="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/mail.png"></span>
							<span><a href="mailto:<?php echo $TopData['emails'] ; ?>"><?php echo $TopData['emails'] ; ?></a></span>
						</div>
					</li>
					<li>
						<div class="label footer-hide">Social Media</div>
						<div> 
                            <span><a target="_blank" alt='twitter' href="<?php echo $socialData['twitter'];?>"><img alt='twitter' src="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/twitter.png"></a></span>
                            <span><a target="_blank" alt='facebook' href="<?php echo $socialData['fb'];?>"><img alt='facebook' src="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/facebook.png"></a></span>
                            <span><a target="_blank" alt='instagram' href="<?php echo $socialData['insta'];?>"><img alt='instagram' src="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/instagram.png"></a></span>
                        </div>
					</li>
					<li class="footer-hide last-one">
						<div class="label">Newsletter</div>
						<div class="follow_us_form footerContent">
							<?php echo do_shortcode('[contact-form-7 id="177" title="Follow Us"]');?>
							<a class="newsletterPopup" style='display:none;' data-overlay-trigger="newsletterPopup" >Newsletter</a>
						</div> 
					</li>
				</ul>
			</div>

			<div class="footer-block-2">
				<div>
					<p>Segelreviere</p>
					<ul>
						<li><a href="<?php echo get_site_url(); ?>/yachtcharter-spanien/">> Spanien</a></li>
						<li><a href="<?php echo get_site_url(); ?>/yachtcharter-kroatien/">> Kroatien</a></li>
						<li><a href="<?php echo get_site_url(); ?>/yachtcharter-griechenland/">> Griechenland</a></li>
						<li><a href="<?php echo get_site_url(); ?>/yachtcharter-italien/sardinien/">> Sardinien</a></li>
						<li><a href="<?php echo get_site_url(); ?>/mallorca-menorca-spanien/">> Mallorca</a></li>
						<li><a href="<?php echo get_site_url(); ?>/yachtcharter-ostsee/">> Ostsee</a></li>
					</ul>
				</div>
				<div>
					<p>Ausgangshäfen</p>
					<ul>
						<li><a class="noPageFound" >> Split</a></li>
						<li><a class="noPageFound" >> Athens</a></li>
						<li><a class="noPageFound" >> Olbia</a></li>
						<li><a class="noPageFound" >> Marmaris</a></li>
						<li><a class="noPageFound" >> Mallorca</a></li>
						<li><a class="noPageFound" >> Palma de Malloro</a></li>
					</ul>
				</div>
				<div>
					<p>Katamarane</p>
					<ul>
						<li><a href="<?php echo get_site_url(); ?>/yachtcharter-griechenland/">> Katamaran Griechenland</a></li>
						<li><a href="<?php echo get_site_url(); ?>/yachtcharter-kroatien/">> Katamaran Kroatien</a></li>
						<li><a href="<?php echo get_site_url(); ?>/yachtcharter-karibik/">> Katamaran Karibik</a></li>
						<li><a href="<?php echo get_site_url(); ?>/mallorca-menorca-spanien/">> Katamaran Mallorca</a></li>
						<li><a href="<?php echo get_site_url(); ?>/yachtcharter-tuerkei/">> Katamaran Türkei</a></li>
						<li><a href="<?php echo get_site_url(); ?>/yachtcharter-seychellen/">> Katamaran Seychellen</a></li>
					</ul>
				</div>
				<div>
					<p>Werften</p>
					<ul>
						<li><a class="noPageFound" >> Hanse Yachten</a></li>
						<li><a class="noPageFound" >> Bavaria Yachten</a></li>
						<li><a class="noPageFound" >> Beneteau Yachten</a></li>
						<li><a class="noPageFound" >> Jeanneaus Yachten</a></li>
						<li><a class="noPageFound" >> Elan Yachten</a></li>
						<li><a class="noPageFound" >> Salona Yachten</a></li>
					</ul>
				</div>
				<div>
					<p>Motoryachten</p>
					<ul>
						<li><a href="<?php echo get_site_url(); ?>/yachtcharter-ostsee/">> Motoryacht Ostsee</a></li>
						<li><a href="<?php echo get_site_url(); ?>/yachtcharter-kroatien/">> Motoryacht Kroatien</a></li>
						<li><a href="<?php echo get_site_url(); ?>/yachtcharter-griechenland/">> Motoryacht Griechenland</a></li>
						<li><a href="<?php echo get_site_url(); ?>/yachtcharter-italien/sardinien/">> Motoryacht Sardinien</a></li>
						<li><a href="<?php echo get_site_url(); ?>/mallorca-menorca-spanien/">> Motoryacht Mallorca</a></li>
						<li><a href="<?php echo get_site_url(); ?>/yachtcharter-karibik/">> Motoryacht Karibik</a></li>
					</ul>
				</div>
				<div>
					<p>Seewetter</p>
					<ul>
						<li><a class="noPageFound" >> Seewetter</a></li>
						<li><a class="noPageFound" >> Seewetter Croatia</a></li>
						<li><a class="noPageFound" >> Seewetter Turkey</a></li>
						<li><a class="noPageFound" >> Seewetter Mallorca</a></li>
						<li><a class="noPageFound" >> Motoryachts Mallorca</a></li>
						<li><a class="noPageFound" >> Seewetter Cyclades</a></li>
					</ul>
				</div>

			</div>
		</div>
	</div>

	<div class="footer-block-3">
		<div class="max-width">
			<div class="copyrightPart"><div class="left-block"><a target='_blank' href="<?php echo get_site_url(); ?>/impressum.html">Impressum</a><a target='_blank' href="<?php echo get_site_url(); ?>/privacy-policy">Datenschutzhinweise</a><a target='_blank' href="<?php echo get_site_url(); ?>/general-terms">AGB</a></div><p><?php echo $TopData['footer_copyright'];?></p></div>
		</div>
	</div>

	<div class="footer-block-4">
		<div class="max-width">
			<p><?php				
				$footerText = $wpdbpro->get_results("SELECT * FROM `component` WHERE `component`.`article_oid_fk` = 144541233 AND `component`.`lang` = 1 AND `component`.`text` != '' ");			
				echo @$footerText[0]->text;
			?></p>
		</div>
	</div>
</footer>

<!----------Footer popup Newsletter--------------->
<?php 
$PagesID = get_the_ID();
if(empty($_COOKIE['email']) &&  $PagesID == 8){
?>
	<div class="overlay" id="newsletterPopup" style="visibility: hidden;">
		<div class="max-width">
		
			<div class="modal" style="">
				<p class="nws_crs_ppup">
					<span onclick="$('.overlay#newsletterPopup').trigger('hide');localStorage.setItem('popup', '1'); return false;" class="close">
						<img alt='close' draggable="false" role="img" class="emoji" alt="✖" src="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/Button-X.png">
					</span>
				</p>        
				<?php
					if(($_COOKIE['email'])){
						if($_COOKIE['title']=='1'){					
							$sts= 'Frau';
						}else if($_COOKIE['title']=='2'){
							$sts= 'Herr';
						}else{					
							$sts= 'Firma';
						}
							
						echo '<div class="news_popup_cntnt small">
						<div class="header_nws_popup">
						<div class="nws_icon">
							<img alt="News" src="'.get_stylesheet_directory_uri().'/assets/images/news_icon.png">
						</div>
						<h2>50 Euro Gutschein für Deine nächste Charter</h2>
						
						</div>';	
						echo "<h3 class='popup-headinding'>Lieber ".$sts." <b>".$_COOKIE['firstname']." ".$_COOKIE['lastname']."</b></h3> 
						<p class='popup-peragraph'>Ihre Newsletter Anmeldung wurde erfolgreich gespeichert. Sie erhalten umgehend eine E-Mail mit einem Bestätigungslink an folgende Adresse: <a href='mailto:".$_COOKIE['email']."'>".$_COOKIE['email'].".</a></p> 
						<p class='popup-peragraph bold_nws_ft'>Das Team von Yachtcharterfinder.com</p>
						<hr class='nws_thnk_cls_brdr'>
						<div class='nws_thnk_cls_btn'><button class='close_nws_btn'>Shlieben</button></div>
						";	
						
					
					}else{	
					?>
					<div class="news_popup_cntnt">
						<div class="header_nws_popup">
							<div class="nws_icon">
								<img alt="News" src="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/news_icon.png">
							</div>
							<h2>50 Euro Gutschein für Deine nächste Charter</h2>
							<p>Die besten Angebote und aktuellsten Nachrichten erhälst Du über unseren Newsletter. Und zusätzlich einen Chartergutschein über 50 Eur, sofern Du ein neuer Kunde bist.</p>
						</div>
						<div style="display:none" id="newslatterloader" class="newslatterloader" rel="">
							<img alt='Lader' src="<?php echo get_site_url(); ?>/wp-content/themes/twentytwenty-child/assets/images/loader.svg">
						</div>
						<div class="NewsMessage" style='display:none;'></div>
						<form  method="post" id="newsletter">
							<input type="hidden" name="action" value="newsLetter">					
							<div class="news_popup_form">
								<div class="formgroup_row d-flex">
									<div class="form_group form_half">
										<label>Anrede*</label>
										<div class="npf_select">
											<select id="title" name="title" size="1" style="" class="TitleSelectUser ">
												<option value="1">Frau</option>
												<option value="2">Herr</option>
												<option value="3">Firma</option>
											</select>
										</div>
									</div>
									<div class="form_group form_half">
										<label>Land</label>
										<div class="npf_select">
										<?php									
											global $wpdbpro;
											$results = $wpdbpro->get_results( "SELECT * FROM `country`");
											echo '<select name="language"  class="CountrySelectUser">';
											foreach($results as $value){
												echo '<option value="'.$value->oid.'">'.$value->name_de.'</option>';
											}	
											echo'</select>';
										?>
										</div>
									</div>
								</div>
								<div class="formgroup_row d-flex">
									<div class="form_group form_half">
										<label>Vorname*</label>
										<input type="text" name="firstname" class="text-input " value="">
									</div>
									<div class="form_group form_half">
										<label>Nachname*</label>
										<input type="text" name="lastname" class="text-input " value="">
									</div>
								</div>
								<div class="formgroup_row d-flex">
									<div class="form_group form_half">
										<label>Telefon</label>
										<input type="text" name="telefon" class="text-input " value="">
									</div>
									<div class="form_group form_half">
										<label>E-Mail*</label>
										<input type="text" name="email" class="text-input " value="">
									</div>
								</div>							
								<div class="formgroup_row b_top_nws">
									<div class="form_group">
										<p>Du hast die Möglichkeit, den Newsletter jederzeit abzubestellen. Weitere Informationen findest Du in den <a target="_blank" href="<?php echo get_site_url(); ?>/privacy-policy" >Datenschutzinformationen</a>.</p>
									</div>
								</div>
								<div class="formgroup_row">
									<div class="form_group submit_btn">
									   <button onclick="$('.overlay#newsletterPopup').trigger('hide');localStorage.setItem('popup', '1'); return false;"  class="close_nws_btn">Schließen</button>
										<button class="sbmt_nws_btn">Anmelden</button>
									</div>
								</div>
							</div>
						</form>
					</div>	
					<?php } ?>
				</div>
			</div>
		</div>
	</div>

	<script>	
		$(document).on('click','.close_nws_btn', function() {
			$('.overlay#newsletterPopup').trigger('hide');
			localStorage.setItem('popup', '1'); 
			return false;
		});
		$(window).scroll(function() {			
			var popup =  localStorage.getItem('popup');
			if(popup != '1' || popup.length == 0){
				setTimeout(function(){ $('.newsletterPopup').trigger('click'); }, 2000);
			}
		});
	</script>
<?php
}
wp_footer(); ?>

<script>
	$(document).ready(function() {

		$("body:not(.page-template-search) .red-navbar").hover(function() {
			$('.search-fixed').css('z-index', '999');
		}, function() {
			$('.search-fixed').css('z-index', '99999');
		});


		if (navigator.userAgent.indexOf('Mac') > 0)
		{
			$('body').addClass('mac-os');
		}

		$('.tile-view,.list-view').on('click', function(e) {
			$('.view-icon').removeClass('active-view');
			if ($(this).hasClass('tile-view')) {
				$(this).find('.view-icon').addClass('active-view');
				$('.flex-custom').attr('id', 'list')
			}
			if ($(this).hasClass('list-view')) {
				$(this).find('.view-icon').addClass('active-view');
				$('.flex-custom').attr('id', '')
			}
			event.preventDefault(e);
		});


		// Iterate over each select element	
		$(".slides").slidesjs({
			width: 940,
			height: 528
		});

		//  animates searchbar
		$('.animated-block').css({
			'min-height': $('.animated-block').outerHeight()
		});

		var height = $('.animated-block').css('height');
		var lastScrollTop = 0;
		$(window).scroll(function() {
			
			if($(".animated-block").length == 0) {
				var block = 360;
			}else{
				var block = $('.animated-block').offset().top;
			}
			
			if ($(this).scrollTop() > lastScrollTop) {
				
				if ($(this).scrollTop() > block) {
					if ($('*').hasClass('rotated-arrow')) {
						$('.extended-click img').removeClass('rotated-arrow');
						$('.refined-search-block').toggle();
					}
					$('.red-navbar').addClass('red-fixed');
					$('.searchss').addClass('top-margin');
				}
			} else {
				if ($(this).scrollTop() < block) {
					$('.red-navbar').removeClass('red-fixed');
					$('.searchss').removeClass('top-margin');
				}
			}
			lastScrollTop = $(this).scrollTop();
		});

		//common

		$('.drop-down-1 li').hover(function() {
			$('.drop-down-1 ul li').removeClass('drop-arrow-red');
			$(this).addClass('drop-arrow-red');
			var index = $(this).index();
			var id = $('.drop-down-2 ul ').eq(index).find('.drop-arrow-red').find('a').attr('class');
			$('.drop-down-2 ul').addClass('none-important');
			$('.drop-down-2 ul ').eq(index).removeClass('none-important');
			$('.drop-down-3-block').addClass('none-important');
			$('.drop-down-3 .' + id).removeClass('none-important');
		});

		$('.drop-down-2 li').hover(function() {
			$(this).parent().find('li').removeClass('drop-arrow-red');
			$(this).addClass('drop-arrow-red');
			var id = $(this).find('a').attr('class');
			$('.drop-down-3-block').addClass('none-important');
			$('.drop-down-3 .' + id).removeClass('none-important');
		});


		$('.white-line,.sailing-drop-down').hover(function() {
			$('.hover').css({'display': 'block'});
		}, function() {
			$('.hover').css({'display': 'none'});
		});

		$('.red-navbar ul li:nth-of-type(2)').hover(function() {

		});

		$('.overlay').click(function(e) {
			if (!$(e.target).closest('.modal').length) {
				$('.overlay').trigger('hide');
			}
		});

		$('.extended-click').click(function() {
			if (!$(this).find('img').hasClass('rotated-arrow'))
				$(this).find('img').addClass('rotated-arrow');
			else
				$(this).find('img').removeClass('rotated-arrow');
		})

		//rednav
		$('body .nav-dropdown li').on('click', function() {
			if ($(this).hasClass('currency-li')) {
				$('.currency-li').removeClass('red-bird');
				$(this).addClass('red-bird')
				$('.cur').attr('src', $(this).find('img').attr('src'));
				$('.cur-2').html($(this).find('img').attr('name'));;
			}
			if ($(this).hasClass('lang-li')) {
				$('.lang-li').removeClass('red-bird');
				$(this).addClass('red-bird')
				$('.lan').attr('src', $(this).find('img').attr('src'));
				$('.lan-2').html($(this).find('img').attr('name'));
			}
		});

		$('.how-it-works, .how-it-works-block .close ').on('click', function() {
			if (!$('.how-it-works').hasClass('how-it-works-active-btn')) {
				$('.how-it-works').addClass('how-it-works-active-btn');
			} else {
				$('.how-it-works').removeClass('how-it-works-active-btn');
			}
			$('body,html').animate({scrollTop: '0px'}, 1000);

		});
		//rednav


		var searchInit = 0;
		var navInit = 0;
		var lastScrollTop2 = 0;
		$(window).scroll(function() {			
			
			if($(".how-it-works-block").length != 0) {
				var howIt = $('.how-it-works-block').offset().top + $('.how-it-works-block').outerHeight();
			}else{
				var howIt = 0;
			}
			
			if($("#search-bar").length != 0) {
				var searchBar = $('#search-bar').offset().top + $('#search-bar').outerHeight();
			}else{
				var searchBar = 0;
			}
			
			var nav = $('nav').offset().top;
			
			if ($(this).scrollTop() > lastScrollTop2) {
				if ($(this).scrollTop() + $('nav').outerHeight() >= searchBar && !$('.search-flag').hasClass('search-fixed')) {
					if ($('*').hasClass('rotated-arrow')) {
						$('.extended-click img').removeClass('rotated-arrow');
						$('.refined-search-block').toggle();
					}
					if($("#search-bar").length != 0) {
						searchInit = $('#search-bar').offset().top;
					}else{
						searchInit = 0;
					}
					$('.search-flag').addClass('search-fixed');
				}

				if ($('.how-it-works').hasClass('how-it-works-active-btn') && $(this).scrollTop() > howIt) {
					$('.how-it-works').removeClass('how-it-works-active-btn');
					$(".how-it-works-block").slideToggle("slow", function() {});
				}
			} else {
				if($(".block-for-search").length != 0) {
					var blockforsearch = $('.block-for-search').offset().top;
				}else{
					var blockforsearch = 0;
				}
			
				if ($(this).scrollTop() + $('nav').outerHeight() < blockforsearch) {
					$('.search-flag').removeClass('search-fixed');
				}
				if ($(this).scrollTop() <= $('.block-for-nav').offset().top) {
					$('nav').removeClass('nav-fixed');
				}
			}
			lastScrollTop2 = $(this).scrollTop();
		});
	});
</script>

<style>
body:not(home) nav .max-width .nav-flexbox .nav-flex-item li.language {
    z-index: auto !important;
}
</style>

<!----Remarketing conversion tracking start --->
<script type="text/javascript">
	/* <![CDATA[ */
	var google_conversion_id = 1070848815;
	var google_custom_params = window.google_tag_params;
	var google_remarketing_only = true;
	/* ]]> */
</script>
<script type="text/javascript" src="https://www.googleadservices.com/pagead/conversion.js"></script>
<noscript>
<div style="display:inline;">
	<img height="1" width="1" style="border-style:none;" alt="Google Leads" src="https://googleads.g.doubleclick.net/pagead/viewthroughconversion/1070848815/?value=0&guid=ON&script=0"/>
</div>
</noscript>
<!----Remarketing conversion tracking end --->
<script id="CookieDeclaration" src="https://consent.cookiebot.com/4e0a0599-23d0-4973-8ca9-2190804c77ec/cd.js" type="text/javascript" async></script>
</body>
</html>