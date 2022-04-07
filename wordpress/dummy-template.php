<?php 

/*Template Name: Popup Template*/



get_header();

?>

        <div class="wrappers">

            <!--pop-up windows (same on all html pages)-->

            <div class="shadow" id="shadow"></div>

            <div class="shadow shadow__show-filter" id="shadow_filter"></div>



            <!--'Log In' block-->

            <div id="pop-up_log-in" class="container container__inner pop-up pop-up__js log-in">

                <form action="#" id="form_log-in">

                    <div class="pop-up__inner">

                        <!--            <a href="#" class="main-txt main-txt__white pop-up_close pop-up_close__js"><i class="far fa-times"></i></a>-->

                        <a href="#" class="main-txt main-txt__white pop-up_close pop-up_close__js"><i class="far fa-times"></i></a>

                        <p class="main-txt main-txt__m pop-up_head">Log in</p>

                    </div>

                    <div class="pop-up__inner">



                        <input class="form_input pop-up_input" type="email" name="email_log-in" id="email_log-in" placeholder="Email address*" required />



                        <input class="form_input pop-up_input" type="password" name="password_log-in" id="password_log-in" placeholder="Password*" required />

                        <div class="mt__1">

                            <input class="checkbox" type="checkbox" name="remember_me" id="remember_me">

                            <label class="checkbox_txt checkbox_txt__left" for="remember_me"><span></span>Remember

                                me</label>



                            <a id="forgot-password" class="main-txt main-txt__xs main-txt__regular forgot-pass" href="#">

                                Forgot password?

                            </a>

                            <div class="clearfix"></div>

                        </div>

                    </div>



                    <div class="line mt__1"></div>



                    <div class="pop-up__inner">

                        <input type="submit" class="button pop-up_button" value="Log in">

                        <a class="button button__facebook" href="#">

                            <img class="log-in_icon" src="images/facebook-icon.png">

                            Log in with Facebook

                        </a>

                        <a class="button button__google" href="#">

                            <img class="log-in_icon" src="images/google-icon.png">Log in with Google

                        </a>

                    </div>



                    <div class="line mb__2"></div>



                    <div class="pop-up__inner">

                        <span class="main-txt main-txt__regular main-txt__xs mr__1">Dont have an account?</span>



                        <a href="#" class="button button__transparent button__little sign-up_link sign-up_link__js">Sign

                            Up</a>



                    </div>

                </form>

            </div>





            <!--'Sign Up' block-->

            <div id="pop-up_sign-up" class="container container__inner pop-up  pop-up__js sign-up" style="display:none !important">

                <form action="#" id="form_sign-up">

                    <div class="pop-up__inner">



                        <a href="#" class="main-txt main-txt__white pop-up_close pop-up_close__js"><i class="far fa-times"></i></a>

                        <p class="main-txt main-txt__m pop-up_head mb__9">Sign Up</p>

                    </div>



                    <div class="pop-up__inner">



                        <a class="button button__facebook" href="#">

                            <img class="log-in_icon" src="images/facebook-icon.png">

                            Log in with Facebook

                        </a>

                        <a class="button button__google" href="#">

                            <img class="log-in_icon" src="images/google-icon.png">Log in with Google

                        </a>

                    </div>



                    <div class="line mt__1 mb__1 line__js"></div>



                    <div class="pop-up__inner">



                        <input class="form_input pop-up_input" type="email" name="sign-up_email" id="sign-up_email" placeholder="Email address*" required />





                        <input class="form_input pop-up_input" type="text" name="sign-up_first-name" id="sign-up_first-name" placeholder="First name*" required />



                        <input class="form_input pop-up_input" type="text" name="sign-up_last-name" id="sign-up_last-name" placeholder="Last name*" required />



                        <input class="form_input pop-up_input" type="tel" name="sign-up_phone" id="sign-up_phone" placeholder="Phone*" required />



                        <input class="form_input pop-up_input" type="text" name="sign-up_country" id="sign-up_country" placeholder="Country*" required />



                        <input class="form_input pop-up_input" type="text" name="sign-up_city" id="sign-up_city" placeholder="City*" required />



                        <input class="form_input pop-up_input" type="text" name="sign-up_state" id="sign-up_state" placeholder="State*" required />



                        <input class="form_input pop-up_input" type="text" name="sign-up_street" id="sign-up_street" placeholder="Street and number*" required />



                        <input class="form_input pop-up_input" type="text" name="sign-up_post-code" id="sign-up_post-code" placeholder="Post code*" required />





                        <div class="rel">

                            <input class="form_input pop-up_input password__js" type="password" name="sign-up_password__create" id="sign-up_password" placeholder="Create a password*" required />



                            <input id="sign-up_password-show__1" name="sign-up_password__show" class="password-show password-show__js" type="checkbox" value="false">



                            <label for="sign-up_password-show__1" class="password-show_label">

                                <img src="images/eye.png" alt="#">

                            </label>

                        </div>



                        <div class="rel">

                            <input class="form_input pop-up_input password__js" type="password" name="sign-up_password__confirm" id="sign-up_password__confirm" placeholder="Confirm a password*" required />



                            <input id="sign-up_password-show__2" name="sign-up_password__show" class="password-show password-show__js" type="checkbox" value="false">



                            <label for="sign-up_password-show__2" class="password-show_label">

                                <img src="images/eye.png" alt="#">

                            </label>

                        </div>



                        <input class="form_input form_date pop-up_input" type="date" name="sign-up_birth-date" id="sign-up_birth-date" placeholder="Date of birth*" required />



                        <!--<p class="main-txt main-txt__light main-txt__xs main-txt__red">-->

                        <!--Sorry you need to change error or missing fields-->

                        <!--</p>-->



                        <p class="main-txt main-txt__light main-txt__xs main-txt__short-s main-txt__grey-89 center mt__5 mb__1">

                            To sign up, you must be 18 or older. Other people won’t see your birthday.

                        </p>

                        <div class="center">

                            <input class="checkbox" type="checkbox" name="privacy-policy" id="privacy-policy" required>

                            <label class="checkbox_txt checkbox_txt__m" for="privacy-policy"><span class="privacy"></span>

                                Yes, I accept the

                                <a href="#" class="main-txt main-txt__regular main-txt__bright-blue main-txt__underline privacy-policy_trigger__js">

                                    privacy policy.

                                </a>

                            </label>

                        </div>



                        <input type="submit" id="sign-up_submit" class="button pop-up_button mt__1 mb__1" value="Sign Up">

                    </div>





                    <div class="line mb__2"></div>



                    <div class="pop-up__inner">

                        <span class="main-txt main-txt__regular main-txt__xs mr__1">Dont have an account?</span>



                        <a href="#" class="button button__transparent button__little log-in_link__js">Log In</a>



                    </div>

                </form>

            </div>

        </div>



<?php

get_footer();

?>