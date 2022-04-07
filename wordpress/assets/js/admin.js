jQuery(document).ready(function(){ 

	jQuery("#save_top_bar_options").click(function(){ // funciton for top bar theme option
		var TopData = jQuery("#theme_option_top_name").serialize();	
    jQuery(".save_top_success").hide();
		jQuery.ajax({
        type:'POST',
        url: ajaxurl+"?action=submit_theme_option_data",
        data:TopData,
     		success: function(resp)
     		{
          var data = JSON.parse(resp);
          if(data.status == 1)
          { 
            jQuery('.save_top_success').html(data.message).show().addClass('alert-success').addClass('alert');           
            setTimeout(function()
            { 
              jQuery('.save_top_success').hide();
            }, 3000); 
          }
           
  		        
        },
    });

	});


  jQuery("#save_social_options").click(function(){ // funciton for social tab theme option
    var TopData = jQuery("#theme_option_social").serialize(); 
    jQuery(".save_social_success").hide();
    jQuery.ajax({
      type:'POST',
      url: ajaxurl+"?action=submit_theme_option_social",
      data:TopData,
      success: function(resp)
      {
        var data = JSON.parse(resp);
        if(data.status == 1)
        {
          jQuery('.save_social_success').html(data.message).show().addClass('alert-success').addClass('alert');
          setTimeout(function()
          { 
            jQuery('.save_social_success').hide();
          }, 3000);
          
          
        }
         
            
      },
    });

  });




////////////////////  
});