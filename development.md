<b>VideoChat Plugin Development</b>
===

Since this is a videochat plugin, the core part is of course imeplementing video chatting between users. It's really simple actually.

If you have heard of WebRTC, you should be aware that modern web browsers have great power. I'll make a brief introduction to WebRTC here, but if you want to truely understand it, further searching and reading is necessary.

WebRTC is a free, open project that enables web browsers with Real-Time Communications (RTC) capabilities via simple Javascript APIs.WebRTC allows web pages to access local multimedia devices like a webcam and microphone, and transmit these media streams to another WebRTC capable browser via a peer-to-peer network channel. These media streams can also be accompanied by a powerful data channel that lets developer exchange arbitrary data between two peers! Its mission is to enable rich, high quality, RTC applications to be developed in the browser via simple Javascript APIs and HTML5.

Visit <a href='apprtc.appspot.com'>apprtc.appspot.com</a> (one of WebRTC's official example to show how it works), you'll find that it's just the application I use for my plugin. All I did is put the website into an `<iframe>`, and that's it, incrediblely simple but works flawlessly!

View the <a href='https://github.com/laike9m/VideoChat/blob/master/views/default/videochat/greetings.php'>code</a> for more information.

Though the appspot site works really well, it has some constraints. If two people have entered the same `room` (same url), then the room gets full for it only supports a peer-to-peer channel. To avoid such mess, everytime a user comes to the VideoChat page, a random number will be generated and act as the query string of `apprtc.appspot.com`, which prevents you from entering a full or half-full room. 

Frankly speaking, although it's a plugin to implement video chatting, the most difficult part is not on videochat, but on how to invite your friends to talk to you.To do that, I use elgg built-in `User pickers` view.

<img width=80% src="https://github.com/laike9m/VideoChat/raw/master/md_images/user_picker.jpg" />

Next step is to find out how elgg actually sends a message, it's rather easy once you have the experience using Chrome Devtools or firebug.It turns out that a message is an HTTP POST request.

e.g.  
<img src="https://github.com/laike9m/VideoChat/raw/master/md_images/http.jpg" />

Last thing is to implement your own sending/inviting machanism, making a redirection once your friends clicks the link in your msg. I'll let code do the talking:

    li += '<button id="invite" float="left" height=10 width=100>invite</button>';
	$('<li>').html(li).appendTo(users);

These two lines add the `invite` button.

    var redirect_url = base_url + "videochat/vc?r=" + rand_num;
	var body = '<a href="' + redirect_url + '">请和我签订契约,加入加入视频聊天吧！</a>';
	var msg_params = {
		__elgg_ts:elgg.security.token.__elgg_ts,
		__elgg_token:elgg.security.token.__elgg_token,
		recipient_guid: info.guid,
		subject:'有朋友邀请您参与视频聊天',
		body: body,
	};
	
    $('#invite').click(function(){
	    $.ajax({
	        url: base_url + 'action/messages/send',
	        type: 'POST',
	        data: msg_params,
	        success: function(msg){
	            alert('your msg has been sent');
	        }
	    })
	});

This part send the HTTP POST request we mentioned above.Note that the content of an invite message contains a link, redirecting the invitee to the videochat page. The random number is also passed as a query string parameter, forcing the message invitee enter the same room as inviter. The code below shows how it is done.

    if ( window.location.search != "" )  // has query string. 
		rand_num = window.location.search.substr(3);  //?r=num
	else
		rand_num = Math.floor(Math.random()*900000+100000);
	$('#video').prop('src', "https://apprtc.appspot.com/?r=" + rand_num); 
	

## some other things you should pay attention to

1. I use `ajax` to prevent current page from reloading after sending a request. Why? Because two people can chat if and only if their `iframe` elements have the same `src` attribute (i.e. same room). If you reload, as mentioned before, a new random number will be generated thus making the inviter enter a different room.
2. When sending HTTP request, `__elgg_ts` and `__elgg_token` are necessary parameters. This is a machanism elgg uses to validate message. Luckily these two variables are stored in global scope:  
<img src="https://github.com/laike9m/VideoChat/raw/master/md_images/s.jpg" />  
3. If you try to search friend in another page rather than the videochat Page, though you can still get a `invite` button, however when click, you will be alerted:  
<img src="https://github.com/laike9m/VideoChat/raw/master/md_images/alert.jpg" />  
This is done by detecting the existense of that random number since it only exists in the videochat page.
		
		if (typeof rand_num != "undefined"){
            //add invite button click EventListener, see above code
		}
		else
			alert('do this on VideoChat page!');