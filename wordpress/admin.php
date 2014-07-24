<?php

class CrellySliderAdmin {
	
	// Creates the menu and the admin panel
	public static function showSettings() {
		add_action('admin_menu', 'CrellySliderAdmin::pluginMenus');
	}
	
	public static function pluginMenus() {
		add_menu_page('Crelly Slider', 'Crelly Slider', 'manage_options', 'crellyslider', 'CrellySliderAdmin::displayPage');
		//add_submenu_page('crellyslider', 'View Sliders', 'View Sliders', 'manage_options', 'crellyslider', 'CrellySliderAdmin::displayHome');
		//add_submenu_page('crellyslider', 'Add Slider', 'Add Slider', 'manage_options', 'cs_slider', 'CrellySliderAdmin::displaySlider');
	}
	
	// Go to the correct page
	public static function displayPage() {
		if(!isset($_GET['view'])) {
			$index = 'home';
		}
		else {
			$index = $_GET['view'];
		}
		
		global $wpdb;
		
		// Check what the user is doing: is it adding or modifying a slider? 
		if(isset($_GET['view']) && $_GET['view'] == 'add') {
			$edit = false;
			$id = NULL;
		}
		else {
			$edit = true;
			$id = isset($_GET['id']) ? $_GET['id'] : NULL;
			if(isset($id))
				$slider = $wpdb->get_row('SELECT * FROM ' . $wpdb->prefix . 'crellyslider_sliders WHERE id = ' . $id);
		}
		
		?>
		<div
		class="wrap cs-admin"
		<?php if($edit && isset($slider)): ?>
			style="width: <?php echo $slider->startWidth; ?>px;"
		<?php else: ?>
			style="width: 1170px;"
		<?php endif; ?>
		>	
		
			<noscript class="cs-no-js">
				<div class="cs-message cs-message-error" style="display: block;"><?php _e('JavaScript must be enabled to view this page correctly.', 'crellyslider'); ?></div>
			</noscript>
			
			<div class="cs-message cs-message-ok"><?php _e('Operation completed successfully.', 'crellyslider'); ?></div>
			<div class="cs-message cs-message-error"><?php _e('Something went wrong.', 'crellyslider'); ?></div>
			
			<h2 class="cs-logo" title="Crelly Slider">
				<a href="?page=crellyslider">
					<img src="<?php echo CS_PLUGIN_URL . '/wordpress/images/logo2.png' ?>" alt="Crelly Slider" />
				</a>
			</h2>
			
			<br />
			<br />
			
			<?php
			
			switch($index) {
				case 'home':
					self::displayHome();
				break;
				
				case 'add':
				case 'edit':
					self::displaySlider();
				break;
			}
			
			?>
		
		</div>
		<?php
	}
	
	// Displays the main plugin page
	public static function displayHome() {		
		?>
		<div class="cs-home">
			<?php require_once CS_PATH . 'wordpress/home.php'; ?>
		</div>
		<?php
	}
	
	// Displays the slider page in wich you can add or modify sliders, slides and elements
	public static function displaySlider() {
		global $wpdb;
		
		// Check what the user is doing: is it adding or modifying a slider? 
		if($_GET['view'] == 'add') {
			$edit = false;
			$id = NULL;	//This variable will be used in other files. It contains the ID of the SLIDER that the user is editing
		}
		else {
			$edit = true;
			$id = isset($_GET['id']) ? $_GET['id'] : NULL;
			$slider = $wpdb->get_row('SELECT * FROM ' . $wpdb->prefix . 'crellyslider_sliders WHERE id = ' . $id);
			$slides = $wpdb->get_results('SELECT * FROM ' . $wpdb->prefix . 'crellyslider_slides WHERE slider_parent = ' . $id . ' ORDER BY position');
			// The elements variable are updated in the foreachh() loop directly in the "slides.php" file
		}
		?>
		
		<div class="cs-slider <?php echo $edit ? 'cs-edit-slider' : 'cs-add-slider' ?>">
			<div class="cs-tabs cs-tabs-fade cs-tabs-switch-interface">
				<?php if($edit): ?>
					<ul>
					
						<li>
							<span class="cs-icon icon-settings"></span>
							<a href="#cs-slider-settings"><?php _e('Slider Settings', 'crellyslider'); ?></a>
						</li>
						<li>
							<span class="cs-icon icon-edit"></span>
							<a href="#cs-slides"><?php _e('Edit Slides', 'crellyslider'); ?></a>
						</li>
					</ul>
					
					<br />
					<br />
					<br />
				<?php endif; ?>
				
				<?php require_once CS_PATH . 'wordpress/slider.php'; ?>
				<?php 
				if($edit) {
					require_once CS_PATH . 'wordpress/elements.php';
					require_once CS_PATH . 'wordpress/slides.php';
				}
				?>
			</div>
			
			<br />
			
			<a class="cs-button cs-is-primary cs-save-settings" data-id="<?php echo $id; ?>" href="#"><?php _e('Save Settings', 'crellyslider'); ?></a>
			
		</div>
		
		<?php
	}
	
	// Include CSS and JavaScript
	public static function enqueues() {	
		wp_enqueue_script('jquery-ui-draggable');
		wp_enqueue_script('jquery-ui-tabs');
		wp_enqueue_script('jquery-ui-sortable');
		wp_enqueue_style('wp-color-picker');
		wp_enqueue_media();
		
		wp_register_script('crellyslider-admin', CS_PLUGIN_URL . '/wordpress/js/admin.js', array('wp-color-picker'), CS_VERSION, true);
		
		self::localization();
		
		wp_enqueue_style('crellyslider-admin', CS_PLUGIN_URL . '/wordpress/css/admin.css', array(), CS_VERSION);
		wp_enqueue_script('crellyslider-admin');
	}
			
	public static function setEnqueues() {
		add_action('admin_enqueue_scripts', 'CrellySliderAdmin::enqueues');
	}
	
	public static function localization() {
		// Here the translations for the admin.js file
		$crellyslider_translations = array(
			'slide' => __('Slide', 'crellyslider'),
			'slide_delete_confirm' => __('The slide will be deleted. Are you sure?', 'crellyslider'),
			'text_element_default_html' => __('Text element', 'crellyslider'),
			'slide_live_preview' => __('Live preview', 'crellyslider'),
			'slide_stop_preview' => __('Stop preview', 'crellyslider'),
		);
		wp_localize_script('crellyslider-admin', 'crellyslider_translations', $crellyslider_translations);
	}

}

?>