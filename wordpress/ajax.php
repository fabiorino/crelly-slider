<?php
/********************/
/** AJAX CALLBACKS **/
/********************/

// Add slider
add_action('wp_ajax_crellyslider_addSlider', 'crellyslider_addSlider_callback');
function crellyslider_addSlider_callback() {
	global $wpdb;
	$options = $_POST['datas'];
	$table_name = $wpdb->prefix . 'crellyslider_sliders';
	
	$output = true;		
	$output = $wpdb->insert(
		$table_name,
		array(
			'name' => $options['name'],
			'alias' => $options['alias'],
			'layout' => $options['layout'],
			'responsive' => $options['responsive'],
			'startWidth' => $options['startWidth'],
			'startHeight' => $options['startHeight'],
			'automaticSlide' => $options['automaticSlide'],
			'showControls' => $options['showControls'],
			'showNavigation' => $options['showNavigation'],
			'showProgressBar' => $options['showProgressBar'],
			'pauseOnHover' => $options['pauseOnHover'],
			'callbacks' => $options['callbacks'],
			'enableSwipe' => $options['enableSwipe'],
		),
		array(
			'%s',
			'%s',
			'%s',
			'%d',
			'%d',
			'%d',
			'%d',
			'%d',
			'%d',
			'%d',
			'%d',
			'%s',
			'%d',
		)
	);
	
	// Returning
	$output = json_encode($wpdb->insert_id);
	if(is_array($output)) print_r($output);
	else echo $output;
	
	die();
}

// Edit slider
add_action('wp_ajax_crellyslider_editSlider', 'crellyslider_editSlider_callback');
function crellyslider_editSlider_callback() {
	global $wpdb;
	$options = $_POST['datas'];
	$table_name = $wpdb->prefix . 'crellyslider_sliders';
		
	$output = $wpdb->update(
		$table_name,
		array(
			'name' => $options['name'],
			'alias' => $options['alias'],
			'layout' => $options['layout'],
			'responsive' => $options['responsive'],
			'startWidth' => $options['startWidth'],
			'startHeight' => $options['startHeight'],
			'automaticSlide' => $options['automaticSlide'],
			'showControls' => $options['showControls'],
			'showNavigation' => $options['showNavigation'],
			'showProgressBar' => $options['showProgressBar'],
			'pauseOnHover' => $options['pauseOnHover'],
			'callbacks' => $options['callbacks'],
			'enableSwipe' => $options['enableSwipe'],
		),
		array('id' => $options['id']), 
		array(
			'%s',
			'%s',
			'%s',
			'%d',
			'%d',
			'%d',
			'%d',
			'%d',
			'%d',
			'%d',
			'%d',
			'%s',
			'%d',
		),
		array('%d')
	);
	
	// Returning
	$output = json_encode($output);
	if(is_array($output)) print_r($output);
	else echo $output;
	
	die();
}

// Edit slides. Receives an array with all the slides options. Delete al the old slides then recreate them
add_action('wp_ajax_crellyslider_editSlides', 'crellyslider_editSlides_callback');
function crellyslider_editSlides_callback() {
	global $wpdb;
	$options = $_POST['datas'];
	$table_name = $wpdb->prefix . 'crellyslider_slides';
	
	$output = true;
	
	// Remove all the old slides
	$output = $wpdb->delete($table_name, array('slider_parent' => $options['slider_parent']), array('%d'));
	if($output === false) {
		echo json_encode(false);
	}
	else {
		// It's impossible to have 0 slides (jQuery checks it)
		// Insert row per row
		foreach($options['options'] as $option) {	
			$output = $wpdb->insert(
				$table_name,
				array(
					'slider_parent' => $options['slider_parent'],
					'position' => $option['position'],
					'background_type_image' => $option['background_type_image'],
					'background_type_color' => $option['background_type_color'],
					'background_propriety_position_x' => $option['background_propriety_position_x'],
					'background_propriety_position_y' => $option['background_propriety_position_y'],
					'background_repeat' => $option['background_repeat'],
					'background_propriety_size' => $option['background_propriety_size'],
					'data_in' => $option['data_in'],
					'data_out' => $option['data_out'],
					'data_time' => $option['data_time'],
					'data_easeIn' => $option['data_easeIn'],
					'data_easeOut' => $option['data_easeOut'],
					'custom_css' => stripslashes_deep($option['custom_css']),
				),
				array(
					'%d',
					'%d',
					'%s',
					'%s',
					'%s',
					'%s',
					'%s',
					'%s',
					'%s',
					'%s',
					'%d',
					'%d',
					'%d',
					'%s',
				)
			);
			
			if($output === false) {
				break;
			}
		}
		
		// Returning
		$output = json_encode($output);
		if(is_array($output)) print_r($output);
		else echo $output;
	}
	
	die();
}

// Edit elements. Receives an array with all the elements options. Delete al the old elements then recreate them
add_action('wp_ajax_crellyslider_editElements', 'crellyslider_editElements_callback');
function crellyslider_editElements_callback() {
	global $wpdb;
	$options = $_POST['datas'];
	$table_name = $wpdb->prefix . 'crellyslider_elements';
	
	$output = true;	
	
	// Remove all the old elements
	$output = $wpdb->delete($table_name, array('slider_parent' => $options['slider_parent']), array('%d'));
	if($output === false) {
		echo json_encode(false);
	}
	else {	
		// No elements
		if($options['elements'] == 0) {
			echo json_encode(true);
		}
		else {	
			// Insert row per row
			foreach($options['options'] as $option) {	
				$output = $wpdb->insert(
					$table_name,
					array(	
						'slider_parent' => $options['slider_parent'],
						'slide_parent' => $option['slide_parent'],	
						'position' => $option['position'],
						'type' => $option['type'],				
						'inner_html' => $option['inner_html'],
						'image_src' => $option['image_src'],
						'image_alt' => $option['image_alt'],
						'data_left' => $option['data_left'],
						'data_top' => $option['data_top'],
						'z_index' => $option['z_index'],
						'data_delay' => $option['data_delay'],
						'data_time' => $option['data_time'],
						'data_in' => $option['data_in'],
						'data_out' => $option['data_out'],
						'data_easeIn' => $option['data_easeIn'],
						'data_easeOut' => $option['data_easeOut'],
						'custom_css' => $option['custom_css'],
						'link' => $option['link'],
						'link_new_tab' => $option['link_new_tab'],
						'data_ignoreEaseOut' => $option['data_ignoreEaseOut'],
					),
					array(
						'%d',
						'%d',
						'%d',
						'%s',
						'%s',
						'%s',
						'%s',
						'%d',
						'%d',
						'%d',
						'%d',
						'%s',
						'%s',
						'%s',
						'%d',
						'%d',
						'%s',
						'%s',
						'%d',
						'%d',
					)
				);
				
				if($output === false) {
					break;
				}
			}
			
			// Returning
			$output = json_encode($output);
			if(is_array($output)) print_r($output);
			else echo $output;
		}
	}
	
	die();
}

// Delete slider and its content
add_action('wp_ajax_crellyslider_deleteSlider', 'crellyslider_deleteSlider_callback');
function crellyslider_deleteSlider_callback() {
	global $wpdb;
	$options = $_POST['datas'];
	
	$real_output = true;
	
	// Delete slider
	$table_name = $wpdb->prefix . 'crellyslider_sliders';		
	$output = $wpdb->delete($table_name, array('id' => $options['id']), array('%d'));
	if($output === false) {
		$real_output = false;
	}
	
	// Delete slides
	$table_name = $wpdb->prefix . 'crellyslider_slides';		
	$output = $wpdb->delete($table_name, array('slider_parent' => $options['id']), array('%d'));
	if($output === false) {
		$real_output = false;
	}
	
	// Delete elements
	$table_name = $wpdb->prefix . 'crellyslider_elements';		
	$output = $wpdb->delete($table_name, array('slider_parent' => $options['id']), array('%d'));
	if($output === false) {
		$real_output = false;
	}
	
	// Returning
	$real_output = json_encode($real_output);
	if(is_array($real_output)) print_r($real_output);
	else echo $real_output;
	
	die();
}
?>