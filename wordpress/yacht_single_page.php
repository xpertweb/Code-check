<?php
/** Template Name: yacht single page */
get_header();

$url = get_site_url();
$yacht_id = !empty($_GET['id'])?$_GET['id']:'';
$startdate = !empty($_GET['startdate'])?$_GET['startdate']:'';
$endate = !empty($_GET['endate'])?$_GET['endate']:'';

$response = getJSONS(LIVE_API_URL.'/api/filter/singleYatch/1/'.$yacht_id.'/'.$startdate.'/'.$endate);
$yachtArray = json_decode($response, true);
$YachtData = $yachtArray[0];

	
// echo "<pre>";
// print_r($YachtData);
// echo "</pre>";
?>
<style>
.innerPageSlider .carousel-control { visibility: hidden; }
body .innerPageSlider .carousel-control span.glyphicon { height: 50px !important; width: 50px !important; visibility: visible !important; } 
.block-for-search { display: none !important; }  
.center { display: block; margin-left: auto; margin-right: auto; width: 50%; }  
.how-it-works-block h1.center {width: 100%;}
.carousel,.innerPageSlider { background: url('/wp-content/uploads/2020/04/rsz_slider-bg__sea.png') no-repeat; background-size: cover; }
.active_red_icon{color: #eb3639;}
.check-in ul li select.s-hidden{display:none !important}
.landscape { -webkit-transform: rotate(-90deg); -moz-transform: rotate(-90deg); -o-transform: rotate(-90deg); -ms-transform: rotate(-90deg); transform: rotate(-90deg); }
</style>
<div class="showGalleryOuterDiv">
<?php 
$sliderButton = '';
if(!empty($YachtData['img_slider'][0]) || !empty($YachtData['desktop_images']) || !empty($YachtData['images']) || !empty($YachtData['modalImages'])){
	$sliderButton = '<div class="showGallery">
		<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#pictureGallery">
		  <img alt="Top Image" src="'.get_site_url().'/wp-content/uploads/2020/07/galleyClick-2.png" />
		  <span class="galleryBtnTxt">Click to show <span class="galleryBlock">gallery</span><span>
		</button> 
	</div>';
}

$imgTotaL = count($YachtData['img_slider']);
echo '<div class="slider-block innerPageSlider ">		
		<div id="myCarousel" class="carousel slide singleDSlider" data-ride="carousel">
			<div class="carousel-inner">';
			
			if(!empty($YachtData['desktop_images'])) 
			{
				echo '<div class="item active">
						<img src="'.$YachtData['desktop_images'].'" style="width:100%" alt="desktop images">
					</div>';
			}else if(!empty($YachtData['images'])) 
			{ 
				echo '<div class="item active">
						<img src="'.$YachtData['images'].'" style="width:100%" alt="images">
					</div>';
			}else if(!empty($YachtData['modalImages'])) 
			{ 
				echo '<div class="item active">
						<img src="'.$YachtData['modalImages'].'" style="width:100%" alt="modal Images">						   
					</div>';
			}else if(!empty($YachtData['img_slider'][0])) 
			{ 
				echo '<div class="item active">
						<img src="'.$YachtData['img_slider'][0].'" style="width:100%" alt="Top Image">						   
					</div>';
			}else if(!empty($YachtData['layout_image'])) 
			{ 
				echo '<div class="item active">
						<img src="'.$YachtData['layout_image'].'" style="width:100%" alt="layout image">
					</div>';
			}
	echo '</div> 
		</div>			
	</div>';
	echo $sliderButton;	
?>
</div>   
<!--- singleDetail-midSec.html here --->
<div class="process-page yatchSingleDetailPBlk"> 
	<section class="max-width">
		<div class="flex-process" style="margin-bottom:150px;">
			<div class="left-side">
				<div class="bread-crumbs">
					<ul>
						<li><a href="<?php echo get_site_url(); ?>">Home</a></li>
						<li>&#x2192;</li>
						<li><a onclick="history.back();">Suchergebnisse </a></li>
						<li>&#x2192;</li>
						<?php if(!empty($YachtData['modal_name'])) echo '<li><a class="current-page"> Yachtcharter '.$YachtData['district_name'].': '.$YachtData['modal_name'].'</a></li>'; ?>
					</ul>
                    <?php if(!empty($YachtData['district_name'])) echo '<h1> Yachtcharter '.$YachtData['district_name'].': '.$YachtData['modal_name'].'</h1>'; ?> 
				</div>
				<div class="panel-block">
					<div class="panel">
						<div class="scroll-btn-panel">
							<ul>
								<li><a class="scroll-click click-details" href="javascript:void(0)">Details </a></li>
								<li><a class="scroll-click click-equipment" href="javascript:void(0)">Ausstattung </a></li>
								<li><a class="scroll-click click-map" href="javascript:void(0)">Karte </a></li>
								<li><a class="scroll-click click-reviews" href="javascript:void(0)">Bewertungen </a></li>
								<li><a class="scroll-click click-faq" href="javascript:void(0)">FAQ</a></li>
							</ul>
						</div>
					</div>
				</div>
				<div class="block-details" style="width:100%;">
					<ul>
						<?php
						if(!empty($YachtData['district_name']) && !empty($YachtData['marina_name']) )
						{
							echo '<li>
									<span><img alt="From" src="'.get_site_url().'/wp-content/uploads/2020/03/from.png"></span>
									<span>
									   <span>Standort</span>
									   <span>'.$YachtData['district_name'].' / '.$YachtData['marina_name'].'</span>
									</span>
								</li>';
						}
                        ?>
						<li><span><?php echo count($YachtData['ratingDetail']); ?> Bewertungen </span><span><?php echo displayRatingStar($YachtData['globalAvgRating']); ?></span></li>
					</ul>
					<ul>
						<?php
                            if(!empty($YachtData['build']))
                            {
                                echo '<li>
                                        <span class="icon-line-height"><img alt="BJ" src="'.get_site_url().'/wp-content/uploads/2020/03/year.png"></span>
                                        <span>BJ '.$YachtData['build'].' </span>
                                    </li>';
                            }
                            if(!empty($YachtData['length']))
                            {
                                echo '<li>
                                        <span class="icon-line-height"><img alt="Länge" src="'.get_site_url().'/wp-content/uploads/2020/03/lenght.png"></span>
                                        <span>'.$YachtData['length'].'m </span>
                                    </li>';
                            }


                            if(!empty($YachtData['cabins']))
                            {
                                echo '<li>
                                        <span class="icon-line-height"><img alt="Kabinen" src="'.get_site_url().'/wp-content/uploads/2020/03/cabins.png"></span>
                                        <span>'.$YachtData['cabins'].' Kabinen </span>
                                    </li>';
                            }

                            if(!empty($YachtData['berth']))
                            {
                                echo '<li>
                                        <span class="icon-line-height"><img alt="Kojen" src="'.get_site_url().'/wp-content/uploads/2020/03/berth.png"></span>
                                        <span>'.$YachtData['berth'].' Kojen </span>
                                    </li>';
                            }

                            if(!empty($YachtData['bathrooms']))
                            {
                                echo '<li>
                                    <span class="icon-line-height"><img alt="Bäder" src="'.get_site_url().'/wp-content/uploads/2020/03/bath.png"></span>
                                    <span>'.$YachtData['bathrooms'].' Bäder </span>
                                </li>';
                            }
                        ?>
					</ul>
					<div class="yacht-details <?php if( $YachtData['layoutImagesWidth'] < $YachtData['layoutImagesHeight']) echo "portrait-img"; ?>">
						<div class="width-411">
							<h4>Yachtdetails</h4>
							<table>
								<tbody>
									<tr>
										<td><span>Yachtmodell: </span></td>
										<td><a href="<?php echo get_site_url().'/Werft/'.@$YachtData['manufactorer_slug'].'/'.create_slugs(@$YachtData['modal_name']).'/'.@$YachtData['modal_id']; ?>/"><?php echo !empty($YachtData['modal_name'])?$YachtData['modal_name']:''; ?></a></td>
									</tr>
									<?php
                                    if(!empty($YachtData['unit_subtype_value']))
                                    {
                                        echo '<tr>
                                                <td> <span>Typ:  </span></td>
                                                <td>'.$YachtData['unit_subtype_value'].'</td>
                                            </tr>';
                                    }
                                    if(!empty($YachtData['manufactorer_name']))
                                    {
                                        echo '<tr>
                                                <td> <span> Hersteller:</span></td>
                                                <td><a href="'.get_site_url().'/Werft/'.@$YachtData['manufactorer_slug'].'/">'.@$YachtData['manufactorer_name'].'</a></td>
                                            </tr>';
                                    }
                                    if(!empty($YachtData['build']))
                                    {
                                        echo '<tr>
                                                <td> <span> Baujahr: </span></td>
                                                <td>'.$YachtData['build'].'</td>
                                            </tr>';
                                    }
                                    if(!empty($YachtData['cabins']))
                                    {
                                        $tbrths = $YachtData['count_night_guest'] + $YachtData['extended_night_guest'];
                                        echo '<tr>
                                                <td> <span>Kabinen / Kojen: </span></td>
                                                <td>'.$YachtData['cabins'].' / '.$tbrths.'</td>
                                            </tr>';
                                    }
                                    if(!empty($YachtData['bathrooms']))
                                    {
                                        echo '<tr>
                                                <td> <span> Bäder:</span></td>
                                                <td>'.$YachtData['bathrooms'].'</td>
                                            </tr>';
                                    }
                                    if(!empty($YachtData['main_sail_value']))
                                    {
                                        
                                        echo '<tr>
                                                <td><span>Großsegel: </span></td>
                                                <td>'.$YachtData['main_sail_value'].'</td>
                                            </tr>';
                                    }
                                    if(!empty($YachtData['head_sail_value']))
                                    {
                                        echo '<tr>
                                                <td> <span>Vorsegel: </span></td>
                                                <td>'.$YachtData['head_sail_value'].'</td>
                                            </tr>';
                                    }
                                    if(!empty($YachtData['control_value']))
                                    {
                                       
                                        echo '<tr>
                                                <td> <span>Steuerung</span></td>
                                                <td>'.$YachtData['control_value'].'</td>
                                            </tr>';
                                    }
                                    if(!empty($YachtData['tankwater']))
                                    {
                                        echo '<tr>
                                                <td><span>Wassertank</span></td>
                                                <td>'.number_format($YachtData['tankwater'],2).' l</td>
                                            </tr>
                                            ';
                                    }
                                    if(!empty($YachtData['length']))
                                    {
                                        echo '<tr>
                                                <td> <span>Länge:</span></td>
                                                <td>'.$YachtData['length'].'m</td>
                                            </tr>';
                                    }
                                    if(!empty($YachtData['width']))
                                    {
                                        echo '<tr>
                                                <td> <span>Width:</span></td>
                                                <td>'.$YachtData['width'].'m</td>
                                            </tr>';
                                    }
                                    if(!empty($YachtData['draft']))
                                    {
                                        echo '<tr >
                                                <td> <span >Draft:</span></td>
                                                <td>'.$YachtData['draft'].'m</td>
                                            </tr>';
                                    }
                                    if(!empty($YachtData['sail_area']))
                                    {
                                        echo '<tr >
                                                <td> <span >Segelfläche:</span></td>
                                                <td>'.number_format($YachtData['sail_area'],2).'</td>
                                            </tr>';
                                    }
                                    if(!empty($YachtData['mast']))
                                    {
                                        echo ' <tr >
                                                <td> <span >Anzahl Masten:</span></td>
                                                <td>'.$YachtData['mast'].'</td>
                                            </tr>';
                                    }
                                    if(!empty($YachtData['number_of_engines']))
                                    {
                                        echo ' <tr >
                                                <td> <span >Anzahl Motoren:</span></td>
                                                <td>'.$YachtData['number_of_engines'].'</td>
                                            </tr>';
                                    }
                                    if(!empty($YachtData['engine_power']))
                                    {
                                        echo ' <tr >
                                                <td> <span >Motorleistung:</span></td>
                                                <td>'.$YachtData['engine_power'].' PS</td>
                                            </tr>';
                                    }
                                    if(!empty($YachtData['fuel_value']))
                                    {
                                        echo '<tr >
                                                <td> <span >Treibstoff:</span></td>
                                                <td>'.$YachtData['fuel_value'].'</td>
                                            </tr>';
                                    }
                                    if(!empty($YachtData['fuel_tank']))
                                    {
                                        echo ' <tr >
                                                <td> <span >Treibstofftank:</span></td>
                                                <td>'.$YachtData['fuel_tank'].'l</td>
                                            </tr>';
                                    }
                                    if(!empty($YachtData['port_name']))
                                    {
                                        echo '<tr >
                                                <td> <span >Hafen:</span></td>
                                                <td><a href="#">'.$YachtData['port_name'].'</a></td>
                                            </tr>';
                                    }
                                ?>
								</tbody>
							</table>
						</div>
						<?php 
						if(!empty($YachtData['layout_image'])){
							if( $YachtData['layoutImagesWidth'] > $YachtData['layoutImagesHeight']){
								$orientation = "landscape";
							}else{
								$orientation = "portrait";
							}
							echo '<div class="details-img"><img alt="layout image" class="'.$orientation.'" src="'.$YachtData['layout_image'].'"></div>'; 
						}?>
					</div>
				</div>
				<!-- block details-->
				
				<!-- block equipment-->
				<div class="block-equipment" style="width:100%;">
                    <?php
                    echo '<h4>Ausstattung</h4>'; 
                    if(count($YachtData['standardEqupments']) > 0)
                    {
                        echo '<div class="flex-icons-block equipment-1-icons">';
                            foreach($YachtData['standardEqupments'] as $Equpments)
                            {
                                echo '<section class="flex-icon-item">
										<div class="height-70">
											<img alt="'.$Equpments['name_de'].'" title="'.$Equpments['name_de'].'" src="'.$Equpments['image'].'" alt="">
										</div>
										<span>'.$Equpments['name_de'].'</span>
									</section>';
                            }
                        echo '</div>';
                           
                    }
                    ?>
					<div class="show-all-equipment">
						<p class="show-all"><a><span>Ausstattung vollständig anzeigen</span><img alt="Ausstattung vollständig anzeigen" src="<?php echo get_site_url(); ?>/wp-content/uploads/2020/03/red_eqi.png"></a></p>
						<div class="general none-important">
						<?php 
						/*====General Equpments=======*/
						if($YachtData['generalEqupmentsCount'] > 0){
							echo "<h3>Allgemeines</h3>";							
							echo '<p>';
							foreach($YachtData['generalEqupments'] as $Equpments){
								echo $Equpments['equpments'].', ';
							}
							echo '<p>';	
						}	
						
						/*====Tech Equpments=======*/
						if($YachtData['techEqupmentsCount'] > 0){
							echo "<h3>Technische Details und Navigation</h3>";							
							echo '<p>';
							foreach($YachtData['techEqupments'] as $Equpments){
								echo $Equpments['equpments'].', ';
							}
							echo '<p>';	
						}	
						
						/*====General Equpments=======*/
						if($YachtData['safetyEqupmentsCount'] > 0){
							echo "<h3>Sicherheit</h3>";							
							echo '<p>';
							foreach($YachtData['safetyEqupments'] as $Equpments){
								echo $Equpments['equpments'].', ';
							}
							echo '<p>';	
						}	
						?>
						</div>
					</div>
					<div class="block block-enhance">
						<h3>Unser Service</h3>
						<div class="pad-left-25">
							<p>Unsere Serviceleistungen sind unübertroffen. Wir kümmern uns von vorne bis hinten um euer Wohl:</p>
							<div class="flex-icons-block">
								<section class="flex-icon-item">
									<div class="height-70"><img src="<?php echo get_site_url(); ?>/wp-content/uploads/2020/03/24-hour.png" alt="24 hours"></div><span class="padding-0-5">Kundenservice 14/7 - 14 Stunden täglich an 7 Tagen in der Woche sind wir für Euch da.</span>
								</section>
								<section class="flex-icon-item">
									<div class="height-70"><img src="<?php echo get_site_url(); ?>/wp-content/uploads/2020/03/shopping.png" alt="shopping"></div><span class="padding-0-5">Die besten Preise im Netz mit vielen Sonderangeboten.</span>
								</section>
								<section class="flex-icon-item">
									<div class="height-70"><img src="<?php echo get_site_url(); ?>/wp-content/uploads/2020/03/cocktail.png" alt="cocktail"></div><span class="padding-0-5">Ihr genießt den Urlaub, wir kümmern uns um den Rest.</span>
								</section>
								<section class="flex-icon-item">
									<div class="height-70"><img src="<?php echo get_site_url(); ?>/wp-content/uploads/2020/03/international.png" alt="international"></div><span class="padding-0-5">Gerne geben wir Euch auch Routenempfehlungen und Tipps.</span>
								</section>
							</div>
						</div>
					</div>
				</div>
				
				<?php if(!empty($YachtData['longitude']) && !empty($YachtData['latitude'])){ ?>
					<div class="block-map">
						<h3>Standort</h3>
						<div id="googleMap" style="width:100%;height:366px;"></div>
					</div>
				<?php } ?>

				<div class="block-reviews" >
					<h2>Bewertungen </h2>
					<?php 
					if(count($YachtData['ratingDetail']) != 0){
						foreach($YachtData['ratingDetail'] as $rating){ ?>
						<div class="comment-blk">
							<h3 class="comment-name"><?php echo $rating['firstname'].' '.$rating['lastname']; ?></h3>
							<div class="flex-comment">
								<span class="comment-day">
									<span><img alt="clock" src="<?php echo get_site_url(); ?>/wp-content/uploads/2020/03/clock2.png"></span><span><?php echo date("M Y",strtotime($rating['creation_date'])); ?></span>
								</span>
								<span>
									Ist diese Bewertung hilfreich?
									<span class="buttons-yes-no">
										<button href="javascript:void(0)" rel="<?php echo $rating['oid']; ?>" class="ratingVote yes yes<?php echo $reviews->oid; ?>">Ja</button>
										<button href="javascript:void(0)" rel="<?php echo $rating['oid']; ?>" class="ratingVote no no<?php echo $reviews->oid; ?>">Nein</button>
									</span>
								</span>
							</div>
							<div class="rate2">
								<span><?php echo displayRatingStar($rating['votingAvg']); ?></span>
								<p class="comment"><?php echo $rating['text']; ?></p>
							</div>
						</div>
						<?php }
					}else{
						echo 'Keine Bewertungen vorhanden.';
					} ?>	
				</div>			
				
				<?php
                    $apiUrlFaq = LIVE_API_URL."/api/crmapi/faq";
                    $responseOrderFaq = getJSONS($apiUrlFaq);
                    $yatchDataFaq = json_decode($responseOrderFaq, true);                                    
                ?>
                <div class="block-faq" style="">
                    <h2>FAQ</h2>
                    <section class="pad-left-25 faqBlockDetail">
                        <div class="panel-group" id="accordion">
                            <?php foreach ($yatchDataFaq as $key => $faq){ ?>
								<div class="panel panel-default">
									<div class="panel-heading">
										<h4 class="panel-title">
											<a class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapse_<?php echo $key ;?>">
												<?php echo $faq['heading']; ?>
												<img alt="accordion" class="accordion-img" src="<?php echo get_site_url(); ?>/wp-content/uploads/2020/03/red_eqi.png">
											</a>
										</h4>
									</div>
									<div id="collapse_<?php echo $key ;?>" class="panel-collapse collapse">
										<div class="panel-body">
											<p><?php echo $faq['faqText']; ?></p>
										</div>
									</div>
								</div>
                            <?php } ?>
                        </div>
                    </section>
                </div>
			</div>
			<div class="right-side">
				<div id="card2">
					<?php include("template-parts/include/right-sidebar-yacht-detail.php"); ?>
				</div>
			</div>
		</div>
	</section> 
</div> 

<!---- Start Images Gallery ---->
<div class="modal fade pictureGalleryPopup" id="pictureGallery" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content galleryContent">
      <div class="modal-header">
          <div class="gallryLogo">
              <img alt="cropped" src="<?php echo get_site_url(); ?>/wp-content/uploads/2020/06/cropped-logo.png" />
          </div>
          <div class="galleryTitle">
              <h3><?php echo @$YachtData['modal_name'].' '. @$YachtData['unit_subtype_value']; ?></h3>
              <div class="popupLocation">
                  <div class="popLocIcon">
                      <img alt="Location Icon" src="<?php echo get_site_url(); ?>/wp-content/uploads/2020/06/LocIcon.png" />
                  </div>
                  <div class="popLocText">
                    <span><?php echo @$YachtData['district_name'].' / '. @$YachtData['country_name']; ?></span>
                  </div>
              </div>
          </div>
          <div class="popupCloseBtn">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times; <span class="closePopup">Close</span></span>
            </button>
          </div>
      </div>
      <div class="modal-body">
        <div class="sliderPartPopup">
            <div class="slideshow-container">
				<?php 				
				$totalCount = count($YachtData['img_slider']);
				$Countjk = 1;
				
				if(!empty($YachtData['desktop_images'])){
					$totalCount = $totalCount + 1;
				}
				if(!empty($YachtData['images'])){
					$totalCount = $totalCount + 1;
				}				
				
				if(!empty($YachtData['desktop_images'])) 
				{ 
					echo '<div class="mySlides fade">
							<div class="numbertext">'.$Countjk.'/'.$totalCount.'</div> 
							<img alt="desktop images" src="'.$YachtData['desktop_images'].'" />
						</div>';
					$Countjk++;
				}
					
				if(!empty($YachtData['images'])){
					echo '<div class="mySlides fade">
							<div class="numbertext">'.$Countjk.'/'.$totalCount.'</div> 
							<img alt="Images" src="'.$YachtData['images'].'" />
						</div>';
					$Countjk++;
				} 
				
				if(!empty($YachtData['modalImages'])) 
				{
					$totalCount = $totalCount + 1;
					echo '<div class="mySlides fade">
							<div class="numbertext">'.$Countjk.'/'.$totalCount.'</div> 
							<img alt="modal Images" src="'.$YachtData['modalImages'].'" />
						</div>';
					$Countjk++;
				}
				
				if(!empty($YachtData['img_slider'][0])){				
					foreach($YachtData['img_slider'] as $imgSlider){
					?>
					<div class="mySlides fade">
						<div class="numbertext"><?php echo $Countjk; ?>/<?php echo $totalCount; ?></div> 
						<img alt="<?php echo $YachtData['modal_name'].' '.$Countjk; ?>" src="<?php echo $imgSlider; ?>" />
					</div>
					<?php
						$Countjk++;
					}
				}
				?>	
                <a class="prev" onclick="plusSlides(-1)"><img alt="Previous" src="<?php echo get_site_url(); ?>/wp-content/uploads/2020/06/arrowLeftImg.png" /></a>
                <a class="next" onclick="plusSlides(1)"><img alt="Next" src="<?php echo get_site_url(); ?>/wp-content/uploads/2020/06/arrowRightImg.png" /></a>
            </div>  
        </div>
      </div> 
    </div>
  </div>
</div>      
<!---- End Images Gallery ---->

<script src="https://maps.googleapis.com/maps/api/js?key=<?php echo get_option('google_map_icon_key'); ?>"></script>
<?php if(!empty($YachtData['latitude']) && !empty($YachtData['longitude'])){ ?>
<script>
	myMap();
	function myMap() {
		var myLatLng = {
			lat: <?php echo $YachtData['latitude']; ?>,
			lng: <?php echo $YachtData['longitude']; ?>
		};

		var mapProp = {
			center: myLatLng,
			zoom: 10
		};
		var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);

		var marker = new google.maps.Marker({
			position: myLatLng,
			map: map,
		});
	}
</script>
<?php } ?>
<script>
	
	$(document).ready(function() {	
		var disabledDays = <?php echo getAvailableDates($yacht_id); ?>;
		$(".checkAvailable").datepicker({
			numberOfMonths: 2,		
			minDate: "+7d",
			dateFormat: 'dd.mm.yy',
			beforeShowDay: function (date) {			
				var day = date.getDay();			
				var string = $.datepicker.formatDate('dd-mm-yy', date);
				var isDisabled = ($.inArray(string, disabledDays) != -1);
				return [day != 0 && day != 1 && day != 2 && day != 3 && day != 4 && day != 5 && isDisabled];		 
			}
		});
		
		$(document).on('click','.ratingVote',function(){		
			$(this).addClass('active');
			var relId = $(this).attr('rel');		
			$(".yes"+relId).attr('disabled',true);
			$(".no"+relId).attr('disabled',true);
		});
		
		$('.rating2').rating('rate', '5');
		$('.rating').rating('rate', '5');
		var card = '#card2';
		var redbarHeight = $('.red-navbar').outerHeight();
		var cardTop = $(card).offset().top;
		var LeftSideLeft = $('.left-side').offset().left;
		var rigthSideHeight = $('.right-side').offset().top + $('.right-side').outerHeight();
		var cardHeight = $('.card-height').outerHeight();
		var processBottom = $('.process-page').offset().top + $('.process-page').outerHeight();
		var panelBlock = $('.panel-block').offset().top;
		var width = $(window).width(),
			height = $(window).height();
		var rtime;
		var timeout = false;
		var delta = 200;
		var ResizeFlag = false;
		$(window).resize(function() {
			rtime = new Date();
			if (timeout === false) {
				timeout = true;
				ResizeFlag = true;
				setTimeout(resizeend, delta);
			}
			if ($(card).hasClass('fixed-card') && $(card).hasClass('stop-card')) {}

			LeftSideLeft = $('.left-side').offset().left;
			redbarHeight = $('.red-navbar').outerHeight();
			rigthSideHeight = $('.right-side').offset().top + $('.right-side').outerHeight();
			cardHeight = $('.card-height').outerHeight();
			processBottom = $('.process-page').offset().top + $('.process-page').outerHeight();
			if ($(card).hasClass('fixed-card')) {
				var width = $('.right-side').outerWidth();
				var calcPerc = width / 100 * 94;
				$(card).css({
					'width': calcPerc
				});
			}
		})
		var detailsTop = $('.block-details').offset().top;
		var equipTop = $('.block-equipment').offset().top;
		var mapTop = $('.block-map').offset().top;
		var reviewTop = $('.block-reviews').offset().top;
		var faqTop = $('.block-faq').offset().top;
		var yourDetails = $('.block-details').offset().top + $('.block-details').outerHeight();
		var Equip = $('.block-equipment').offset().top + $('.block-equipment').outerHeight();
		var Map = $('.block-map').offset().top + $('.block-map').outerHeight();
		var Review = $('.block-reviews').offset().top + $('.block-reviews').outerHeight();
		var Faq = $('.block-faq').offset().top + $('.block-faq').outerHeight();
		var lastScrollTop4 = 0;
		$(window).scroll(function() {
			var scroll = $(this).scrollTop();
			if (scroll > lastScrollTop4) {} else {}
			lastScrollTop4 = $(this).scrollTop();
		})
		$('.show-all a').on('click', function(e) {
			event.preventDefault(e);
			if ($('.show-all-equipment .general').hasClass('none-important')) {
				$('.show-all-equipment .general').removeClass('none-important');
				$('.show-all img').addClass('rotated-arrow');
				$('.show-all a span').html('Ausstattung verbergen');
			} else {
				$('.show-all-equipment .general').addClass('none-important');
				$('.show-all img').removeClass('rotated-arrow');
				$('.show-all a span').html('Ausstattung vollständig anzeigen');
			}
		});
		
	});
	var lastScrollTop2 = 0;
	var width = $(window).width(),
		height = $(window).height();
	var rtime;
	var timeout = false;
	var delta = 200;

	var ResizeFlag = false;
	var card = '#card2';
	
	var redbarHeight = $('.red-navbar').outerHeight();
	var cardTop = $(card).offset().top;
	var LeftSideLeft = $('.left-side').offset().left;
	var rigthSideHeight = $('.right-side').offset().top + $('.right-side').outerHeight();
	var cardHeight = $('.card-height').outerHeight();
	// var processBottom = $('.process-page').offset().top + $('.process-page').outerHeight();
	var panelBlock = $('.panel-block').offset().top;
	$(window).resize(function() {
		console.log();
		rtime = new Date();
		if (timeout === false) {
			timeout = true;
			ResizeFlag = true;
			setTimeout(resizeend, delta);
		}

		if ($(card).hasClass('fixed-card') && $(card).hasClass('stop-card')) {

		}
	
		LeftSideLeft = $('.left-side').offset().left;
		redbarHeight = $('.red-navbar').outerHeight();
		rigthSideHeight = $('.right-side').offset().top + $('.right-side').outerHeight();
		cardHeight = $('.card-height').outerHeight();
		processBottom = $('.process-page').offset().top + $('.process-page').outerHeight();
		if ($(card).hasClass('fixed-card')) {
			var width = $('.right-side').outerWidth();
			var calcPerc = width / 100 * 94;
			$(card).css({
				'width': calcPerc
			});
		}
	});
	
	function resizeend() {
		if (new Date() - rtime < delta) {
			setTimeout(resizeend, delta);
		} else {
			timeout = false;
			ResizeFlag = false;
		}
	}
	
	$(window).scroll(function() {
		var scroll = $(this).scrollTop();
		var processBottom = $('.process-page').offset().top + $('.process-page').outerHeight();
		if (scroll > lastScrollTop2) {
			if (scroll > (processBottom - cardHeight + 200 )) {
				$(card).addClass('card-stop');
			}
			if (scroll + redbarHeight > cardTop) {
				var width = $('.right-side').outerWidth();
				var calcPerc = width / 100 * 94;
				$(card).css({'width': calcPerc});
				$(card).addClass('fixed-card');
			}
		} else {
			if (scroll + redbarHeight < cardTop && ResizeFlag == false) {
				$(card).css({'width': ''});
				$(card).removeClass('fixed-card');
			}
			if (scroll < (processBottom - cardHeight + 200 )) {
				$(card).removeClass('card-stop');
			}
		}
		lastScrollTop2 = $(this).scrollTop();
	});
</script>


<script>
var slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}    
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";  
  }
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";  
  dots[slideIndex-1].className += " active";
}
</script>
<style>
body.modal-open {
    overflow-y: hidden;
}
</style>

<?php
get_footer();
?>