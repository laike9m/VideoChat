<?php

// VideoChat plugin

elgg_register_event_handler('init', 'system', 'hello_world_init');

function hello_world_init() {
	// register to receive requests that start with 'hello'
	elgg_register_page_handler('videochat', 'vc_page_handler');
	
	// add a menu item to primary site navigation
	$item = new ElggMenuItem('videochat', 'VideoChat', 'videochat/vc');
	elgg_register_menu_item('site', $item);
	
	// add sidebar menu items that only show up on 'hello' pages
	elgg_register_menu_item('page', array('name'=>'vc', 'text'=>'VideoChat', 'href'=>'videochat/vc', 'contexts'=>array('videochat'), ));
	//elgg_register_menu_item('page', array('name'=>'dolly', 'text'=>'Hello dolly', 'href'=>'hello/dolly', 'contexts'=>array('hello'), ));
}

function vc_page_handler($page, $identifier){
	$plugin_path = elgg_get_plugins_path();
	$base_path = $plugin_path."VideoChat/pages/videochat";
	switch ($page[0]){
		case 'vc':
			require "$base_path/vc.php";
			break;
		default:
			echo "request for $identifier $page[0]";	
	}
	return true;
} 
 
?>