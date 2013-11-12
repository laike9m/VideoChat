<!DOCTYPE html>
<html>
<body>
<iframe id='video' height=490 width=620>
  <p>Your browser does not support iframes.</p>
</iframe>
<script type="text/javascript">
	var rand_num; 
	var current_url = document.URL;
	if ( window.location.search != "" )  // has query string. 
		rand_num = window.location.search.substr(3);  //?r=num
	else
		rand_num = Math.floor(Math.random()*900000+100000);
	$('#video').prop('src', "https://apprtc.appspot.com/?r=" + rand_num);
</script>
</body>
<?php
/**
* Content area greeting
* * @uses $vars['name'] The name of a user
*/

//echo elgg_echo('hello,%s,dsdsd', array($vars['name']));
?>
</html>