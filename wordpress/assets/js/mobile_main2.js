$(document).ready(function () {
    
     $('.pop-up_close__js').on('click',  function (e) {
        e.preventDefault(e);
        var $thisPopUp = $(this).closest('.pop-up__js');
        $('.change-search__js.active').removeClass('active');

        if ($userMenuTrigger.hasClass('active')) {
            $userMenuTrigger.removeClass('active');
        }


        $thisPopUp.removeClass('active');

        if (!$popUp.not($thisPopUp).hasClass('active')) {
            $shadow.removeClass('shadow__active');
        }

        if (!$popUpFull.not($thisPopUp).hasClass('active')) {
            $html.removeClass('over-hidd');
        }
    });
//'Main menu' open

    var $mainMenuTrigger = $('#main-menu_trigger'),
        $mainMenu = $('#main-menu'),
        $popUp = $('.pop-up__js'),
        $popUpFull = $('.pop-up__full'),
        $shadow = $('#shadow');

    var $userMenu = $('#user-menu'),
        $userMenuTrigger = $('#user-menu_trigger');


    $mainMenuTrigger.click(function (e) {
        e.preventDefault(e);
        $mainMenu.toggleClass('active');
        $mainMenuTrigger.toggleClass('hamburger__opened');
    });


    //Closing 'main menu' due a click outside the menu

    $(document).mouseup(function (e) {
        if (!$mainMenu.is(e.target)
            && !$mainMenuTrigger.is(e.target)
            && !$shadow.is(e.target)
            && !$popUp.is(e.target)

            && $mainMenu.has(e.target).length === 0
            && $mainMenuTrigger.has(e.target).length === 0
            && $shadow.has(e.target).length === 0
            && $popUp.has(e.target).length === 0
            && $mainMenu.hasClass('active')) {
            $mainMenu.removeClass('active');
            $mainMenuTrigger.removeClass('hamburger__opened');
        }
    });


     //Show 'Privacy policy' block

    var $privacyPolicyTrigger = $('.privacy-policy_trigger__js'),
        $PopUpPrivacy = $('#pop-up_privacy');

    var $html = $('html'),
        $body = $('body');

    $privacyPolicyTrigger.click(function () {
//        $html.addClass('over-hidd');
        $window.animate({scrollTop: 0}, "300");
        $PopUpPrivacy.addClass('active');
    });
    
    //Closing 'user menu' due a click outside the menu

    $(document).mouseup(function (e) {
        if (!$userMenu.is(e.target)
            && !$userMenuTrigger.is(e.target)
            && !$shadow.is(e.target)
            && !$popUp.is(e.target)

            && $userMenu.has(e.target).length === 0
            && $userMenuTrigger.has(e.target).length === 0
            && $shadow.has(e.target).length === 0
            && $popUp.has(e.target).length === 0
            && $userMenu.hasClass('active')) {

            $userMenu.removeClass('active');
            $userMenuTrigger.removeClass('active');
        }
    });


    //Show 'Log In' block    or    'User menu' open

    var $logInOpen = $('.log-in_link__js'),
        $popUpLogIn = $('#pop-up_log-in'),
        $window = $("html, body");
    

    $logInOpen.click(function (e) {
        e.preventDefault(e);
        $(this).toggleClass('active');
        if ($(this).hasClass('trigger__active')) {

            // 'User menu' open

            e.preventDefault(e);
            $userMenu.toggleClass('active');

        } else {
            //Show 'Log In' block

            $popUp.removeClass('active');
            $window.animate({scrollTop: 0}, "300");
            $popUpLogIn.addClass('active');
            $shadow.addClass('shadow__active');

        }
    });


    //'User menu' close

    var $userMenuClose = $('#user-menu_close');

    $userMenuClose.click(function (e) {
        e.preventDefault(e);
        $userMenu.removeClass('active');
        $logInOpen.removeClass('active');
    });


    //Pop-up window close


    $(document).on('click', '.pop-up_close__js', function (e) {
        e.preventDefault(e);
        var $thisPopUp = $(this).closest('.pop-up__js');
        $('.change-search__js.active').removeClass('active');

        if ($userMenuTrigger.hasClass('active')) {
            $userMenuTrigger.removeClass('active');
        }


        $thisPopUp.removeClass('active');

        if (!$popUp.not($thisPopUp).hasClass('active')) {
            $shadow.removeClass('shadow__active');
        }

        if (!$popUpFull.not($thisPopUp).hasClass('active')) {
            $html.removeClass('over-hidd');
        }
    });


  
    //Show 'Sign Up' block

    var $signUpOpen = $('.sign-up_link__js'),
        $popUpSignUp = $('#pop-up_sign-up');

    $signUpOpen.click(function (e) {
        e.preventDefault(e);
        $popUp.removeClass('active');
        $window.animate({scrollTop: 0}, "300");
        $popUpSignUp.addClass('active');
        $shadow.addClass('shadow__active');
    });


    //Show 'Thanks for sign up' block

    var $formSignUp = $('#form_sign-up'),
        $PopUpThanks1 = $('#pop-up_thanks__1');


    // $formSignUp.validate({
        // submitHandler: function () {
            // $popUp.removeClass('active');
            // $window.animate({scrollTop: 0}, "300");
            // $PopUpThanks1.addClass('active');
        // }
    // });


    //Show 'Thanks for sign up' (Full) block

    var $formSignUpFull = $('#f-form_sign-up'),
        $PopUpThanks1Full = $('#f-pop-up_thanks__1');


    $formSignUpFull.validate({
        submitHandler: function () {
            $popUp.removeClass('active');
            $PopUpThanks1Full.addClass('active');
        }
    });


    //Show 'Reset password' block

    var $forgotPass = $('#forgot-password'),
        $PopUpForgotPass = $('#pop-up_forgot-pass');


    $forgotPass.click(function () {
        $popUp.removeClass('active');
        $window.animate({scrollTop: 0}, "300");
        $PopUpForgotPass.addClass('active');
        $shadow.addClass('shadow__active');
    });


    //Show 'Reset password' (Full) block

    var $forgotPassFull = $('#f-forgot-password'),
        $PopUpForgotPassFull = $('#f-pop-up_forgot-pass');


    $forgotPassFull.click(function () {
        $PopUpForgotPassFull.addClass('active');
    });


    //Show 'New password' block

    var $forgotPassSubmit = $('#forgot-pass_submit'),
        $PopUpNewPass = $('#pop-up_new-pass');

    $forgotPassSubmit.click(function (e) {
        e.preventDefault();
        $popUp.removeClass('active');
        $window.animate({scrollTop: 0}, "300");
        $PopUpNewPass.addClass('active');
        $shadow.addClass('shadow__active');
    });


    //Show 'New password' (Full) block

    var $forgotPassSubmitFull = $('#f-forgot-pass_submit'),
        $PopUpNewPassFull = $('#f-pop-up_new-pass');

    $forgotPassSubmitFull.click(function (e) {
        e.preventDefault();
        $PopUpNewPassFull.addClass('active');
    });


    //Show 'Thanks for reset password' block

    var $formResetPass = $('#form_reset-pass'),
        $PopUpThanks2 = $('#pop-up_thanks__2');

    $formResetPass.validate({
        submitHandler: function () {
            $popUp.removeClass('active');
            $window.animate({scrollTop: 0}, "300");
            $PopUpThanks2.addClass('active');
        }
    });


    //Show 'Thanks for reset password' (Full) block

    var $formResetPassFull = $('#f-form_reset-pass'),
        $PopUpThanks2Full = $('#f-pop-up_thanks__2');

    $formResetPassFull.validate({
        submitHandler: function () {
            $popUp.removeClass('active');
            $PopUpThanks2Full.addClass('active');
        }
    });

    

    //Show 'Log in' (Full) block

    var $continueBeforeLogInOpen = $('#continue-before-log-in_link'),
        $popUpLogInFull = $('#f-pop-up_log-in');


    $continueBeforeLogInOpen.click(function (e) {
        e.preventDefault(e);
        $popUpLogInFull.addClass('active');
    });


    //Show 'Log in' (Full) block

    var $continueAfterLogInOpen = $('.continue-after-log-in_link__js');

    $continueAfterLogInOpen.click(function (e) {
        e.preventDefault(e);
        $popUp.removeClass('active');
        $popUpLogInFull.addClass('active');
    });


    //Show 'Create Account' (sign up Full) block

    var $continueSignUpOpen = $('#continue-sign-up_link'),
        $popUpSignUpFull = $('#f-pop-up_sign-up');

    $continueSignUpOpen.click(function (e) {
        e.preventDefault(e);
        $popUpSignUpFull.addClass('active');
    });

});
    