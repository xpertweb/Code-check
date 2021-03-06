$(document).ready(function () {
	'use strict';
	
	$('.crew_datetimepicker').datetimepicker({
		format: 'd-m-Y H:i',
		minDate: '0'
	});
	$('.crew_datepickers').datetimepicker({
		format: 'd-m-Y',
		timepicker: false,
		minDate: '0'
	});
	$('.crew_timepickers').datetimepicker({
		format: 'H:i',
		datepicker: false,
		minDate: '0'
	});
	$('.crew_birthdate').datetimepicker({
		format: 'd-m-Y',
		timepicker: false,
		maxDate: '0'
	});
	
	/*  Autoload ajax destination */
	var DistrictSearch = $('#DistrictSearch').val();	
	$.ajax({
		type: 'POST',
		url: ajaxurl,
		data: {
			action: "get_load_tags",
			DistrictSearch: DistrictSearch
		},
		success: function (resp) {
			if (resp) {
				$("#destinationDropDown").html(resp);
			}
		},
	});
	

	/* get country region address start*/
	var typingTimer;
	var doneTypingInterval = 500;
	var $input = $('#tags');

	//on keyup, start the countdown
	$input.on('keyup', function () {
		clearTimeout(typingTimer);
		typingTimer = setTimeout(doneTyping, doneTypingInterval);
	});

	//on keydown, clear the countdown 
	$input.on('keydown', function () {
		clearTimeout(typingTimer);
	});

	function doneTyping() {
		var tags = $($input).val();
		var DistrictSearch = $('#DistrictSearch').val();
		if(tags.length > 0){
			$("#destinationDropDown").show().html("<img src='/wp-content/uploads/2020/03/loader.gif' style='width:30px;text-align:center;' />");
			$.ajax({
				type: 'POST',
				url: ajaxurl,
				data: {
					action: "get_tags_address",
					tags: tags,
					DistrictSearch: DistrictSearch
				},
				success: function (resp) {
					if (resp) {
						$("#destinationDropDown").html(resp);
						$("#paginationFilter").val('a');
					}
				},
			});		
		}
	}

	$('.noPageFound').click(function () {
		$('#myModal').modal('show');
		setTimeout(function () {
			$('#myModal').modal('hide');
		}, 5000);
	});

	$('.close').click(function () {
		$('#myModal').modal('hide');
	});

	$(document).on('click', '.checkboxTags', function () {		

		var Check_keys = $(this).attr('id');
		var Check_value = $(this).attr('rel');
		var Check_type = $(this).attr('alt');
		var flagSlug = $(this).attr('data');
	
		var ischecked = $(this).is(':checked');
		if (!ischecked) {
			$('.selectedDestinationType').removeClass('checkss');
			$('#destinationAlready .' + Check_keys).remove();
			$('#destinationDropDown .' + Check_keys).show();
			$('#destinationSearchHidden #' + Check_keys).remove();
		} else {
			
			if(Check_type != 'country'){
				var ImagePath = site_url + '/wp-content/themes/twentytwenty-child/assets/svg/'+Check_type+'.svg';
			}else{
				var ImagePath = site_url + '/wp-content/themes/twentytwenty-child/assets/svgFlag/'+flagSlug+'.svg';
			}
			
			$('#destinationAlready').append('<li class="'+Check_keys+'" ><div class="liField"><div class="filedIcon"><img src="' + ImagePath +'" style="width: 20px;" /></div><div class="filedTextValue"><label class="searchCheckBox">'+Check_value+'<input type="checkbox" checked class="checkboxTags" alt="'+Check_type+'" rel="'+Check_value+'" value="1" id="'+Check_keys+'" ><span class="checkmark"></span></label></div></div></li>');
			$('#destinationDropDown .' + Check_keys).hide();
			$('.selectedDestinationType').addClass('checkss');
			$('#destinationSearchHidden').append("<li id='" + Check_keys + "'>" + Check_value + "</li>");
		}
		
		$(this).prop('checked', false);	

		var checkCount = 0;
		var DistrictSearch = '';
		var DistrictSearchHtml1 = '';
		var DistrictSearchValue = '';
		$('#destinationSearchHidden li').each(function () {
			checkCount++;
			var htmKeys = $(this).attr('id');
			var htmValues = $(this).html();
			
			DistrictSearchHtml1 += '<div class="selectedDesti"><div class="selectedDestiBox"><h4 class="selectedTextDesti">' + htmValues + '</h4><span class="selectedCross"><img src="' + site_url + '/wp-content/themes/twentytwenty-child/assets/images/cross.png" class="deleteDestType" rel="' + htmKeys + '" /></span></div></div>';

			DistrictSearchValue += htmValues+',';

			if (DistrictSearch.length != 0) {
				DistrictSearch += ',' + $(this).attr('id');
			} else {
				DistrictSearch += $(this).attr('id');
			}
		});

		$('.selectedDestinationType').html(DistrictSearchHtml1);
		$('#tags').val('').focus();
		$('#DistrictSearchValue').val(DistrictSearchValue);
		$('#ui-id-1').hide();
		$('#DistrictSearch').val(DistrictSearch);
		
		if ($('.selectedDesti').length < 1) {
			$('.selectedDestination').removeClass('destOnechild');
			$('#alreadyUpper').hide();
			$('#tags').attr('placeholder','Grafschaft, Stadt, Hafen');			
		}else{
			$('.selectedDestination').addClass('destOnechild');
			$('#alreadyUpper').show();
			$('#tags').attr('placeholder','');
		}
		
		var pageId = $('#pageId').val(); 
		if(pageId == '12447'){
			searchFormFilter(1);
			$('.homeNewfield').removeClass('intro');
		}
		
	});
	
	$('.cabinDropdownList li').click(function(){
		var cabin = $(this).attr('rel');
		$('#cabin_max').val(cabin);
	});
	
	$('.service_type').click(function(){
		$('.searchHeadBtn ul li').removeClass('active');
		$(this).parent().addClass('active');
	});
	
	$(document).on('click', '.deleteDestType', function () {
		var removeItem = $(this).attr('rel');
		var DistrictSearch = $('#DistrictSearch').val().split(',');
		DistrictSearch = jQuery.grep(DistrictSearch, function (value) {
			return value != removeItem;
		});
		$('#DistrictSearch').val(DistrictSearch.join(','));
		$('#destinationSearchHidden #' + removeItem).remove();
		$('#' + removeItem).trigger('click');
		$(this).parent().parent().parent().remove();
	});


	$(document).mouseup(function (e) {
		var container = $("#ui-id-1");
		if (!container.is(e.target) && container.has(e.target).length === 0) {
			container.hide();
		}
	});
	
	$('#boats').click(function () {
		$('#ui-id-boats').show();
	});
	
	$(document).mouseup(function (e) {
		var container = $("#ui-id-boats");
		if (!container.is(e.target) && container.has(e.target).length === 0) {
			container.hide();
		}
	});

	$(document).on('click', '.deleteBoatType', function () {
		if ($('.selectedBoat').length <= 1) {
			$('.selectedBoats').removeClass('multipless');
		}
		var removeItem = $(this).attr('rel');
		var YachtTypesSearch = $('#YachtTypesSearch').val().split(',');
		YachtTypesSearch = jQuery.grep(YachtTypesSearch, function (value) {
			return value != removeItem;
		});
		$('#boots_value_' + removeItem).trigger('click');
		if(removeItem == 'mono_0' || removeItem == 'kat_0' || removeItem == 'kat_1' || removeItem == 'mono_1'){
			$('input[value="' + removeItem + '"]').trigger('click');
		}
		$('#YachtTypesSearch').val(YachtTypesSearch.join(','));
		$(this).parent().parent().parent().remove();
	});

	$(document).on('click', '.checkboxBoats', function () {

		var valueBoat = $(this).attr('rel');
		var idBoat = $(this).val();

		if ($(this).prop("checked") == true) {
			$(this).prop('checked', true);
		} else {
			$(this).prop('checked', false);
		}
		
		var checkCount = 0;
		var BoatsSearch = '';
		var BoatsSearchHtml = '';
		var BoatsSearchValue = '';
		
		var ischecked = $(this).is(':checked');
		if (!ischecked) {
			$('#boatTypeUl #' + idBoat).remove();
			$('.selectedBoatsType').removeClass('checkss');
		} else {
			$('.selectedBoatsType').addClass('checkss');
			$('#boatTypeUl').append("<li id='" + idBoat + "'>" + valueBoat + "</li>");
		}
		

		$('#boatTypeUl li').each(function () {
			checkCount++;
			
			var htmKeys = $(this).attr('id');
			var htmValues = $(this).html();

			BoatsSearchHtml += '<div class="selectedBoat"><div class="selectedBoatsBox"><h4 class="selectedTextBoats">' + htmValues + '</h4><span class="selectedCross"><img src="' + site_url + '/wp-content/themes/twentytwenty-child/assets/images/cross.png" class="deleteBoatType" rel="' + htmKeys + '" /></span></div></div>';
			
			BoatsSearchValue += htmValues + ',';

			if (BoatsSearch.length != 0) {
				BoatsSearch += ',' + htmKeys;
			} else {
				BoatsSearch += htmKeys;
			}

		});
		$('.selectedBoats .selectedBoatsType').html(BoatsSearchHtml);
		$('#YachtTypesSearch').val(BoatsSearch);
		$('#boats_type').val(BoatsSearchValue);
		
		if ($('.selectedBoat').length < 1) {
			$('.selectedBoats').removeClass('multipless');
			$('.flip3').attr('placeholder','Bootstyp');	
		}else{
			$('.selectedBoats').addClass('multipless');
			$('.flip3').attr('placeholder','');	
		}
	});

	$('#duration').click(function () {
		$('#ui-id-period').show();
	});

	$(document).mouseup(function (e) {
		var container = $("#ui-id-period");
		if (!container.is(e.target) && container.has(e.target).length === 0) {
			container.hide();
		}
	});

	$(document).on('click', '.checkboxPeriod', function () {
		//var ischecked = $(this).is(':checked');
		if ($(this).prop("checked") == true) {
			$(this).prop('checked', true);
		} else {
			$(this).prop('checked', false);
		}
		var checkCount = 0;
		var PeriodSearch = '';
		var PeriodSearchHtml = '';
		$('.checkboxPeriod:checkbox:checked').each(function () {
			checkCount++;
			if (checkCount >= 3) {
				PeriodSearchHtml = checkCount + ' alle ausgew??hlt';
			} else {
				PeriodSearchHtml += $(this).parent().children('div').html() + ',';
			}

			if (PeriodSearch.length != 0) {
				PeriodSearch += ',' + $(this).val();
			} else {
				PeriodSearch += $(this).val();
			}

		});
		$('#duration').val(PeriodSearchHtml);
		$('#YachtPeriodSearch').val(PeriodSearch);

	});
	$('#persons').click(function () {
		$('#ui-id-persons').show();
	});
	/* $(document).on("click", function(event){
	     var $trigger = $(".dropdownsperson");
	     if($trigger !== event.target && !$trigger.has(event.target).length){
	         $("#ui-id-persons").hide();
	     }            
	 });*/
	$(document).mouseup(function (e) {
		var container = $("#ui-id-persons");
		if (!container.is(e.target) && container.has(e.target).length === 0) {
			container.hide();
		}
	});
	$(document).on('click', '.checkboxPersons', function (e) {
		e.stopPropagation();
		if ($(this).prop("checked") == true) {
			$(this).prop('checked', true);
		} else {
			$(this).prop('checked', false);
		}
		var checkCount = 0;
		var PersonsSearch = '';
		var PersonsSearchHtml = '';
		$('.checkboxPersons:checkbox:checked').each(function () {
			checkCount++;
			if (checkCount >= 3) {
				PersonsSearchHtml = checkCount + ' ausgew??hlt';
			} else {
				PersonsSearchHtml += $(this).parent().children('div').html() + ',';
			}

			if (PersonsSearch.length != 0) {
				PersonsSearch += ',' + $(this).val();
			} else {
				PersonsSearch += $(this).val();
			}

		});
		$('#persons').val(PersonsSearchHtml);
		$('#PersonsSearch').val(PersonsSearch);

	});

	/* get country region address end*/

	/** select equipment values for filter start **/

	$(document).on('click', '.checkboxEquipment', function () {

		if ($(this).prop("checked") == true) {
			$(this).prop('checked', true);
		} else {
			$(this).prop('checked', false);
		}

		var EuipmentSearch = '';
		$(':checkbox:checked').each(function (i) {
			if (EuipmentSearch.length != 0) {
				EuipmentSearch += ',' + $(this).val();
			} else {
				EuipmentSearch += $(this).val();
			}
		});
		$('#EuipmentSearchOption').val(EuipmentSearch);

	});

	/** select equipment values for filter End **/






	var $datepicker = $('#datepicker');

	$datepicker.datepicker({
		numberOfMonths: 1,
		minDate: "+7d",
		defaultDate: '',
		dateFormat: 'dd.mm.yy',
		beforeShowDay: function (date) {
			var show = true;
			if (date.getDay() == 0 || date.getDay() == 1 || date.getDay() == 2 || date.getDay() == 3 || date.getDay() == 4 || date.getDay() == 5) show = false
			return [show];
		},
		onSelect: function (date) {
			$('.input-picker').attr('value', date);
		}
	});
	// $('.input-picker').attr('value', $('#datepicker').val());

	$(".dateofbirth").datepicker({
		changeMonth: true,
		changeYear: true,
		maxDate: '0',
		dateFormat: 'dd-mm-yy'
	});

	$(".checkIn").datepicker({
		numberOfMonths: 2,
		minDate: "+7d",
		dateFormat: 'dd.mm.yy',
		beforeShowDay: function (date) {
			var show = true;
			if (date.getDay() == 0 || date.getDay() == 1 || date.getDay() == 2 || date.getDay() == 3 || date.getDay() == 4 || date.getDay() == 5) show = false
			return [show];
		}
	});


	// Iterate over each select element
	$('.search-select').each(function () {

		// Cache the number of options
		var $this = $(this),
			numberOfOptions = $(this).children('option').length;

		// Hides the select element
		$this.addClass('s-hidden');

		// Wrap the select element in a div
		$this.wrap('<div class="select"></div>');

		// Insert a styled div to sit over the top of the hidden select element
		$this.after('<div class="styledSelect"></div>');

		// Cache the styled div
		var $styledSelect = $this.next('div.styledSelect');

		// Show the first select option in the styled div
		$styledSelect.text($this.children('option').eq(0).text());

		// Insert an unordered list after the styled div and also cache the list
		var $list = $('<ul />', {
			'class': 'options'
		}).insertAfter($styledSelect);

		// Insert a list item into the unordered list for each select option
		for (var i = 0; i < numberOfOptions; i++) {
			$('<li />', {
				text: $this.children('option').eq(i).text(),
				rel: $this.children('option').eq(i).val()
			}).appendTo($list);
		}

		// Cache the list items
		var $listItems = $list.children('li');

		// Show the unordered list when the styled div is clicked (also hides it if the div is clicked again)
		$styledSelect.click(function (e) {
			e.stopPropagation();
			$('div.styledSelect.active').each(function () {
				$(this).removeClass('active').next('ul.options').css('visibility', 'hidden');
				$('body .search-flag ').removeClass('zIndex-60');

			});
			$(this).toggleClass('active').next('ul.options').css('visibility', 'visible');
			$('body .search-flag ').addClass('zIndex-60');

		});

		// Hides the unordered list when a list item is clicked and updates the styled div to show the selected list item
		// Updates the select element to have the value of the equivalent option
		$listItems.click(function (e) {
			e.stopPropagation();
			$styledSelect.text($(this).text()).removeClass('active');
			$this.val($(this).attr('rel'));
			$list.css('visibility', 'hidden');
			$('body .search-flag ').removeClass('zIndex-60');
			/* alert($this.val()); Uncomment this for demonstration! */
		});





		// Hides the unordered list when clicking outside of it
		$(document).click(function () {
			$styledSelect.removeClass('active');
			$list.css('visibility', 'hidden');
			$('body .search-flag').removeClass('zIndex-60');

		});

		/* $('.subDropdowns').click(function(e) {
           e.preventDefault();
           $('.subDropdowns').find('.ul-home-persons').addClass('showing');
         });*/

	});

	$('.overlay#sign-up').overlay();

	$(".nav-dropdown li").hover(function () {

		if ($(this).index() == 1) {
			$('.little-triangle').css({
				'border-bottom-color': "#f7f7f7"
			});
		}
	}, function () {
		$('.little-triangle').css({
			"border-bottom-color": 'white'
		});
	});

	$(".slides").slidesjs({
		width: 940,
		height: 528
	});


	$('.carousel').carousel({
		interval: 0
	})
	$('#Carousel').carousel({
		interval: 0
	})

	$('#Carousel1').bind('slide.bs.carousel', function (e) {

		setTimeout(explode, 100);

		function explode() {


			$("body .slides1").slidesjs({
				width: 940,
				height: 528
			});

		}
	});


	$('.boats,.regions').click(function () {

		if ($('.boats-block ').hasClass('none-important')) {
			$('.articles-slider').css({
				'height': $('.resize-block').eq(1).outerHeight()
			});
		} else {
			$('.articles-slider').css({
				'height': $('.resize-block').eq(0).outerHeight()
			});
		}
		if ($(this).hasClass('boats')) {

			$('.regions').removeClass('btn-active');
			$(this).addClass('btn-active');
			$('.regions-block').addClass('none-important');
			$('.boats-block').removeClass('none-important');
		} else {
			$('.boats').removeClass('btn-active');
			$(this).addClass('btn-active');
			$('.regions-block').removeClass('none-important');
			$('.boats-block').addClass('none-important');
		}

	});
	
	//        $('.articles-slider').css({'height':$('.resize-block').eq(1).outerHeight()});
	//        $('.nav-fixed-flag').css({'height':$('nav').outerHeight()});

	$(window).resize(function () {

		$('.nav-fixed-flag').css({
			'height': $('nav').outerHeight()
		});

		if ($('.boats-block ').hasClass('none-important')) {
			$('.articles-slider').css({
				'height': $('.resize-block').eq(1).outerHeight()
			});
		} else {
			$('.articles-slider').css({
				'height': $('.resize-block').eq(0).outerHeight()
			});
		}


	})



	$('.drop-down-1 li').hover(function () {
		$('.drop-down-1 ul li').removeClass('drop-arrow-red');

		$(this).addClass('drop-arrow-red');
		var index = $(this).index();
		var id = $('.drop-down-2 ul ').eq(index).find('.drop-arrow-red').find('a').attr('class');
		$('.drop-down-2 ul').addClass('none-important');
		$('.drop-down-2 ul ').eq(index).removeClass('none-important');

		$('.drop-down-3-block').addClass('none-important');
		$('.drop-down-3 .' + id).removeClass('none-important');
	})

	$('.drop-down-2 li').hover(function () {
		$(this).parent().find('li').removeClass('drop-arrow-red');

		$(this).addClass('drop-arrow-red');

		var id = $(this).find('a').attr('class');
		$('.drop-down-3-block').addClass('none-important');
		$('.drop-down-3 .' + id).removeClass('none-important');
	})
	$('.drop-down-1 li').hover(function () {
		$('.drop-down-1 ul li').removeClass('drop-arrow-color');
		$(this).addClass('drop-arrow-color');
		var index = $(this).index();
		var id = $('.drop-down-2 ul ').eq(index).find('.drop-arrow-color').find('a').attr('class');
		$('.drop-down-2 ul').addClass('none-important');
		$('.drop-down-2 ul ').eq(index).removeClass('none-important');

		$('.drop-down-3-block').addClass('none-important');
		$('.drop-down-3 .' + id).removeClass('none-important');
	})

	$('.drop-down-2 li').hover(function () {
		$(this).parent().find('li').removeClass('drop-arrow-color');
		$(this).addClass('drop-arrow-color');

		var id = $(this).find('a').attr('class');
		$('.drop-down-3-block').addClass('none-important');
		$('.drop-down-3 .' + id).removeClass('none-important');
	})

	$('.sailing-drop-down').hover(function () {
		$("#menu-red-menu").find(".white-line").addClass('drop-arrow-active');
	})
	$('.sailing-drop-down').mouseleave(function () {
		$("#menu-red-menu").find(".white-line").removeClass('drop-arrow-active');
	})


	$('.white-line,.sailing-drop-down').hover(function () {
		$('.hover').css({
			'display': 'block'
		});
		$('.sailing-drop-down').css('visibility', 'visible', '!important');
	}, function () {
		$('.hover').css({
			'display': 'none'
		});
		$('.sailing-drop-down').css('visibility', 'hidden');
	});




	$('.red-navbar ul li:nth-of-type(2)').hover(function () {

	})





	$('.rating').rating('rate', '5');



	$('.overlay').click(function (e) {
		if (!$(e.target).closest('.modal').length) {
			$('.overlay').trigger('hide');
		}
	})


	$('.extended-click').click(function () {

		if (!$(this).find('img').hasClass('rotated-arrow'))
			$(this).find('img').addClass('rotated-arrow');
		else
			$(this).find('img').removeClass('rotated-arrow');

	})

	$('body .nav-dropdown li').on('click', function () {

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

	$('.how-it-works, .how-it-works-block .close ').on('click', function () {

		if (!$('.how-it-works').hasClass('how-it-works-active-btn')) {
			$('.how-it-works').addClass('how-it-works-active-btn');
		} else {
			$('.how-it-works').removeClass('how-it-works-active-btn');
		}

		//        $('body').animate({scrollTop:'0px'},100);
		$('body,html').animate({
			scrollTop: '0px'
		}, 1000);

	});

	var searchInit = 0;
	var lastScrollTop = 0;

	$(window).scroll(function () {
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
		var scroll = $(this).scrollTop();
		var searchOuther = $('.search-fixed').outerHeight();
		var redbar = $('.flag-redbar').offset().top;

		if (scroll > lastScrollTop) {


			if (scroll >= searchBar && !$('.search-flag').hasClass('search-fixed')) {
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

			var search_fixed = $('.search-flag').outerHeight();
			var scroll_sum = parseInt(search_fixed) + parseInt(scroll);		

			if (scroll + $('.search-fixed').outerHeight() >= redbar) {
				$('.red-navbar').addClass('red-fixed');
				$('.animated-block.has-searchBar').addClass('top-fixes');
				$('.how-it-works-block').hide();
			}


			if ($('.how-it-works').hasClass('how-it-works-active-btn') && $(this).scrollTop() > howIt) {
				$('.how-it-works').removeClass('how-it-works-active-btn');
				$(".how-it-works-block").slideToggle("slow", function () {});
			}

		} else {

			if($(".block-for-search").length != 0) {
				var blockforsearch = $('.block-for-search').offset().top;
			}else{
				var blockforsearch = 0;
			}
			
			if (scroll < blockforsearch) {
				$('.search-flag').removeClass('search-fixed');
				$('.animated-block.has-searchBar').removeClass('top-fixes');
			}


			if ((scroll + searchOuther) <= redbar) {
				$('.red-navbar').removeClass('red-fixed');
			}
		}
		lastScrollTop = $(this).scrollTop();
	})
})