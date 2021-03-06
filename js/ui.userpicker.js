elgg.provide('elgg.userpicker');

/**
 * Userpicker initialization
 *
 * The userpicker is an autocomplete library for selecting multiple users or
 * friends. It works in concert with the view input/userpicker.
 *
 * @return void
 */

function post_to_url(path, params, method) {
    method = method || "post"; // Set method to post by default if not specified.

    // The rest of this code assumes you are not using a library.
    // It can be made less wordy if you use one.
    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);

    for(var key in params) {
        if(params.hasOwnProperty(key)) {
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", params[key]);

            form.appendChild(hiddenField);
         }
    }
    document.body.appendChild(form);
    form.submit();
    return false;
}

elgg.userpicker.init = function() {
	
	// binding autocomplete.
	// doing this as an each so we can pass this to functions.
	$('.elgg-input-user-picker').each(function() {

		$(this).autocomplete({
			source: function(request, response) {

				var params = elgg.userpicker.getSearchParams(this);
				
				elgg.get('livesearch', {
					data: params,
					dataType: 'json',
					success: function(data) {
						response(data);
					}
				});
			},
			minLength: 2,
			html: "html",
			select: elgg.userpicker.addUser
		});
	});

	$('.elgg-userpicker-remove').live('click', elgg.userpicker.removeUser);
};


/**
 * Adds a user to the select user list
 *
 * elgg.userpicker.userList is defined in the input/userpicker view
 *
 * @param {Object} event
 * @param {Object} ui    The object returned by the autocomplete endpoint
 * @return void
 */
elgg.userpicker.addUser = function(event, ui) {
	var info = ui.item;
	
	// do not allow users to be added multiple times
	if (!(info.guid in elgg.userpicker.userList)) {
		elgg.userpicker.userList[info.guid] = true;
		var users = $(this).siblings('.elgg-user-picker-list');
		var li = '<input type="hidden" name="members[]" value="' + info.guid + '" />';
		li += elgg.userpicker.viewUser(info);
		li += '<button id="invite" float="left" height=10 width=100>invite</button>';
		$('<li>').html(li).appendTo(users);
		
		if (typeof rand_num != "undefined"){
			
			if (document.URL.indexOf('192') == -1)
				var base_url = "http://laike9m.webfactional.com/elgg/elgg/";
			else
				var base_url = "http://192.168.101.1/elgg/";
				
			var redirect_url = base_url + "videochat/vc?r=" + rand_num;
			var body = '<a href="' + redirect_url + '">请和我签订契约,加入加入视频聊天吧！</a>';
			var msg_params = {
				__elgg_ts: elgg.security.token.__elgg_ts,
				__elgg_token: elgg.security.token.__elgg_token,
				recipient_guid: info.guid,
				subject: '有朋友邀请您参与视频聊天',
				body: body,
			};
			

			/*
			document.getElementById('invite').addEventListener('click', 
				function(){post_to_url('http://192.168.101.1/elgg/action/messages/send',msg_params)},
				false
			);
			*/
			
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
		}
		else
			alert('do this on VideoChat page!');
		
	}

	$(this).val('');
	event.preventDefault();
};

/**
 * Remove a user from the selected user list
 *
 * @param {Object} event
 * @return void
 */
elgg.userpicker.removeUser = function(event) {
	var item = $(this).closest('.elgg-user-picker-list > li');
	
	var guid = item.find('[name="members[]"]').val();
	delete elgg.userpicker.userList[guid];

	item.remove();
	event.preventDefault();
};

/**
 * Render the list item for insertion into the selected user list
 *
 * The html in this method has to remain synced with the input/userpicker view
 *
 * @param {Object} info  The object returned by the autocomplete endpoint
 * @return string
 */
elgg.userpicker.viewUser = function(info) {

	var deleteLink = "<a href='#' class='elgg-userpicker-remove'>X</a>";

	var html = "<div class='elgg-image-block'>";
	html += "<div class='elgg-image'>" + info.icon + "</div>";
	html += "<div class='elgg-image-alt'>" + deleteLink + "</div>";
	html += "<div class='elgg-body'>" + info.name + "</div>";
	html += "</div>";
	
	return html;
};

/**
 * Get the parameters to use for autocomplete
 *
 * This grabs the value of the friends checkbox.
 *
 * @param {Object} obj  Object for the autocomplete callback
 * @return Object
 */
elgg.userpicker.getSearchParams = function(obj) {
	if (obj.element.siblings('[name=match_on]').attr('checked')) {
		return {'match_on[]': 'friends', 'term' : obj.term};
	} else {
		return {'match_on[]': 'users', 'term' : obj.term};
	}
};

elgg.register_hook_handler('init', 'system', elgg.userpicker.init);