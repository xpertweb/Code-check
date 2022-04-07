<?php
/*
* Template Name: yacht offer booking
*/

get_header();

global $wpdb;
$url = get_site_url();
$yacht_id = !empty($_GET['id'])?$_GET['id']:'';
$startdate = !empty($_GET['startdate'])?$_GET['startdate']:'';
$enddate = !empty($_GET['endate'])?$_GET['endate']:'';
// echo LIVE_API_URL.'/api/filter/singleYatch/1/'.$yacht_id.'/'.$startdate.'/'.$enddate;
$response = getJSONS(LIVE_API_URL.'/api/filter/singleYatch/1/'.$yacht_id.'/'.$startdate.'/'.$enddate);
$yachtArray = json_decode($response, true);                      
$YachtData = $yachtArray[0];
// echo "<pre>";
// print_r($YachtData);
// echo "</pre>";
?>
<style>
.active_red_icon { color: #eb3639; }
#TotalAmount_section { float: right; }
#TotalAmount_section h2 span { color: #E93539; }
.innerPageSlider .carousel-control { visibility: hidden; }
.carousel, .innerPageSlider { background-color: #f0f0f0 !important; }
.carousel, .innerPageSlider { background: url('/wp-content/uploads/2020/04/rsz_slider-bg__sea.png') no-repeat; background-size: cover; }
body .innerPageSlider .carousel-control span.glyphicon { height: 50px !important; width: 50px !important; visibility: visible !important; }
.block-for-search { display: none !important; }
.center { display: block; margin-left: auto; margin-right: auto; width: 50%; }
.alert { padding: 15px !important; }
.bookingMessage { display: none }
.error { color: red !important; }
.offerPage .left-side .main-buttons input { text-decoration: none; font-size: 16px; font-family: AvenirNextCyrMedium; width: 181px; text-align: center; display: inline-block; padding: 13px 0; margin-right: 59px; }
.bookingAuthorized{margin-right: 20px !important;}
</style>
<div class="showGalleryOuterDiv">
<?php 
$imgTotaL = count($YachtData['img_slider']);
if(!empty($YachtData['img_slider'][0])){
	$sliderButton = '<div class="showGallery">
		<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#pictureGallery">
		  <img alt="Top Image" src="'.get_site_url().'/wp-content/uploads/2020/07/galleyClick-2.png" />
		  <span class="galleryBtnTxt">Click to show <span class="galleryBlock">gallery</span><span>
		</button> 
	</div>';
}

echo '<div class="slider-block innerPageSlider">		
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
						<img src="'.$YachtData['images'].'" style="width:100%" alt="Images">
					</div>';
			}else if(!empty($YachtData['modalImages'])) 
			{ 
				echo '<div class="item active">
						<img src="'.$YachtData['modalImages'].'" style="width:100%" alt="modal Images">						   
					</div>';
			}else if(!empty($YachtData['img_slider'][0])) 
			{ 
				echo '<div class="item active">
						<img src="'.$YachtData['img_slider'][0].'" style="width:100%" alt="Image Slider">
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

<section class="offerPage">
	<div class="process-page">
		<section class="max-width">
			<div class="flex-process" style="margin-bottom:150px">
				<div class="left-side">
					<div class="bread-crumbs">
						<h1>Dein Angebot / Buchung</h1>
					</div>
					<div class="panel-block">
						<div class="panel">
							<div class="scroll-btn-panel">
								<ul>
									<li><a class="scroll-click click-details" href="">Details und Extras</a></li>
									<li><a class="scroll-click click-terms" href="">Bedingungen</a></li>
									<li><a class="scroll-click click-payment" href="">Angaben zur Person</a></li>
								</ul>
							</div>
						</div>
					</div>

					<!---->
					<!--block-details-->
					<div class="block-details offterDetailBox">
						<h2>Details</h2>
						<div class="pad-left-Detail-25">
							<table class="table table-details">
								<tbody>
									<tr>
										<td>Modell</td>
										<td>Bootstyp:</td>
										<td>Zeitraum:</td>
										<td>Region:</td>
									</tr>
									<tr>
										<?php 
											if(!empty($YachtData['modal_name']))
											{
												echo '<td>'.$YachtData['modal_name'].'</td>';
											}
											if(!empty($YachtData['unit_subtype_value']))
											{
												echo '<td>'.$YachtData['unit_subtype_value'].'</td>';
											}
											if(!empty($startdate && $enddate))
											{
												echo '<td>'.$startdate.' - '.$enddate.'</td>';
											}
											if(!empty($YachtData['district_name']) && !empty($YachtData['marina_name']) )
											{
												echo '<td>'.$YachtData['district_name'].' / '.$YachtData['marina_name'].'</td>';
											}										
										?>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
					<form action='#' method='post' id='offerBooking'>
						<?php 
							$percentage = (($YachtData['price'] - $YachtData['special_price'])*100) /$YachtData['price'] ;
							$percentage = round($percentage,1);
							$discount_price = round(($YachtData['price'] - $YachtData['special_price']) , 2);
						?>
						<input type='hidden' name='action' value='BookingNow' />
						<input type='hidden' name='booking_status' id='booking_status' value='0' />
						<input type='hidden' name='yachtweek_oid' value='<?php echo $YachtData['yachtweek_oid']; ?>' />
						<input type='hidden' name='days' value='<?php echo $YachtData['days']; ?>' />
						<input type='hidden' name='price' value='<?php echo round($YachtData['price'],2); ?>' />
						<input type='hidden' name='discount_percentage' value='<?php echo $percentage ?>' />
						<input type='hidden' name='discount_price' value='<?php echo $discount_price; ?>' />
						<input type='hidden' id="special_prices" name='special_price' value='<?php echo round($YachtData['special_price'],2); ?>' />
						<div class=" block-price">
							<h2>Rabatt</h2>
							<div class="discountBlockOffer">
								<table class="table table-discount">
									<tbody>
										<tr class="listPriceDis">
											<td>Listenpreis</td>
											<td><?php echo convert_currency_format($YachtData['price']); ?></td>
										</tr>
										<tr class="listPriceDis">
											<td>Rabatt <?php echo convert_percent_format($percentage); ?>%</td>
											<td><?php echo convert_currency_format($discount_price); ?></td>
										</tr>
										<tr class="price-includes">
											<td>Preis abzgl. Rabatt</td>
											<td><?php echo convert_currency_format($YachtData['special_price']); ?></td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>

						<?php
						if(!empty($YachtData['yatchMandatoryTax'])) 
						{?>
						<div class=" block-price tableDivOptExt">
							<h2>Obligatorische Extras</h2>
							<div class="pad-left-25">
								<table class="table table-discount table-tourist">
									<thead>
										<tr>
											<td>Beschreibung</td>
											<td>Berechnungsart</td>
											<td>Menge.</td>
											<td>Preis</td>
										</tr>
									</thead>
									<tbody>
										<?php
											$textCountt = 1;
											$additionalTax = 0;
											foreach($YachtData['yatchMandatoryTax'] as $yatchMandatoryTax)
											{
												$additionalTax = $additionalTax + $yatchMandatoryTax['totalPrice'];
												
												echo '<tr>
														<td>
														<span class="tableFlexRow"> 
														<label>
															<span>
																<input style="display:none;" type="checkbox" name="mandatory_price[]" checked value="'.$yatchMandatoryTax['special_oid_fk'].'" />
																<input type="checkbox" checked disabled class="mandatory_price" rel="'.round($yatchMandatoryTax['totalPrice'],2).'"  />
															</span>'.$yatchMandatoryTax['name_de'].'
															</label>';
															if(!empty($yatchMandatoryTax['annotation']))
															{
																echo '<span class="tableDrop" id="text_number1_'.$textCountt.'"><i class="fa fa-info-circle"></i></span></span> 
																	  <p class="tableText text_number1_'.$textCountt.'" style="display:none;">'.$yatchMandatoryTax['annotation'].'</p>';
															}
														echo '</td>
														<td>'.$yatchMandatoryTax['unit'].'</td>
														<td>'.$yatchMandatoryTax['quantity'].'</td>
														<td>'.convert_currency_format($yatchMandatoryTax['totalPrice']).'</td>
													</tr>';
												$textCountt++;
											}
											?>
									</tbody>
								</table>
							</div>
						</div>
						<?php
						}
						?>

						<?php
						if(!empty($YachtData['yatchOptionalTax'])) 
						{ ?>

						<div class=" block-price tableDivOptExt">
							<h2>Optionale Extras</h2>
							<div class="pad-left-25">
								<table class="table table-discount table-tourist">
									<thead>
										<tr>
											<td>Beschreibung</td>
											<td>Berechnungsart</td>
											<td>Menge.</td>
											<td>Preis</td>
										</tr>
									</thead>
									<tbody>
										<?php
											$textCount = 1;
											foreach ($YachtData['yatchOptionalTax'] as $value) 
											{
												$specialTaxValue = $value['special_oid_fk']."::".$value['quantity'];
												echo '<tr>
														<td>
                                                        <span class="tableFlexRow"> 
															<label>
																<input type="checkbox" name="optional_extras[]" class="optional-calculaiton" rel="'.round($value['totalPrice'],2).'" value="'.$specialTaxValue.'">'.$value['name_de'].'
																</label>';

															if(!empty($value['annotation']))
															{
																echo '<span class="tableDrop" id="text_number_'.$textCount.'">			<i class="fa fa-info-circle"></i>
																	  </span>
                                                                      </span> 
																	  <p class="tableText text_number_'.$textCount.'" style="display:none;">'.$value['annotation'].'</p>';
															}

														echo '</td>
																<td>'.ucwords($value['unit']).'</td>
																<td>'.$value['quantity'].'</td>
																<td>'.convert_currency_format($value['totalPrice']).'</td>
													</tr>';
													$textCount++;
											}		
											?>

									</tbody>
								</table>
							</div>
						</div>
						<?php						
						}
						$TotalAmount = $YachtData['special_price'] + $additionalTax;
						?>
						<div class="block-price no-border grandTotalPrice" id="TotalAmount_section">
							<input type="hidden" name="TotalAmount" value="<?php echo round($TotalAmount,2);?>" class="TotalAmount">
							<h2>Gesamtbetrag: <span class="TotalAmount"><?php echo convert_currency_format($TotalAmount);?></span></h2>
						</div>

						<div class="block-price no-border yourSigleOfrDetail">
							<h2>Deine Details</h2>
							<div class='alert text-center bookingMessage'></div>
							<div class="from-to">
								<div class="row">
									<div class="col-sm-6">
										<div class="detailBtn">
											<a href="javascript:void(0)">Angaben zur Person</a>
										</div>
									</div>
									<div class="col-sm-6">
										<div class="detailBtn with-border">
											<a href="javascript:void(0)">Login</a>
										</div>
									</div>
								</div>
							</div>
						</div>


						<div class="block-payment singleOfrFormYat">

							<!---- Error message here ---->

							<div class="row">
								<div class="col-lg-6 col-md-6 col-sm-12 input-details">
									<div class=" input-details block-card-payment totalPriceForm">
										<div class="card-number">
											<div class="form-group">
												<label>Titel *</label>
												<select name="Title" class="card-month">
													<option value="" selected="selected">Bitte auswählen</option>
													<option value="0">Frau</option>
													<option value="1">Herr</option>
													<option value="2">Firma</option>
												</select>
											</div>
											<div class="form-group">
												<label>Vorname *</label>
												<input placeholder="Vorname" name="FirstName" type="text" />
											</div>
											<div class="form-group">
												<label>Nachname *</label>
												<input placeholder="Nachname" name="LastName" type="text" />
											</div>
											<div class="form-group">
												<label>Strasse und Hausnummer**</label>
												<div class="d-flex formHorizontal">
													<input placeholder="Strasse" name="Street" id="Street" type="text">
													<input placeholder="Hausnummer" name="StreetNumber" id="StreetNumber" type="text">
												</div>
											</div>

											<div class="form-group">
												<label>Postleitzahl **</label>
												<input placeholder="Postleitzahl" name="Zipcode" id="Zipcode" type="text">
											</div>
											<div class="form-group">
												<label>Ort **</label>
												<input placeholder="Ort" name="City" id="City" type="text">
											</div>

											<div class="form-group">
												<h6>* Benötigte Felder für ein Angebot.</h6>
												<h6>** Pflichtfelder bei einer Buchung.</h6>
											</div>
										</div>
									</div>
								</div>

								<div class="col-lg-6 col-md-6 col-sm-12 input-details totalPriceForm">

									<div class="card-number">
										<div class="input-details block-card-payment">
											<div class="form-group">
												<label>Land</label>
												<select class="card-month" name="Country">
													<option value="">Bitte Land auswählen</option>
													<?php foreach($YachtData['country'] as $countrys){ ?>
													<option <?php if($countrys['oid'] == 256) echo 'selected'; ?> value="<?php echo $countrys['oid']; ?>"><?php echo $countrys['name_de']; ?></option>
													<?php } ?>
												</select>
											</div>
											<div class="form-group">
												<label>Sprache</label>
												<select class="card-month" name="Language">
													<option value="">Bitte Sprache auswählen</option>
													<?php 
													$sitelanguage = $wpdb->get_results("select language_name,language_code from ".$wpdb->prefix."sitelanguage ");
													foreach($sitelanguage as $language){ ?>
													<option value="<?php echo $language->language_code; ?>"><?php echo $language->language_name; ?></option>
													<?php } ?>
												</select>
											</div>

											<div class="form-group">
												<label>Firma </label>
												<input placeholder="Firma" name="Company" type="text" />
											</div>

											<div class="form-group">
												<label>Telefon **</label>
												<input placeholder="Telefon" name="Telefon" id="Telefon" type="text" />
											</div>

											<div class="form-group">
												<label>Fax </label>
												<input placeholder="Fax" name="Fax" type="text" />
											</div>

											<div class="form-group">
												<label>Email *</label>
												<input placeholder="Email" name="Email" type="text" />
											</div>
										</div>
									</div>
								</div>

							</div>
						</div>

						<div class="block-price no-border block-terms">
							<h2>Bedingungen</h2>
							<p>Wenn Sie sich erst noch mit Ihren Mitseglern besprechen wollen, dann drücken Sie einfach auf Angebot und Sie erhalten alle Dokumente wie Chartervertrag über die ausgesuchte Yacht mit allen gewählten Extras, Yachtdetails mit Photos, Layout und Standardausrüstung. Für eine Buchung können Sie dieselben Schritte nochmals auf unserer Homepage wiederholen oder Sie übersenden uns einfach den unterzeichneten Chartervertrag, den Sie per email erhalten haben, damit wir die Buchung für Sie vornehmen.</p>

							<p>Angebot anfordern
								Bei einer Buchung wird die ausgesuchte Yacht automatisch und sofort fest fur Sie reserviert. Den Rest erledigen wir fur Sie und ubersenden Ihnen unverzuglich eine Buchungsbestatigung uber die ausgesuchte Yacht mit allen gewahlten Extras, Yachtdetails mit Photos, Layout und Standardausrustung sowie alle erforderlichen Dokumente, wie z.B. Crewliste und ggf. Versicherungsformulare. Sie mussen nur noch auf die Einhaltung der Zahlungsfristen achten und uns bei Bare-boot-charter eine Kopie Ihres Sportbootfuhrerscheins ubersenden. Selbstverstandlich erhalten Sie nach der Anzahlung sofort eine Zahlungsbestatigung und nach Restzahlung den Bordpass mit Stutzpunktinformationen.</p>

							<p>Wie empfehlen den Abschlu? einer Reiserucktrittsversicherung und ubersenden Ihnen auf Anfrage gerne die erforderlichen Unterlagen.</p>

							<p>Wir verweisen auf § 312g Absatz 2 Satz 1 Nr. 9 BGB, nachdem der fur den hier geschlossenen Vertrag kein Widerrufsrecht besteht.</p>
							<p class="yes-agree"><label style='width: 100%;'><input type="checkbox" name='i_aggree' id='i_aggree' value='1'> Ja, ich buche hiermit verbindlich und akzeptiere die  <a href="<?php echo get_site_url(); ?>/general-terms">Allgemeinen Geschäftsbedingungen</a>und die <a href="<?php echo get_site_url(); ?>/privacy-policy"> Datenschutzhinweise</a></label></p>
						</div>
						
						
						
						<div class="main-buttons">
							<?php if(round($YachtData['price']) > 0 && !empty($YachtData['price'])){ ?>
								<input type='submit' name='requestAnOffer' id="requestAnOffer" class="request" value='Angebot anfragen' />
								<input type='submit' name='requestAnOption' id="requestAnOption" class="request" value='Eine Option anfragen' />
								<input type='submit' name='book_now' id="bookNowOffer" class="book" value='Jetzt buchen' />
							<?php }else{ ?>
								<a href='javascript:void(0)' data-overlay-trigger="bookingAuthorized" class="request bookingAuthorized" >Angebot anfragen</a>
								<a href='javascript:void(0)' data-overlay-trigger="bookingAuthorized" class="request bookingAuthorized" >Eine Option anfragen</a>
								<a href='javascript:void(0)' data-overlay-trigger="bookingAuthorized" class="book bookingAuthorized" >Jetzt buchen</a>
							<?php } ?>
							
						</div>
					</form>
				</div>
				<div class="right-side">
					<div id="card">
						<div class="card-height">
							<div class="card-top">
								<span class="round-booking">
									<img alt="Karsten" src="/wp-content/uploads/2020/04/photo.png">
								</span>
								<h4><span><?php echo convert_currency_format($YachtData['special_price']); ?></span> Pro <?php if($YachtData['days']/7 != 1){ echo $YachtData['days']/7; echo 'Wochen'; }else{ echo 'Woche'; } ?></h4>
							</div>

							<div class="more-questions">
								<div class="more-questions-number"><span class="more">Weitere Fragen?</span><span class="number"><img alt="Telefon" src="/wp-content/uploads/2020/04/phone.png">0 800 0704700</span></div>
								<p class="yacht">Yacht:</p>
								<div class="bavaria">
									<div class="lbls">
										<?php
										if(!empty($YachtData['modal_name']) && !empty($YachtData['unit_subtype_value']))
										{
											echo $YachtData['modal_name'].' '.$YachtData['unit_subtype_value'];
										}
									?>
									</div>
									<span>
										<div class="rate"><?php echo displayRatingStar($YachtData['globalAvgRating']); ?></div>
									</span>
								</div>
							</div>
							<div class="specification">
								<p>Merkmale:</p>
								<ul>
									<?php
			                            if(!empty($YachtData['build']))
			                            {
			                                echo '<li>
			                                        <span class="icon-line-height"><img alt="Jahr" src="/wp-content/uploads/2020/03/year.png"></span>
			                                        <span>'.$YachtData['build'].' Jahr </span>
			                                    </li>';
			                            }
			                            if(!empty($YachtData['length']))
			                            {
			                                echo '<li>
			                                        <span class="icon-line-height"><img alt="Länge" src="/wp-content/uploads/2020/03/lenght.png"></span>
			                                        <span>'.round($YachtData['length'],2).'m Länge </span>
			                                    </li>';
			                            }


			                            if(!empty($YachtData['cabins']))
			                            {
			                                echo '<li>
			                                        <span class="icon-line-height"><img alt="Kabinen" src="/wp-content/uploads/2020/03/cabins.png"></span>
			                                        <span>'.$YachtData['cabins'].' Kabinen </span>
			                                    </li>';
			                            }

			                            if(!empty($YachtData['berth']))
			                            {
			                                echo '<li>
			                                        <span class="icon-line-height"><img alt="Kojen" src="/wp-content/uploads/2020/03/berth.png"></span>
			                                        <span>'.$YachtData['berth'].' Kojen </span>
			                                    </li>';
			                            }

			                            if(!empty($YachtData['bathrooms']))
			                            {
			                                echo '<li>
			                                    <span class="icon-line-height"><img alt="Bäder" src="/wp-content/uploads/2020/03/bath.png"></span>
			                                    <span>'.$YachtData['bathrooms'].' Bäder </span>
			                                </li>';
			                            }
			                        ?>

								</ul>
							</div>

							<div class="equipment">
								<?php								
								if($YachtData['standardEqupments'] > 0)
								{
									$ijk = 1;
									echo '<p>Ausstattung:</p> <ul>';
									foreach($YachtData['standardEqupments'] as $Equpments)
									{
										if($ijk <= 8){										
											echo '<li><img alt="'.$Equpments['name_de'].'" title="'.$Equpments['name_de'].'" src="'.$Equpments['image'].'"></li>';
											$ijk++;
										}
									}
									echo '</ul>';			
								}
								
								?>
							</div>


							<div class="from-to">
								<ul>
									<?php
										if(!empty($YachtData['district_name']) && !empty($YachtData['marina_name']) )
										{
											echo '<li><span><img alt="From" src="/wp-content/uploads/2020/04/from.png"></span>
														<span>
															<span class=" center">'.$YachtData['district_name'].' /</span>
															<span class="center">'.$YachtData['marina_name'].'</span>
														</span>
													</li>';

											echo '<li><span class="little-line"></span><span>nach</span><span class="little-line"></li>';

											echo  '<li><span><img alt="to" src="/wp-content/uploads/2020/04/to.png"></span>
														<span>
															<span class=" center">'.$YachtData['district_name'].' /</span>
															<span class="center">'.$YachtData['marina_name'].'</span>
														</span>
													</li>';
										}
									?>

								</ul>
							</div>

							<div class="map">
								<div id="googleMap" style="width:100%;height:200px;"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	</div>
</section>

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
									<img alt="images" src="'.$YachtData['images'].'" />
								</div>';
							$Countjk++;
						} 
						if(!empty($YachtData['modalImages'])) 
						{
							$totalCount = $totalCount + 1;
							echo '<div class="mySlides fade">
									<div class="numbertext">'.$Countjk.'/'.$totalCount.'</div> 
									<img alt="modal images" src="'.$YachtData['modalImages'].'" />
								</div>';
							$Countjk++;
						}
						if(!empty($YachtData['img_slider'][0])){				
							foreach($YachtData['img_slider'] as $imgSlider){
							?>
								<div class="mySlides fade">
									<div class="numbertext"><?php echo $Countjk++; ?>/<?php echo $totalCount; ?></div>
									<img alt="imgage slider" src="<?php echo $imgSlider; ?>" />
								</div>
								<?php }
						}?>
						<a class="prev" onclick="plusSlides(-1)"><img alt="arrow Left Imgage" src="<?php echo get_site_url(); ?>/wp-content/uploads/2020/06/arrowLeftImg.png" /></a>
						<a class="next" onclick="plusSlides(1)"><img alt="arrow Right Imgage" src="<?php echo get_site_url(); ?>/wp-content/uploads/2020/06/arrowRightImg.png" /></a>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<!---- End Images Gallery ---->


<div id="loader" style="display:none;">
	<svg width="200" height="200" viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg" stroke="green" aria-label="audio-loading">
		<g fill="none" fill-rule="evenodd" transform="translate(1 1)" stroke-width="2">
			<circle cx="22" cy="22" r="9.09795" stroke-opacity="0">
				<animate attributeName="r" begin="1.5s" dur="3s" values="6;22" calcMode="linear" repeatCount="indefinite"></animate>
				<animate attributeName="stroke-opacity" begin="1.5s" dur="3s" values="1;0" calcMode="linear" repeatCount="indefinite"></animate>
				<animate attributeName="stroke-width" begin="1.5s" dur="3s" values="2;0" calcMode="linear" repeatCount="indefinite"></animate>
			</circle>
			<circle cx="22" cy="22" r="17.0979" stroke-opacity="0">
				<animate attributeName="r" begin="3s" dur="3s" values="6;22" calcMode="linear" repeatCount="indefinite"></animate>
				<animate attributeName="strokeOpacity" begin="3s" dur="3s" values="1;0" calcMode="linear" repeatCount="indefinite"></animate>
				<animate attributeName="strokeWidth" begin="3s" dur="3s" values="2;0" calcMode="linear" repeatCount="indefinite"></animate>
			</circle>
			<circle cx="22" cy="22" r="2.32346">
				<animate attributeName="r" begin="0s" dur="1.5s" values="6;1;2;3;4;5;6" calcMode="linear" repeatCount="indefinite"></animate>
			</circle>
		</g>
	</svg>
</div>
<script src="https://maps.googleapis.com/maps/api/js?key=<?php echo get_option('google_map_icon_key'); ?>"></script>

<script>
	jQuery(document).ready(function() {

		/** script for extra option icon red and blue **/

		jQuery("span.tableDrop").click(function() {
			if (jQuery(this).hasClass('active_red_icon')) {
				jQuery(this).removeClass('active_red_icon');
			} else {
				jQuery(this).addClass('active_red_icon');
			}

			var iconID = jQuery(this).attr('id');
			jQuery("." + iconID).toggle();

		});

		/** script end **/

		jQuery('#bookNowOffer').click(function() {
			jQuery('#booking_status').val(1);
		});
		jQuery('#requestAnOffer').click(function() {
			jQuery('#booking_status').val(0);
		});
		jQuery('#requestAnOption').click(function() {
			jQuery('#booking_status').val(2);
		});

		jQuery(".optional-calculaiton").click(function(event) {
			var specialPrice = parseFloat(jQuery("#special_prices").val());
			var totalAmount = mandatoryPrice = 0;
			jQuery(".mandatory_price:checked").each(function() {
				mandatoryPrice += parseFloat(jQuery(this).attr('rel'));
			});
			jQuery(".optional-calculaiton:checked").each(function() {
				totalAmount += parseFloat(jQuery(this).attr('rel'));
			});
			totalAmount += specialPrice;
			totalAmount += mandatoryPrice;

			if (totalAmount == 0) {
				jQuery(".TotalAmount").val(totalAmount).text(numberFormatter(totalAmount) + "€");
			} else {
				jQuery(".TotalAmount").val(totalAmount).text(numberFormatter(totalAmount) + "€");
			}

		});
	});

	function numberFormatter(price) {
		price = parseFloat(price);
		var priceVal = price.toFixed(2);
		var priceRepVal = priceVal.replace(".", ",");
		return commafy(priceRepVal);
	}

	function commafy(num) {
		var str = num.toString().split(',');
		if (str[0].length >= 4) {
			str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1.');
		}
		if (str[1] && str[1].length >= 4) {
			str[1] = str[1].replace(/(\d{3})/g, '$1 ');
		}
		return str.join(',');
	}
</script>
<script>
	$(document).ready(function() {

		$('.accordion-toggle').on('click', function() {
			if ($(this).parent().parent().parent().find('.panel-collapse').hasClass('in')) {
				$('.accordion-img').removeClass('rotated-arrow');
			} else {
				$('.accordion-img').removeClass('rotated-arrow');
				$(this).parent().find('.accordion-img').addClass('rotated-arrow');
			}
		});

		var card = '#card';

		var redbarHeight = $('.red-navbar').outerHeight();
		var cardTop = $(card).offset().top;
		var LeftSideLeft = $('.left-side').offset().left;
		var rigthSideHeight = $('.right-side').offset().top + $('.right-side').outerHeight();
		var cardHeight = $('.card-height').outerHeight();
		var processBottom = $('.process-page').offset().top + $('.process-page').outerHeight();
		var panelBlock = $('.panel-block').offset().top;

		$('.how-it-works,.how-it-works-block .close').on('click', function() {

			setTimeout(function() {
				cardTop = $(card).offset().top;
				LeftSideLeft = $('.left-side').offset().left;
				panelBlock = $('.panel-block').offset().top;
				redbarHeight = $('.red-navbar').outerHeight();
				rigthSideHeight = $('.right-side').offset().top + $('.right-side').outerHeight();
				cardHeight = $('.card-height').outerHeight();
				processBottom = $('.process-page').offset().top + $('.process-page').outerHeight();

			}, 1000);


			return false;
		})
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

			if ($(card).hasClass('fixed-card') && $(card).hasClass('stop-card')) {

			}
			//            cardTop =  $(card).offset().top;

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

		function resizeend() {
			if (new Date() - rtime < delta) {
				setTimeout(resizeend, delta);
			} else {
				timeout = false;
				ResizeFlag = false;
			}
		}





		$('.show-all a').on('click', function() {

			setTimeout(function() {
				LeftSideLeft = $('.left-side').offset().left;
				panelBlock = $('.panel-block').offset().top;
				redbarHeight = $('.red-navbar').outerHeight();
				rigthSideHeight = $('.right-side').offset().top + $('.right-side').outerHeight();
				cardHeight = $('.card-height').outerHeight();
				processBottom = $('.process-page').offset().top + $('.process-page').outerHeight();
			}, 1000);

		});



		var lastScrollTop2 = 0;

		$(window).scroll(function() {

			var scroll = $(this).

			scrollTop();

			if (scroll > lastScrollTop2) {

				if (scroll > (processBottom - cardHeight + 50)) {
					$(card).addClass('card-stop');
					$(card).css({
						'top': 'auto!important'
					});
				}
				if (scroll + redbarHeight > cardTop) {
					var width = $('.right-side').outerWidth();
					var calcPerc = width / 100 * 94;
					$(card).css({
						'width': calcPerc
					});
					$(card).addClass('fixed-card');
				}

			} else {

				if (scroll + redbarHeight < cardTop) {
					$(card).css({
						'width': ''
					});
					$(card).removeClass('fixed-card');
				}
				if (scroll < (processBottom - cardHeight + 50)) {
					$(card).removeClass('card-stop');
				}
			}

			lastScrollTop2 = $(this).scrollTop();
		});

		$('input[type="checkbox"]').on('click', function() {
			$(this).attr('checked', true);
		});

		$('.show-all a').on('click', function(e) {

			event.preventDefault(e);
			if ($('.show-all-equipment .general').hasClass('none-important')) {
				$('.show-all-equipment .general').removeClass('none-important');
				$('.show-all img').addClass('rotated-arrow');
				$('.show-all a span').html('Hide all equipment');
			} else {
				$('.show-all-equipment .general').addClass('none-important');
				$('.show-all img').removeClass('rotated-arrow');
				$('.show-all a span').html('Show all equipment');
			}

		})


		$('.scroll-btn-panel .scroll-click').click(function(e) {
			event.preventDefault(e);
			var css = $(this).attr('class');
			var direction = css.substr(css.indexOf("click-") + 6);
			var top = $(".block" + "-" + direction).offset().top;
			$("html, body").animate({
				scrollTop: top - redbarHeight
			});
			return false;
		});


		var height = $('.animated-block').css('height');

		var lastScrollTop = 0;

		$(window).scroll(function() {
			var block = $('.animated-block').offset().top;
			if ($(this).scrollTop() > lastScrollTop) {
				if ($(this).scrollTop() > block) {

					$('.red-navbar').addClass('red-fixed');

				}

			} else {
				if ($(this).scrollTop() < block) {

					$('.search-flag').removeClass('animated-search');
					$('#search-bar').removeClass('animated-search');
					$('.red-navbar').removeClass('red-fixed');
				}
			}
			lastScrollTop = $(this).scrollTop();
		});


		$('.drop-down-1 li').hover(function() {
			$('.drop-down-1 ul li').removeClass('drop-arrow-red');

			$(this).addClass('drop-arrow-red');

			var index = $(this).index();

			var id = $('.drop-down-2 ul ').eq(index).find('.drop-arrow-red').find('a').attr('class');
			$('.drop-down-2 ul').addClass('none-important');
			$('.drop-down-2 ul ').eq(index).removeClass('none-important');

			$('.drop-down-3-block').addClass('none-important');
			$('.drop-down-3 .' + id).removeClass('none-important');
			//
		});

		$('.drop-down-2 li').hover(function() {
			$(this).parent().find('li').removeClass('drop-arrow-red');

			$(this).addClass('drop-arrow-red');

			var id = $(this).find('a').attr('class');
			$('.drop-down-3-block').addClass('none-important');
			$('.drop-down-3 .' + id).removeClass('none-important');
		});


		$('.white-line,.sailing-drop-down').hover(function() {
			$('.hover').css({
				'display': 'block'
			});
		}, function() {
			$('.hover').css({
				'display': 'none'
			});
		});


		$('.overlay').click(function(e) {
			if (!$(e.target).closest('.modal').length) {
				$('.overlay').trigger('hide');
			}
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
		})

		$('.how-it-works, .how-it-works-block .close ').on('click', function() {

			if (!$('.how-it-works').hasClass('how-it-works-active-btn')) {
				$('.how-it-works').addClass('how-it-works-active-btn');
			} else {
				$('.how-it-works').removeClass('how-it-works-active-btn');
			}

			$('body,html').animate({
				scrollTop: '0px'
			}, 1000);

		});

		var searchInit = 0;
		var navInit = 0;
		var lastScrollTop2 = 0;

		$(window).scroll(function() {

			var howIt = $('.how-it-works-block').offset().top + $('.how-it-works-block').outerHeight();

			var nav = $('nav').offset().top;

			if ($(this).scrollTop() > lastScrollTop2) {
				if ($('.how-it-works').hasClass('how-it-works-active-btn') && $(this).scrollTop() > howIt) {
					$('.how-it-works').removeClass('how-it-works-active-btn');
					$(".how-it-works-block").slideToggle("slow", function() {});
				}
			} else {
				if ($(this).scrollTop() <= $('.block-for-nav').offset().top) {
					$('nav').removeClass('nav-fixed');
				}
			}
			lastScrollTop2 = $(this).scrollTop();
		})



		// google map icon
		myMap();

		function myMap() {
			var myLatLng = {
				lat: <?php echo $YachtData['latitude']; ?> ,
				lng : <?php echo $YachtData['longitude']; ?>
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
		if (n > slides.length) {
			slideIndex = 1
		}
		if (n < 1) {
			slideIndex = slides.length
		}
		for (i = 0; i < slides.length; i++) {
			slides[i].style.display = "none";
		}
		for (i = 0; i < dots.length; i++) {
			dots[i].className = dots[i].className.replace(" active", "");
		}
		slides[slideIndex - 1].style.display = "block";
		dots[slideIndex - 1].className += " active";
	}
</script>
<style>
	body.modal-open {
		overflow-y: hidden;
	}

	.offerPage #card .equipment ul img {
		width: 35px;
	}
</style>
<?php
get_footer();
?>