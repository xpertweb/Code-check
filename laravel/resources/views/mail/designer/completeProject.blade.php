<div>
    <h3>Hi Admin,</h3>
    <p>I'd like to let you know that admin has created new project for you.</p>
    <div>
        <b>Project Name:</b> {{$data->project_name}}
    </div>
    <div>
      <b>Project Link:</b> {{$data->project_link}}
    </div>  
    <div>
      <b>Client Email:</b> {{$data->client_email}}
    </div>  
    <div>
      <b>Client Phone:</b> {{$data->client_phone}}
    </div>
    <div>
      <b>Client VAT:</b> {{$data->client_vat}}
    </div>  
    <div>
      <b>Client Address:</b> {{$data->client_address}}
    </div>  
    <div>
      <b>Client Person:</b> {{$data->client_person}}
    </div> 
    <div>
      <b>Comment:</b>
      <div style="border:1px solid #ccc; padding:10px;">
        {{ strip_tags($data->comment)}}
      </div>
    </div>
</div>