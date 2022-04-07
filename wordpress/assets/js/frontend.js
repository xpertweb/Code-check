$(document).ready(function(){
	
	$('.how_it_works_close').click(function(){
		$(".how-it-works-block").slideToggle( "slow", function() {});
		//return false;
	});

	$('.how-it-works').click(function(){
		$('.how-it-works-block').slideToggle( 'slow', function() {});
		//return false;
	});

	$('.sign-up').click(function(){
		$('.overlay#sign-up').overlay();
		//return false;
	});

	$('.log-in').click(function(){
		$('.overlay#log-in').overlay();
		//return false;
	});
	
	$('.sign_up_country').change(function(){
		
		var sign_up_country = $(this).val();
		$.ajax({
			type:'POST',
			url: ajaxurl+"?action=stateby_country",
			data: {sign_up_country : sign_up_country},
			success: function(resp){
				$('.sign_up_state').html(resp);
			},
		});
	});

	$('.extended-click').click(function (){

		if(!$(this).find('img').hasClass('rotated-arrow'))
			$(this).find('img').addClass('rotated-arrow');
		else
			$(this).find('img').removeClass('rotated-arrow');

	});
	$(".slides").slidesjs({
            width: 940,
            height: 528
        });


	// User Registration script desktop
	$('#Reg_Form_Popup').validate({
		rules: {
			email: {
				required: true,
				email: true
			},
			name: {
				minlength: 3,
				required: true
			},
			lastname: {
				minlength: 3,
				required: true
			},
			phone: {
				number: true,
				minlength: 10,
				maxlength: 12
			},			
			password: {
				required: true,
				minlength: 6
			},
			ConfirmPassword: {
				required: true,
				equalTo: '#password'
			},
			privacy : {
				required: true
			}
		},
		messages: {
			email: {
				required: "Email is Required.",
				email: "Enter valid email."
			},
			name: "First Name is Required",
			lastname: "Last Name is Required",
			phone: {
				required : "Phone is Required",
				number : "Phone should be numeric and valid format.",
			},
			password: "Password is Required",
			ConfirmPassword: {
				required : "Confirm Password is Required",
				equalTo : "Confirm Password and password should be match",
			},
			privacy: "Privacy is Required",
		},
		submitHandler: function (form) {
			
			var userdata = $("#Reg_Form_Popup").serialize();
			$(".errorRegister").hide();
			
			$.ajax({
				type:'POST',
				url: ajaxurl+"?action=Submit_Registartion_Form",
				data: userdata,
				success: function(resp){
					var data = JSON.parse(resp);
					if(data.status == 0){
						$('.errorRegister').html(data.message).show();
					}else if(data.status == 1){
						$('.overlay#sign-up').trigger('hide');
						$('.overlay#sign-up-confirm').trigger('show');
					}else{
						alert('Something went wrong.');
					}
				},
			});
		}
	});


	//User Registration script mobile
	$('#form_sign-up').validate({
		rules: {
			m_mail: {
				required: true,
				email: true
			},
			m_fname: {
				minlength: 3,
				required: true
			},
			m_lastname: {
				minlength: 3,
				required: true
			},
			m_phone: {
				number: true,
				minlength: 10,
				maxlength: 12
			},
			m_country: {
				required: true
			},
			m_state: {
				required: true
			},
			m_city: {
				required: true
			},
			m_street: {
				required: true
			},
			m_code: {
				required: true
			},
			m_password: {
				required: true,
				minlength: 6
			},
			m_confirm_password: {
				required: true,
				equalTo: '#m_password'
			},
			privacy_policy : {
				required: true
			}
		},
		messages: {
			m_mail: {
				required: "Email is Required.",
				email: "Enter valid email."
			},
			m_fname: "First Name is Required",
			m_lastname: "Last Name is Required",
			m_phone: {
				required : "Phone is Required",
				number : "Phone should be numeric and valid format.",
			},
			
			m_country: "Country Name is Required",
			m_state: "State is Required",
			m_city: "City is Required",
			m_street: "Street is Required",
			m_code: "Post Code is Required",			
			m_password: "Password is Required",
			m_confirm_password: {
				required : "Confirm Password is Required",
				equalTo : "Confirm Password and password should be match",
			},
			privacy_policy: "Privacy is Required",
		},
		submitHandler: function (form) {
		
			var userdata = $("#form_sign-up").serialize();
			$(".errorRegister").hide();
			
			$.ajax({
				type:'POST',
				url: ajaxurl+"?action=Submit_Reg_Form_Mobile",
				data: userdata,
				success: function(resp){
					var data = JSON.parse(resp);
					if(data.status == 0){
						$('.errorRegister').html(data.message).show();
					}else if(data.status == 1){
						//$('.sign-up').trigger('hide');
						$('.sign-up').removeClass('active');
						$('.overlay#sign-up-confirm_mobile').trigger('show');
					}else{
						alert('Something went wrong.');
					}
				},
			});
		}
	});

	// user login  script Mobile
	$('#Login_Form_Popup_Mobile').validate({
		rules: {
			user_login: {
				required: true,
				email: true
			},		
			user_password: {
				required: true,
				minlength: 6
			},
		},
		messages: {
			user_login: {
				required: "Email is Required.",
				email: "Enter valid email."
			},
			user_password: "Password is Required",
		},
		submitHandler: function (form) {
			
			var userdata = $('#Login_Form_Popup_Mobile').serialize();
			$(".errorLogin").hide();
			
			$.ajax({
				type:'POST',
				url: ajaxurl+"?action=Login_Form_Popup_Mobile",
				data: userdata,
				success: function(resp){
					var data = JSON.parse(resp);
					if(data.status == 0){
						$('.errorLogin').html(data.message).show();
					}else if(data.status == 1){
						location.reload();
					}else{
						alert('Something went wrong.');
					}			   
				},
			});
		}
	});





	// user login  script
	$('#Login_Form_Popup').validate({
		rules: {
			user_login: {
				required: true,
				email: true
			},		
			user_password: {
				required: true,
				minlength: 6
			},
		},
		messages: {
			user_login: {
				required: "Email is Required.",
				email: "Enter valid email."
			},
			user_password: "Password is Required",
		},
		submitHandler: function (form) {
			
			var userdata = $('#Login_Form_Popup').serialize();
			$(".errorLogin").hide();
			
			$.ajax({
				type:'POST',
				url: ajaxurl+"?action=Login_Form_Popup",
				data: userdata,
				success: function(resp){
					var data = JSON.parse(resp);
					if(data.status == 0){
						$('.errorLogin').html(data.message).show();
					}else if(data.status == 1){
						location.reload();
					}else{
						alert('Something went wrong.');
					}			   
				},
			});
		}
	});

	$('#Change_Form_Popup').validate({
		rules: {
			change_email: {
				required: true,
				email: true
			},
		},
		messages: {
			change_email: {
				required: "Email is Required.",
				email: "Enter valid email."
			},
		},
		submitHandler: function (form) {
			
			var userdata = $('#Change_Form_Popup').serialize();
			$(".errorChange").hide();
			
			$.ajax({
				type:'POST',
				url: ajaxurl+"?action=Change_password_Form_Popup",
				data: userdata,
				success: function(resp){
					var data = JSON.parse(resp);
					if(data.status == 0){
						$('.errorChange').html(data.message).show();
					}else if(data.status == 1){
						location.reload();
					}else{
						alert('Something went wrong.');
					}			   
				},
			});
		}
	});

	// reset password script
	$('#Reset_pswd_Form').validate({
		rules: {						
			RstPswd: {
				required: true,
				minlength: 6
			},
			RstPswdConfirm: {
				required: true,
				equalTo: '#RstPswd'
			}
		},
		messages: {			
			RstPswd: "Password is Required",
			RstPswdConfirm: {
				required : "Confirm Password is Required",
				equalTo : "Confirm Password and password should be match",
			}
		},
		submitHandler: function (form) {			
			var userdata = $("#Reset_pswd_Form").serialize();
			$(".reset-successfully p").hide();
			
			$.ajax({
				type:'POST',
				url: ajaxurl+"?action=Reset_password_Form",
				data: userdata,
				success: function(resp){
					var data = JSON.parse(resp);
					if(data.status == 0)
					{
						$('.text-success').text(data.message).show().addClass('invalid-token');
					}
					else if(data.status == 1)
					{
						$('.text-success').text(data.message).show();
					}
					
				},
			});
		}
	});

	// User booking form and 
	$('#offerBooking').validate({
		rules: {
			Title : {
				required: true
			},
			FirstName: {
				minlength: 3,
				required: true
			},
			LastName: {
				minlength: 3,
				required: true
			},
			Zipcode : {
				// required: true,
				number : true
			},
			Telefon : {	
				// required: true,
				number: true,
				minlength: 10,
				maxlength: 12
			},
			Email: {
				required: true,
				email: true
			},
		},
		messages: {
			Title: "Title is Required",
			FirstName: "First Name is Required",
			LastName: "Sur Name is Required",
			Zipcode: {
				// required : "Zipcode is Required",
				zipcodeUS : "Zipcode should be numeric and valid format.",
			},
			Telefon: {
				// required : "Telefon is Required",
				number : "Telefon should be numeric and valid format.",
			},
			Email: {
				required: "Email is Required.",
				email: "Enter valid email."
			},
		},
		submitHandler: function (form) {
			
			var booking_status = $('#booking_status').val();
			if(booking_status == 1){
				var Street = $('#Street').val();
				if(Street.length == 0){
					$('.bookingMessage').html("Street is Required.").addClass('alert-danger').removeClass('alert-success').show();
					$('html, body').animate({
						scrollTop: 1700
					}, 500);
					return false;
				}
				
				var StreetNumber = $('#StreetNumber').val();
				if(StreetNumber.length == 0){
					$('.bookingMessage').html("Street Number is Required.").addClass('alert-danger').removeClass('alert-success').show();
					$('html, body').animate({
						scrollTop: $(".bookingMessage").offset().top - 80
					}, 500);
					return false;
				}
				
				var Zipcode = $('#Zipcode').val();
				if(Zipcode.length == 0){
					$('.bookingMessage').html("Post Code is Required.").addClass('alert-danger').removeClass('alert-success').show();
					$('html, body').animate({
						scrollTop: $(".bookingMessage").offset().top - 80
					}, 500);
					return false;
				}
				
				var City = $('#City').val();
				if(City.length == 0){
					$('.bookingMessage').html("Place is Required.").addClass('alert-danger').removeClass('alert-success').show();
					$('html, body').animate({
						scrollTop: $(".bookingMessage").offset().top - 80
					}, 500);
					return false;
				}
				
				var Telefon = $('#Telefon').val();
				if(Telefon.length == 0){
					$('.bookingMessage').html("Phone is Required.").addClass('alert-danger').removeClass('alert-success').show();
					$('html, body').animate({
						scrollTop: $(".bookingMessage").offset().top - 80
					}, 500);
					return false;
				}	
				
				if($('#i_aggree').prop("checked") == false){
					$('.bookingMessage').html('Please accept general terms and conditions and the privacy policy.').addClass('alert-danger').removeClass('alert-success').show();
					$('html, body').animate({
						scrollTop: $(".bookingMessage").offset().top - 80
					}, 500);
					return false;
				}				
				
			}
			
			var userdata = $("#offerBooking").serialize();
			$(".bookingMessage").hide();
			$('#loader').show();
			
			$.ajax({
				type:'POST',
				url: ajaxurl + "?buttonCheck="+bookNowOffer,
				data: userdata,
				success: function(resp){
					var jsonData = JSON.parse(resp);
					$('.bookingMessage').show();
					$('#loader').hide();
					if(jsonData.status == 0){
						$('.bookingMessage').html(jsonData.message).addClass('alert-danger').removeClass('alert-success');
					}else{
						$('.bookingMessage').html(jsonData.message).addClass('alert-success').removeClass('alert-danger');
					}
					
					if(jsonData.status == 1){
						setTimeout(function(){
							if(booking_status == 1){
								window.location.href = site_url+'/booking-success/?redirectToken=' + jsonData.redirectToken;
							}else if(booking_status == 0 || booking_status == 2){
								window.location.href = site_url+'/request-offer-success/?redirectToken=' + jsonData.redirectToken;
							}
						},1000);
					}
					
					$('html, body').animate({
						scrollTop: $(".bookingMessage").offset().top - 80
					}, 500);
				},
				error : function(errors){
					alert(errors);
				}
			});
		}
	});

	// User voting Submit form and 
	$('#votingSubmit').validate({
		rules: {
			// Title : {
				// required: true
			// },
		},
		messages: {
			// Title: "Title is Required",
		},
		submitHandler: function (form) {
			
			$('.textAreaClass').attr('disabled',false);
			$('.uploadImageLabel input').attr('disabled',false);
			$('.ratings input').attr('disabled',false);
			
			var votingSubmit = $("#votingSubmit").serialize();
			$(".votingMessage").hide();
			$('#loader').show();
			
			$.ajax({
				type:'POST',
				url: ajaxurl ,
				data: votingSubmit,
				success: function(resp){
					var jsonData = JSON.parse(resp);
					$(".votingMessage").show();
					$('#loader').hide();
					$('.textAreaClass').attr('disabled',true);
					$('.uploadImageLabel input').attr('disabled',true);
					$('.ratings input').attr('disabled',true);
					$('.votingBtnPopup').trigger('click');
				},
				// error : function(errors){
					// $(".votingMessage").show();
					// $('#loader').hide();
					// $('.textAreaClass').attr('disabled',true);
					// $('.uploadImageLabel input').attr('disabled',true);
					// $('.ratings input').attr('disabled',true);
					// alert(errors);
				// }
			});
		}
	});
	
	/*ajax News latter*/

	$.validator.addMethod('germonyphone', function (value, element) {
        return this.optional(element) || /^((\+[1-9]{1,4}[ \-/]*)|(\([0-9]{2,3}\)[ \-/]*)|([0-9]{2,4})[ \-/]*)*?[0-9]{3,4}?[ \-/]*[0-9]{3,4}?$/.test(value);
    }, "Telefon sollte gültig sein");

	$.validator.addMethod('nameval', function (value, element) {
        return this.optional(element) || /^(?=.*[a-zA-Z].*)([ a-zA-Z]+[a-zA-Z]+[a-zA-Z ]+)$/.test(value); 
    }, "Telefon sollte gültig sein");

	// User voting Submit form and 
	$('#newsletter').validate({
	
		rules: {
			language : {
				required: true
			},
			firstname : {
				nameval: true,
				required: true
			},
			lastname : {
				nameval: true,
				required: true
			},
			telefon : {
				germonyphone: true,
				// required: true,
			},
			email : {
				email: true,
				required: true,
			},
		},
		messages: {
			language: "Sprache ist erforderlich",
			firstname: "Vorname ist erforderlich",
			lastname: "Nachname ist erforderlich",
			telefon: {
				germonyphone: "Telefon sollte gültig sein",
				// required: "Telefon ist erforderlich"
			},
			email:{
				email: "E-mail sollte gültig sein",
				required: "E-mail ist erforderlich"
			},
		},
		submitHandler: function (form) {
			
			$('#newslatterloader').show();
			$('.NewsMessage').hide();
			var newsletter = $("#newsletter").serialize();
		 
			$.ajax({
				type:'POST',
				url: ajaxurl ,
				data: newsletter,
				success: function(resp){
					
					$('#newslatterloader').hide();
					var jsonData = JSON.parse(resp);

					if(jsonData.status==200){
						
						if(jsonData.data.customer.title == '1'){
							var gender = 'Frau';
						}else if(jsonData.data.customer.title == '2'){
							var gender = 'Herr';							
						}else{
							var gender = 'Firma';							
						}	

						var html ='<div class="news_popup_cntnt small"><div class="header_nws_popup"><div class="nws_icon"><img src="'+site_url+'/wp-content/themes/twentytwenty-child/assets/images/news_icon.png"></div><h2>50 Euro Gutschein für Deine nächste Charter</h2></div><h3 class="popup-headinding">Lieber '+gender+' <b>'+jsonData.data.customer.firstname+' '+jsonData.data.customer.lastname+'</b></h3><p class="popup-peragraph">Ihre Newsletter Anmeldung wurde erfolgreich gespeichert. Sie erhalten umgehend eine E-Mail mit einem Bestätigungslink an folgende Adresse: <a>'+jsonData.data.customer.email+'</a></p><p class="popup-peragraph bold_nws_ft">Das Team von Yachtcharterfinder.com</p><hr class="nws_thnk_cls_brdr"><div class="nws_thnk_cls_btn"><button class="close_nws_btn">Shlieben</button></div>';
						$('.news_popup_cntnt').html(html);
						$('#newsletterPopup').addClass('successNews');
					}else{
						$('.NewsMessage').html(jsonData.data).show();
					}
				},
			});
		}
	});
	
	/*Ajax For unsubscribe news latter*/	
	
	$("#unsubscribenewsletter").submit(function(e){
		e.preventDefault();
		var newsletterData = $("#unsubscribenewsletter").serialize(); 
		$('#loader').show();
		$.ajax({
			type:'POST',
			url: ajaxurl ,
			data: newsletterData,
			success: function(resp){
				$('#loader').hide();
				var jsonData = JSON.parse(resp);
				if(jsonData.Status == 200){
					$('#response_un_subs_form').hide();
					$('#response_un_subs').show();
				}				
			}
		});				
	});
	/* end jquery */
	
	
	
});


