<?php

class CrellySliderCommon {
	// Include CSS
	public static function css_enqueues() {
		wp_enqueue_style('crellyslider', apply_filters('crellyslider_frontend_css_url', CS_PLUGIN_URL . '/css/crellyslider.css'), array(), CS_VERSION);
	}

	// Include JavaScript
	public static function js_enqueues() {
		wp_enqueue_script('jquery');
		wp_enqueue_script('jquery-ui-core');
		if ( defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG )
		    $frontend_js_url = CS_PLUGIN_URL . '/js/jquery.crellyslider.js';
		else
		    $frontend_js_url = CS_PLUGIN_URL . '/js/jquery.crellyslider.min.js';
		wp_enqueue_script('jquery.crellyslider', apply_filters('crellyslider_frontend_js_url', $frontend_js_url), array(), CS_VERSION, false);
	}

	public static function setEnqueues() {
		do_action( 'crellyslider_set_enqueues' );
		$enqueue_css = apply_filters( 'crellyslider_enqueue_css', true );
		$enqueue_js = apply_filters( 'crellyslider_enqueue_js', true );
		if ( $enqueue_css ) {
			add_action('wp_enqueue_scripts', array( 'CrellySliderCommon', 'css_enqueues' ));
			add_action('admin_enqueue_scripts', array( 'CrellySliderCommon', 'css_enqueues' ));
		}
		if ( $enqueue_js ) {
			add_action('wp_enqueue_scripts', array( 'CrellySliderCommon', 'js_enqueues' ));
			add_action('admin_enqueue_scripts', array( 'CrellySliderCommon', 'js_enqueues' ));
		}
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