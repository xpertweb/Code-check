<div>
    <h3>Hi {{$data['name']}}</h3>
    <p>I'd like to let you know that admin has created new lead for you.</p>
    <div>
        <b>Lead Navn:</b> {{$data['leads_name']}}
    </div>
    <div>
      <b>Lead Link:</b> {{$data['leads_link']}}
    </div>  
    <div>
      <b>E-mail:</b> {{$data['client_email']}}
    </div>  
    <div>
      <b>Telefonnummer:</b> {{$data['client_phone']}}
    </div>
    <div>
      <b>CVR nummer:</b> {{$data['client_vat']}}
    </div>  
    <div>
      <b>Adresse:</b> {{$data['client_address']}}
    </div> 
    <div>
      <b>Kontakt Person:</b> {{$data['client_person']}}
    </div>
    <div>
      <b>Kommentars:</b>
      <div style="border:1px solid #ccc; padding:10px;">
        {{ strip_tags($data['comment'])}}
      </div>
    </div>
</div>