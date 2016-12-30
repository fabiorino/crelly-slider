<?php
if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class CrellySliderCommon {
	// Includes CSS and JavaScript
	public static function enqueues() {
		wp_enqueue_script('jquery');
		wp_enqueue_script('jquery-ui-core');
		wp_enqueue_style('crellyslider', CS_PLUGIN_URL . '/css/crellyslider.css', array(), CS_VERSION);
		if(CS_DEBUG) {
			wp_enqueue_script('jquery.crellyslider', CS_PLUGIN_URL . '/js/jquery.crellyslider.js', array(), CS_VERSION, false);
		}
		else {
			wp_enqueue_script('jquery.crellyslider.min', CS_PLUGIN_URL . '/js/jquery.crellyslider.min.js', array(), CS_VERSION, false);
		}
	}

	public static function setEnqueues() {
		add_action('wp_enqueue_scripts', 'CrellySliderCommon::enqueues');
		add_action('admin_enqueue_scripts', 'CrellySliderCommon::enqueues');
	}

	// Loads language file
	public static function textDomain() {
		$locale = apply_filters('plugin_locale', get_locale(), 'crelly-slider');
		load_textdomain('crelly-slider', WP_LANG_DIR . '/crelly-slider/crelly-slider-' . $locale . '.mo');
		load_plugin_textdomain('crelly-slider', false, dirname(plugin_basename(__FILE__)) . '/languages');
	}

	public static function loadPluginTextDomain() {
		add_action('plugins_loaded', 'CrellySliderCommon::textDomain');
	}

	// Returns true if a slider exists into the database. False if it doesn't
	public static function sliderExists($id) {
		global $wpdb;
		$slider = $wpdb->get_row($wpdb->prepare('SELECT id FROM ' . $wpdb->prefix . 'crellyslider_sliders WHERE id = %d', esc_sql($id)));
		if($slider != NULL) {
			return true;
		}
		return false;
	}
}
?>
