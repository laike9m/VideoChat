<?php

// videochat page

$user = elgg_get_logged_in_user_entity();
$title = "My first page";
$params = array('name'=>$user->name);
$content = elgg_view('videochat/greetings', $params);
$vars = array('content' => $content,);
$body = elgg_view_layout('one_sidebar', $vars);
echo elgg_view_page($title, $body);

?>