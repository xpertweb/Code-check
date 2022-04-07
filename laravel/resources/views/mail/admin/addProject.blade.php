<div>
    <h3>Hi {{$data['name']}}</h3>
    <p>I'd like to let you know that admin has created new project for you.</p>
    <div>
        <b>Projekter navn:</b> {{$data['project_name']}}
    </div>
    <div>
      <b>Projekter Link:</b> {{$data['project_link']}}
    </div>  
    <div>
      <b>Kunde e-mail:</b> {{$data['client_email']}}
    </div>  
    <div>
      <b>Telefonnummer:</b> {{$data['client_phone']}}
    </div>
    <div>
      <b>CVR nummer:</b> {{$data['client_vat']}}
    </div>  
    <div>
      <b>Kommentars:</b>
      <div style="border:1px solid #ccc; padding:10px;">
        {{ strip_tags($data['comment'])}}
      </div>
    </div>
</div>