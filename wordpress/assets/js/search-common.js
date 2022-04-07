$(document).ready(function() {
	
	/***grid list****/
	$('.tile-view,.list-view').on('click',function(e){
		$('.view-icon').removeClass('active-view');
		if($(this).hasClass('tile-view')){
			$(this).find('.view-icon').addClass('active-view');
			$('.flex-custom').attr('id','list')
		}
		if($(this).hasClass('list-view')){
			$(this).find('.view-icon').addClass('active-view');
			$('.flex-custom').attr('id','')
		}
		event.preventDefault(e);
	});
	//*****end****/

	/********* pricr dropdown****/
	$('.search-select123').each(function() {

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
			'class': 'options sorting',
			'style' : 'z-index: 0;'
		}).insertAfter($styledSelect);

		// Insert a list item into the unordered list for each select option
		for (var i = 0; i < numberOfOptions; i++) {
			$('<li />', {
				text: $this.children('option').eq(i).text(),
				alt : $this.children('option').eq(i).attr('alt'),
				rel: $this.children('option').eq(i).val()
			}).appendTo($list);
		}

		// Cache the list items
		var $listItems = $list.children('li');

		// Show the unordered list when the styled div is clicked (also hides it if the div is clicked again)
		$styledSelect.click(function(e) {
			e.stopPropagation();
			$('div.styledSelect.active').each(function() {
				$(this).removeClass('active').next('ul.options').css('visibility','hidden');
				$('.search-flag').removeClass('zIndex-60');
			});
			$(this).toggleClass('active').next('ul.options').css('visibility','visible');
			$('.search-flag').addClass('zIndex-60');
		});

		// Hides the unordered list when a list item is clicked and updates the styled div to show the selected list item
		// Updates the select element to have the value of the equivalent option
		$listItems.click(function(e) {
			e.stopPropagation();
			$styledSelect.text($(this).text()).removeClass('active');
			$this.val($(this).attr('rel'));
			$list.css('visibility','hidden');
			
			console.log($(this).attr('rel'));
			// alert($(this).attr('rel'));
			
			$('#orderName').val($(this).attr('rel'));
			$('#orderBy').val($(this).attr('alt'));
			$('ul.sorting li').removeClass('activate');
			$(this).addClass('activate');
			
			$('#pagination').val(1);
			searchFormFilter(1);
		});	
		// Hides the unordered list when clicking outside of it
		$(document).click(function() {
			$styledSelect.removeClass('active');
			$list.css('visibility','hidden');
			$('.search-flag').removeClass('zIndex-60');

		});

	});
	/******end*********/


});