<?php 
/*Template Name: Feedback */

get_header();

global $wpdbpro;
$whereReviews = " customer_oid_fk != '-1' and status = 1 and language = 0 ";
$limit = 20;

/*===== Total reviews ===========*/
$wpdbpro->get_results("select * from objectvoting where $whereReviews ");
$total_objectvoting = $wpdbpro->num_rows;

/*===== Average reviews ===========*/
$avg_voting = $wpdbpro->get_results("select avg(voting_value) as avg_voting from objectvoting where $whereReviews ");

/*===== Yachts reviews ===========*/
$wpdbpro->get_results("select * from objectvoting where $whereReviews and class_index = 3");
$yachts_objectvoting = $wpdbpro->num_rows;

/*===== Modal reviews ===========*/
$wpdbpro->get_results("select * from objectvoting where $whereReviews and class_index = 2");
$modal_objectvoting = $wpdbpro->num_rows;

/*===== Marina reviews ===========*/
$wpdbpro->get_results("select * from objectvoting where $whereReviews and class_index = 5");
$marina_objectvoting = $wpdbpro->num_rows;

/*===== Region reviews ===========*/
$wpdbpro->get_results("select * from objectvoting where $whereReviews and class_index = 7 ");
$region_objectvoting = $wpdbpro->num_rows;

/*===== Charter company reviews ===========*/
$wpdbpro->get_results("select * from objectvoting where $whereReviews and class_index = 6 and object_oid_fk != 65142 ");
$company_objectvoting = $wpdbpro->num_rows;

/*===== Service reviews ===========*/
$wpdbpro->get_results("select * from objectvoting where $whereReviews and class_index = 6 and object_oid_fk = 65142 ");
$service_objectvoting = $wpdbpro->num_rows;
?>
<div class="max-width">
    <div class="bread-crumbs">
        <ul>
            <li>
                <a href="<?php echo get_site_url(); ?>">Home</a>
            </li>
            <li>→</li>
            <li>
                <a class="current-page">Kundenbewertungen</a>
            </li>
        </ul>
    </div> 
	<div class="search-page" style="width: 100%;">
		<h1 style="display:none;">Yachten Bewertungen (<?php echo $total_objectvoting; ?>)</h1>
		<h2>Kundenbewertungen</h2>
		<section class="max-width">				
			<div class="scroll-btn-panel">
				<h3>Yachten Bewertungen (<?php echo $total_objectvoting; ?> Bewertungen insgesamt, durchschnittlich <?php echo round($avg_voting[0]->avg_voting,2); ?> Sterne)</h3>
				<div class="scroll-flag">
					<ul>
						<li class="active-panel"><a class="scroll-click click-yacht" href="javascript:void(0)">Yachten (<?php echo $yachts_objectvoting; ?>)</a></li>
						<li><a class="scroll-click click-model" href="javascript:void(0)">Yachtmodell (<?php echo $modal_objectvoting; ?>)</a></li>
						<li><a class="scroll-click click-marinas" href="javascript:void(0)">Marina (<?php echo $marina_objectvoting; ?>)</a></li>
						<li><a class="scroll-click click-cities" href="javascript:void(0)">Region (<?php echo $region_objectvoting; ?>)</a></li>
						<li><a class="scroll-click click-company" href="javascript:void(0)">Vercharterer (<?php echo $company_objectvoting; ?>)</a></li>
						<li><a class="scroll-click click-sеrvices" href="javascript:void(0)">Unser Service (<?php echo $service_objectvoting; ?>)</a></li>
					</ul>
				</div>	
			</div>
			<div>
				<div id="js"></div>
			</div>
			<section class="panel-choise">
				<h3>Bewertungen</h3>

				<div class="block-yacht active" >
					<?php include("feedback/yachts.php"); ?>				   
				</div>
			
				<div class="block-model none" >
					<?php include("feedback/model.php"); ?>					
				</div>

				<div class="block-marinas none" >
					<?php include("feedback/marina.php"); ?>					
				</div>

				<div class="block-cities none" >
					<?php include("feedback/region.php"); ?>				 
				</div>

				<div class="block-company none" >
					<?php include("feedback/company.php"); ?>				 
				</div>

				<div class="block-sеrvices none" >
					<?php include("feedback/sеrvices.php"); ?>				 
				</div>
				
			</section>		
		</section>
	</div>
</div>
<div id="loader" rel="" style="display:none;">
	<svg width="200" height="200" viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg" stroke="green" aria-label="audio-loading"><g fill="none" fill-rule="evenodd" transform="translate(1 1)" stroke-width="2"><circle cx="22" cy="22" r="9.09795" stroke-opacity="0"><animate attributeName="r" begin="1.5s" dur="3s" values="6;22" calcMode="linear" repeatCount="indefinite"></animate><animate attributeName="stroke-opacity" begin="1.5s" dur="3s" values="1;0" calcMode="linear" repeatCount="indefinite"></animate><animate attributeName="stroke-width" begin="1.5s" dur="3s" values="2;0" calcMode="linear" repeatCount="indefinite"></animate></circle><circle cx="22" cy="22" r="17.0979" stroke-opacity="0"><animate attributeName="r" begin="3s" dur="3s" values="6;22" calcMode="linear" repeatCount="indefinite"></animate><animate attributeName="strokeOpacity" begin="3s" dur="3s" values="1;0" calcMode="linear" repeatCount="indefinite"></animate><animate attributeName="strokeWidth" begin="3s" dur="3s" values="2;0" calcMode="linear" repeatCount="indefinite"></animate></circle><circle cx="22" cy="22" r="2.32346"><animate attributeName="r" begin="0s" dur="1.5s" values="6;1;2;3;4;5;6" calcMode="linear" repeatCount="indefinite"></animate></circle></g></svg>
</div>
<input type='hidden' id='active_tab' value='yacht' />
<input type='hidden' id='limit' value='<?php echo $limit; ?>' />
<input type='hidden' id='yacht_pagination' value='1' />
<input type='hidden' id='model_pagination' value='1' />
<input type='hidden' id='marinas_pagination' value='1' />
<input type='hidden' id='cities_pagination' value='1' />
<input type='hidden' id='company_pagination' value='1' />
<input type='hidden' id='sеrvices_pagination' value='1' />
<script>

function feedbackAjax(pagination,active_tab){
	
	var limit = $('#limit').val();
	$('#loader').show();
	$.ajax({
		type:'POST',
		url: ajaxurl,
		data: { active_tab: active_tab, pagination : pagination , action : 'feedback_ajax', limit : limit },
		success: function(resp){
			$('#loader').attr('rel','');
			$('#loader').hide();
			if((pagination == '' || typeof pagination === "undefined")){
				$('.search-page .ajax-'+active_tab).html(resp);
			}else{
				$('.search-page .ajax-'+active_tab).append(resp);
			}
		},
	});	
}

$(window).scroll(function(){
	var Totalheight = $(document).height()-500;	
    var scrollbody = $(window).scrollTop();
	var windowHeight = $(window).height();
	var getHeight = windowHeight+scrollbody;
	var refLod = $('#loader').attr('rel');
	var active_tab = $('#active_tab').val();
	
	if(Totalheight <= getHeight && (refLod == '' || typeof refLod === "undefined"))
	{
		$('#loader').attr('rel','yes');
		pagination = parseInt($('#'+active_tab+'_pagination').val())+1;
		$('#'+active_tab+'_pagination').val(pagination);
		feedbackAjax(pagination,active_tab);		
	}
	
});
</script>
<script>
$(document).ready(function(){
	
	$(document).on('click','.readmore',function(){
		var commentId = $(this).attr('alt');
		$('.readmore_'+commentId).hide();
		$('.readless_'+commentId).show();
	});
	
	$('.scroll-btn-panel .scroll-click').click( function (e) {
		event.preventDefault(e);
		var css = $(this).attr('class');
		var direction = css.substr(css.indexOf("click-") + 6);
		
		$('#active_tab').val(direction);
		$('.active-panel').removeClass('active-panel');
		$(this).parent().addClass('active-panel');
		$('.scroll-btn-panel').attr('class','scroll-btn-panel');		
		$('.panel-choise > div').removeClass('none').addClass('none').removeClass('active');
		$(".block"+"-"+direction).removeClass('none').addClass('active');
		$('.scroll-btn-panel').addClass('after-'+$(this).parent().index());
		return false;
	});
	

	
	$(document).on('click','.ratingVote',function(){		
		$(this).addClass('active');
		var relId = $(this).attr('rel');		
		$(".yes"+relId).attr('disabled',true);
		$(".no"+relId).attr('disabled',true);
	});
});
</script>
<?php 
get_footer();