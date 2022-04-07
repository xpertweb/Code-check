<div class="modal fade" id = "leadReminder">
  <div class="modal-dialog">
    <div class="modal-content">
      
      <form action = "javascript:updateLeadReminder()" id="updateLeadReminder">
        <div class="modal-body">
          <div class="col-md-12">
              <h3 class = "text-center">Update Reminder</h3>
          </div>
          @csrf
          <input type="hidden" name="leads_id" id = "leads_id" />
		  
          <div class="form-group">
            <label>Reminder Date</label>
            <input type="text" class="form-control date-picker" data-date-start-date="+0d" data-date-format="dd-mm-yyyy" placeholder="Reminder Date" value="" name = "reminder" id = "phone_reminder" readonly required />
            <p class = "error-message reminder"></p>
          </div>
		  
		  <div class="form-group">
            <label>Description</label>
			<textarea name="reminder_text" id="reminder_text" class="form-control"></textarea>
			<input type="button" class="standard_text" value="Ringet op" />
			<input type="button" class="standard_text" value="Spørgsmål besvaret" />
			<input type="button" class="standard_text" value="Tilbud givet" />
          </div>
		  
		  <div class="form-group reminder" style="display:none;"></div>
		  
        </div>
        <div class="modal-footer clear">
          <button type="button" class="btn btn-primary pull-left" data-dismiss="modal" >{{ Helper::translation('Close') }}</button>
          <button type="submit" class="btn btn-primary">{{ Helper::translation('Save') }}</button>
        </div>
      </form>
    </div>
    <!-- /.modal-content -->
  </div>
  <!-- /.modal-dialog -->
</div>
<!-- /.modal -->

