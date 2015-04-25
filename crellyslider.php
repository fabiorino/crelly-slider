<?php
/**
 * Plugin Name: Crelly Slider
 * Plugin URI: http://fabiorino1.altervista.org/projects/crellyslider
 * Description: The first free WordPress slider with elements animations.
 * Version: 0.8.2
 * Author: fabiorino
 * Author URI: http://fabiorino1.altervista.org
 * License: MIT
 */

/*************/
/** GLOBALS **/
/*************/ 

define('CS_VERSION', '0.8.2');
define('CS_PATH', plugin_dir_path(__FILE__));
define('CS_PLUGIN_URL', plugins_url() . '/crelly-slider');

require_once CS_PATH . 'wordpress/common.php';
require_once CS_PATH . 'wordpress/tables.php';
require_once CS_PATH . 'wordpress/frontend.php';

// Create (or remove) 3 tables: the sliders settings, the slides settings and the elements proprieties. We will also store the current version of the plugin			
register_activation_hook(__FILE__, array('CrellySliderTables', 'setVersion'));			
register_activation_hook(__FILE__, array('CrellySliderTables', 'setTables'));
register_uninstall_hook(__FILE__, array('CrellySliderTables', 'removeVersion'));
register_uninstall_hook(__FILE__, array('CrellySliderTables', 'dropTables'));

// Languages
CrellySliderCommon::loadPluginTextDomain();

// This is a variable that should be included first to prevent backend issues.
if(is_admin()) {
	require_once CS_PATH . 'wordpress/admin.php';
	CrellySliderAdmin::setIsAdminJs();
}

// CSS and Javascript
CrellySliderCommon::setEnqueues();

CrellySliderFrontend::addShortcode();

if(is_admin()) {
	// Tables
	if(CS_VERSION != get_option('cs_version')) {
		CrellySliderTables::setVersion();
		CrellySliderTables::setTables();
	}
	
	CrellySliderAdmin::setEnqueues();
	CrellySliderAdmin::showSettings();
	
	// Ajax functions
	require_once CS_PATH . 'wordpress/ajax.php';	
}

?>