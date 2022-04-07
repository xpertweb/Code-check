<div>
    <h3>Hi {{ $data['name'] }}</h3>
	
    <div>
        <b>Email:</b> {{$data['email']}}
    </div>
    <div>
      <b>Password:</b> {{$data['random']}}
    </div>	
    <div>
		Given above is your password. If you want to set your own password. Please <a href="{{ route('new-password',$data['hashRandom']) }}" >click here</a>
    </div>
</div>