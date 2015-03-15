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
	
	// Loads language file
	public static function textDomain() { 
		$locale = apply_filters('plugin_locale', get_locale(), 'crellyslider');
		load_textdomain('crellyslider', WP_LANG_DIR . '/crellyslider/crellyslider-' . $locale . '.mo');
		load_plugin_textdomain('crellyslider', false, dirname(plugin_basename(__FILE__)) . '/languages');
	}
	
	public static function loadPluginTextDomain() {
		add_action('plugins_loaded', 'CrellySliderCommon::textDomain');
	}
}
?>