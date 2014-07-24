<?php

class CrellySliderCommon {
	
	// Include CSS and JavaScript
	public static function enqueues() {	
		wp_enqueue_script('jquery');
		wp_enqueue_script('jquery-ui-core');
		wp_enqueue_style('crellyslider', CS_PLUGIN_URL . '/css/crellyslider.css', array(), CS_VERSION);
		wp_enqueue_script('jquery.crellyslider.min', CS_PLUGIN_URL . '/js/jquery.crellyslider.min.js', array(), CS_VERSION, false);
	}
	
	public static function setEnqueues() {
		add_action('wp_enqueue_scripts', 'CrellySliderCommon::enqueues');
		add_action('admin_enqueue_scripts', 'CrellySliderCommon::enqueues');
	}
	
}

?>