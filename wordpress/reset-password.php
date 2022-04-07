<?php 
/*Template Name: Reset Password*/
get_header();
$UserToken = $_GET['UserToken'];
?>
<section class="reset-password">
	<div class="container">
		<div class="row">
			<form action="#" id="Reset_pswd_Form" name="Reset_pswd_Form" method="POST">
				<div class="reset-inner">
					<h2 class="new-psw">Reset Passowrd</h2>
					<div class="reset-form-group">
						<input type="password" class="rst-psw" id="RstPswd" name="RstPswd" placeholder="New Password">
					</div>
					<div class="reset-form-group">
						<input type="hidden" class="" id="" name="UserToken" value="<?php echo $UserToken; ?>" >
					</div>
					<div class="reset-form-group">
						<input type="password" class="rst-psw" name="RstPswdConfirm" placeholder="Confirm Password">
					</div>
					<div class="reset-form-group">
						<input type="submit" value="Reset Password" class="Reset-now" id="Reset_now">
					</div>
					<div class="text-success" style="display: none;"></div>
				</div>
			</form>
		</div>
	</div>
</section>


<?php get_footer();  ?>