<?php
if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

require_once CS_PATH . 'wordpress/helpers.php';

/********************/
/** AJAX CALLBACKS **/
/********************/

// Inserts an array into the database
// https://github.com/mirzazeyrek/wp-multiple-insert
function crellyslider_wp_insert_rows($wp_table_name, $row_arrays = array()) {
	global $wpdb;
	$wp_table_name = esc_sql($wp_table_name);
	// Setup arrays for Actual Values, and Placeholders
	$values = array();
	$place_holders = array();
	$query = "";
	$query_columns = "";

	$query .= "INSERT INTO {$wp_table_name} (";

	        foreach($row_arrays as $count => $row_array)
	        {

	            foreach($row_array as $key => $value) {

	                if($count == 0) {
	                    if($query_columns) {
	                    $query_columns .= ",".$key."";
	                    } else {
	                    $query_columns .= "".$key."";
	                    }
	                }

	                $values[] =  $value;

	                if(is_numeric($value)) {
	                    if(isset($place_holders[$count])) {
	                    $place_holders[$count] .= ", '%d'";
	                    } else {
	                    $place_holders[$count] = "( '%d'";
	                    }
	                } else {
	                    if(isset($place_holders[$count])) {
	                    $place_holders[$count] .= ", '%s'";
	                    } else {
	                    $place_holders[$count] = "( '%s'";
	                    }
	                }
	            }
	                    // mind closing the GAP
	                    $place_holders[$count] .= ")";
	        }

	$query .= " $query_columns ) VALUES ";

	$query .= implode(', ', $place_holders);

	if($wpdb->query($wpdb->prepare($query, $values))){
	    return true;
	} else {
	    return false;
	}

}

add_action('wp_ajax_crellyslider_listSlidersForGutenberg', 'crellyslider_listSlidersForGutenberg_callback');
function crellyslider_listSlidersForGutenberg_callback() {
	if(! check_ajax_referer('crellyslider_list-sliders-for-gutenberg', 'security', false)) {
		die('Could not verify nonce');
	}

	class SliderForGutenbergBlock {
		public $id;
		public $name;
		public $alias;
		public $backgroundImage;
		public $backgroundColor;
		public $backgroundRepeat;
	}

	$slidersForGutenberg = array();
	global $wpdb;
	$sliders = $wpdb->get_results('SELECT id, alias, name FROM ' . $wpdb->prefix . 'crellyslider_sliders');
	if($wpdb->last_error) {
		echo json_encode(false);
		die();
	}
	foreach($sliders as $slider) {
		$sliderForGutenberg = new SliderForGutenbergBlock();
		$sliderID = $slider->id;
		$sliderForGutenberg->id = $sliderID;
		$sliderForGutenberg->name =  $slider->name;
		$sliderForGutenberg->alias =  $slider->alias;
		$slide = $wpdb->get_results($wpdb->prepare(
			'SELECT background_type_image, background_type_color, background_repeat FROM ' . $wpdb->prefix . 'crellyslider_slides WHERE slider_parent = %d AND position = 0 AND draft = 0', $sliderID
		));
		if($wpdb->last_error) {
			echo json_encode(false);
			die();
		}
		if($slide) {
			$slide = $slide[0];
			if($slide->background_type_image != 'undefined' && $slide->background_type_image != 'none') {
				$sliderForGutenberg->backgroundImage = CrellySliderCommon::getURL($slide->background_type_image);
			}
			$sliderForGutenberg->backgroundColor = esc_attr($slide->background_type_color);
			$sliderForGutenberg->backgroundRepeat = esc_attr($slide->background_repeat);
		}
		$slidersForGutenberg[$slider->alias] = $sliderForGutenberg;
	}
	if(! $slidersForGutenberg) {
		echo json_encode(null);
		die();
	}
	echo json_encode($slidersForGutenberg);
	die();
}

// Add slider
add_action('wp_ajax_crellyslider_addSlider', 'crellyslider_addSlider_callback');
function crellyslider_addSlider_callback() {
	if(! current_user_can(CS_MIN_CAPABILITY)) {
		die('User must be able to ' . CS_MIN_CAPABILITY . ' to execute this function');
	}
	if(! check_ajax_referer('crellyslider_add-slider', 'security', false)) {
		die('Could not verify nonce');
	}

	global $wpdb;
	$options = $_POST['datas'];

	$output = crellyslider_insertSliderSQL($options);

	// Returning
	$output = json_encode(esc_sql($wpdb->insert_id));
	if(is_array($output)) print_r($output);
	else echo $output;

	die();
}

function crellyslider_insertSliderSQL($options) {
	global $wpdb;

	return $wpdb->insert(
		$wpdb->prefix . 'crellyslider_sliders',
		array(
			'name' => sanitize_text_field($options['name']),
			'alias' => sanitize_text_field($options['alias']),
			'layout' => sanitize_key($options['layout']),
			'responsive' => $options['responsive'],
			'startWidth' => $options['startWidth'],
			'startHeight' => $options['startHeight'],
			'automaticSlide' => $options['automaticSlide'],
			'showControls' => $options['showControls'],
			'showNavigation' => $options['showNavigation'],
			'showProgressBar' => $options['showProgressBar'],
			'pauseOnHover' => $options['pauseOnHover'],
			'callbacks' => $options['callbacks'],
			'randomOrder' => $options['randomOrder'],
			'startFromSlide' => $options['startFromSlide'],
			'enableSwipe' => $options['enableSwipe'],
			'fromDate' => sanitize_text_field($options['fromDate']),
			'toDate' => sanitize_text_field($options['toDate']),
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
			'%d',
			'%d',
			'%s',
			'%s',
		)
	);
}

// Edit slider
add_action('wp_ajax_crellyslider_editSlider', 'crellyslider_editSlider_callback');
function crellyslider_editSlider_callback() {
	if(! current_user_can(CS_MIN_CAPABILITY)) {
		die('User must be able to ' . CS_MIN_CAPABILITY . ' to execute this function');
	}

	global $wpdb;
	$options = $_POST['datas'];
	$table_name = $wpdb->prefix . 'crellyslider_sliders';

	if(!CrellySliderCommon::sliderExists((esc_sql($options['id'])))) {
		echo json_encode(false);
		return;
	}

	if(! isset($_POST['security']) || ! CrellySliderHelpers::verifyNonce(esc_sql($options['id']), esc_sql($_POST['security']))) {
		die('Could not verify nonce');
	}

	$output = $wpdb->update(
		$table_name,
		array(
			'name' => sanitize_text_field($options['name']),
			'alias' => sanitize_text_field($options['alias']),
			'layout' => sanitize_key($options['layout']),
			'responsive' => $options['responsive'],
			'startWidth' => $options['startWidth'],
			'startHeight' => $options['startHeight'],
			'automaticSlide' => $options['automaticSlide'],
			'showControls' => $options['showControls'],
			'showNavigation' => $options['showNavigation'],
			'showProgressBar' => $options['showProgressBar'],
			'pauseOnHover' => $options['pauseOnHover'],
			'callbacks' => $options['callbacks'],
      		'randomOrder' => $options['randomOrder'],
      		'startFromSlide' => $options['startFromSlide'],
			'enableSwipe' => $options['enableSwipe'],
			'fromDate' => sanitize_text_field($options['fromDate']),
			'toDate' => sanitize_text_field($options['toDate']),
		),
		array('id' => esc_sql($options['id'])),
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
			'%d',
			'%d',
			'%s',
			'%s',
		),
		array('%d')
	);

	// Returning
	$output = json_encode($output);
	if(is_array($output)) print_r($output);
	else echo $output;

	die();
}

// Edit slides. Receives an array with all the slides options. Delete al the old slides (performs a backup first) then recreate them
add_action('wp_ajax_crellyslider_editSlides', 'crellyslider_editSlides_callback');
function crellyslider_editSlides_callback() {
	if(! current_user_can(CS_MIN_CAPABILITY)) {
		die('User must be able to ' . CS_MIN_CAPABILITY . ' to execute this function');
	}

	global $wpdb;
	$options = $_POST['datas'];

	if(!CrellySliderCommon::sliderExists((esc_sql($options['slider_parent'])))) {
		echo json_encode(false);
		return;
	}

	if(! isset($_POST['security']) || ! CrellySliderHelpers::verifyNonce(esc_sql($options['slider_parent']), esc_sql($_POST['security']))) {
		die('Could not verify nonce');
	}

	// Get the latest slide ID. If we are able to save the new slides succesfully, we remove the old ones, otherwise we do the opposite
	$latestID = $wpdb->get_results($wpdb->prepare('SELECT id FROM ' . $wpdb->prefix . 'crellyslider_slides WHERE slider_parent = %d ORDER BY id DESC LIMIT 0, 1', esc_sql($options['slider_parent'])), ARRAY_A);
	if(!empty($latestID)) {
		$latestID = $latestID[0]['id'];
	}
	else {
		$latestID = null;
	}

	// It's impossible to have 0 slides (jQuery checks it)
	if(count($options['options']) == 0) {
		echo json_encode(false);
		return;
	}

	$options_array = array();
	for($i = 0; $i < count($options['options']); $i++) {
		$options_array[$i] = (object)($options['options'][$i]);
	}

	$output = crellyslider_insertSlidesSQL($options_array);

	if($output) {
		// Remove all the old slides
		if($latestID != null) {
			$output = $wpdb->query($wpdb->prepare('DELETE FROM ' . $wpdb->prefix . 'crellyslider_slides WHERE slider_parent = %d AND id <= %d', esc_sql($options['slider_parent']), $latestID));
		}
	}
	else {
		// Remove all the new slides
		if($latestID != null) {
			$wpdb->query($wpdb->prepare('DELETE FROM ' . $wpdb->prefix . 'crellyslider_slides WHERE slider_parent = %d AND id > %d', esc_sql($options['slider_parent']), $latestID));
		}
	}

	// Returning
	$output = json_encode($output);
	if(is_array($output)) print_r($output);
	else echo $output;

	die();
}

function crellyslider_insertSlidesSQL($options) {
	global $wpdb;

	// Sanitize input
	for($i = 0; $i < count($options); $i++) {
		$options[$i]->background_type_image = sanitize_text_field($options[$i]->background_type_image);
		$options[$i]->background_type_color = sanitize_text_field($options[$i]->background_type_color);
		$options[$i]->background_repeat = sanitize_text_field($options[$i]->background_repeat);
		$options[$i]->background_propriety_size = sanitize_text_field($options[$i]->background_propriety_size);
		$options[$i]->data_in = sanitize_text_field($options[$i]->data_in);
		$options[$i]->data_out = sanitize_text_field($options[$i]->data_out);
		$options[$i]->link = sanitize_text_field($options[$i]->link);
		$options[$i]->custom_css = sanitize_textarea_field($options[$i]->custom_css);
	}

	return crellyslider_wp_insert_rows($wpdb->prefix . 'crellyslider_slides', $options);
}

// Edit elements. Receives an array with all the elements options. Delete al the old elements (performs a backup first) then recreate them
add_action('wp_ajax_crellyslider_editElements', 'crellyslider_editElements_callback');
function crellyslider_editElements_callback() {
	if(! current_user_can(CS_MIN_CAPABILITY)) {
		die('User must be able to ' . CS_MIN_CAPABILITY . ' to execute this function');
	}

	global $wpdb;
	$options = $_POST['datas'];

	if(!CrellySliderCommon::sliderExists((esc_sql($options['slider_parent'])))) {
		echo json_encode(false);
		return;
	}

	if(! isset($_POST['security']) || ! CrellySliderHelpers::verifyNonce(esc_sql($options['slider_parent']), esc_sql($_POST['security']))) {
		die('Could not verify nonce');
	}

	$output = true;

	// If no elements just delete the existing ones
	if(empty(json_decode(stripslashes($options['options'])))) {
		// Remove all the old elements
		$output = $wpdb->delete($wpdb->prefix . 'crellyslider_elements', array('slider_parent' => esc_sql($options['slider_parent'])), array('%d'));
		if($output === false) {
			echo json_encode(false);
		}
		// Generate new nonce and return it
		else {
			$newNonce = CrellySliderHelpers::setNonce(esc_sql($options['slider_parent']));
			echo json_encode($newNonce);
		}
	}
	else {
		// Get the latest element ID. If we are able to save the new elements succesfully, we remove the old ones, otherwise we do the opposite
		$latestID = $wpdb->get_results($wpdb->prepare('SELECT id FROM ' . $wpdb->prefix . 'crellyslider_elements WHERE slider_parent = %d ORDER BY id DESC LIMIT 0, 1', esc_sql($options['slider_parent'])), ARRAY_A);
		if(!empty($latestID)) {
			$latestID = $latestID[0]['id'];
		}
		else {
			$latestID = null;
		}

		$options_array = json_decode(stripslashes($options['options']));

		$output = crellyslider_insertElementsSQL($options_array);

		if($output) {
			// Remove all the old elements
			if($latestID != null) {
				$output = $wpdb->query($wpdb->prepare('DELETE FROM ' . $wpdb->prefix . 'crellyslider_elements WHERE slider_parent = %d AND id <= %d', esc_sql($options['slider_parent']), $latestID));
			}

			// Generate new nonce and return it
			$newNonce = CrellySliderHelpers::setNonce(esc_sql($options['slider_parent']));
			echo json_encode($newNonce);
			die();
		}
		else {
			// Remove all the new elements
			if($latestID != null) {
				$wpdb->query($wpdb->prepare('DELETE FROM ' . $wpdb->prefix . 'crellyslider_elements WHERE slider_parent = %d AND id > %d', esc_sql($options['slider_parent']), $latestID));
			}
		}

		// Returning
		$output = json_encode($output);
		if(is_array($output)) print_r($output);
		else echo $output;
	}

	die();
}

function crellyslider_insertElementsSQL($options) {
	global $wpdb;

	// Sanitize input
	for($i = 0; $i < count($options); $i++) {
		$options[$i]->image_src = sanitize_text_field($options[$i]->image_src);
		$options[$i]->image_alt = sanitize_text_field($options[$i]->image_alt);
		$options[$i]->data_in = sanitize_text_field($options[$i]->data_in);
		$options[$i]->data_out = sanitize_text_field($options[$i]->data_out);
		$options[$i]->custom_css_classes = sanitize_text_field($options[$i]->custom_css_classes);
		$options[$i]->link = sanitize_text_field($options[$i]->link);
		$options[$i]->video_id = sanitize_text_field($options[$i]->video_id);
	}

	return crellyslider_wp_insert_rows($wpdb->prefix . 'crellyslider_elements', $options);
}

// Delete slider and its content
add_action('wp_ajax_crellyslider_deleteSlider', 'crellyslider_deleteSlider_callback');
function crellyslider_deleteSlider_callback() {
	if(! current_user_can(CS_MIN_CAPABILITY)) {
		die('User must be able to ' . CS_MIN_CAPABILITY . ' to execute this function');
	}
	if(! check_ajax_referer('crellyslider_delete-slider', 'security', false)) {
		die('Could not verify nonce');
	}

	global $wpdb;
	$options = $_POST['datas'];

	if(!CrellySliderCommon::sliderExists((esc_sql($options['id'])))) {
		echo json_encode(false);
		return;
	}

	$real_output = true;

	// Delete slider
	$table_name = $wpdb->prefix . 'crellyslider_sliders';
	$output = $wpdb->delete($table_name, array('id' => esc_sql($options['id'])), array('%d'));
	if($output === false) {
		$real_output = false;
	}

	// Delete slides
	$table_name = $wpdb->prefix . 'crellyslider_slides';
	$output = $wpdb->delete($table_name, array('slider_parent' => esc_sql($options['id'])), array('%d'));
	if($output === false) {
		$real_output = false;
	}

	// Delete elements
	$table_name = $wpdb->prefix . 'crellyslider_elements';
	$output = $wpdb->delete($table_name, array('slider_parent' => esc_sql($options['id'])), array('%d'));
	if($output === false) {
		$real_output = false;
	}

	$output = CrellySliderHelpers::removeNonce(esc_sql($options['id']));
	if($output === false) {
		$real_output = false;
	}

	// Returning
	$real_output = json_encode($real_output);
	if(is_array($real_output)) print_r($real_output);
	else echo $real_output;

	die();
}

// Duplicate slider and its content
add_action('wp_ajax_crellyslider_duplicateSlider', 'crellyslider_duplicateSlider_callback');
function crellyslider_duplicateSlider_callback() {
	if(! current_user_can(CS_MIN_CAPABILITY)) {
		die('User must be able to ' . CS_MIN_CAPABILITY . ' to execute this function');
	}
	if(! check_ajax_referer('crellyslider_duplicate-slider', 'security', false)) {
		die('Could not verify nonce');
	}

	global $wpdb;
	$options = $_POST['datas'];

	if(!CrellySliderCommon::sliderExists((esc_sql($options['id'])))) {
		echo json_encode(false);
		return;
	}

	$output = true;
	$real_output = true;

	$slider_id = esc_sql($options['id']);

	$cloned_slider_name = '';
	$cloned_slider_alias = '';

	$sliders = $wpdb->get_results($wpdb->prepare('SELECT * FROM ' . $wpdb->prefix . 'crellyslider_sliders WHERE id = %d', $slider_id), ARRAY_A);
	foreach($sliders as $slider) {
		$cloned_slider_name = $slider['name'] = $slider['name'] . '_' . __('Copy', 'crelly-slider');
		$cloned_slider_alias = $slider['alias'] = $slider['alias'] . '_' . __('copy', 'crelly-slider');
		$output = crellyslider_insertSliderSQL($slider);
	}

	if($output === false) {
		$real_output = false;
	}
	else {
		$cloned_slider_id = $wpdb->insert_id;

		// Clone slides
		$slides = $wpdb->get_results($wpdb->prepare('SELECT * FROM ' . $wpdb->prefix . 'crellyslider_slides WHERE slider_parent = %d ORDER BY position', $slider_id), ARRAY_A);
		if(empty($slides)) {
			$output = true;
		}
		else {
			foreach($slides as $key => $slide) {
				unset($slides[$key]['id']);
				$slides[$key]['slider_parent'] = $cloned_slider_id;
			}
			$temp = crellyslider_wp_insert_rows($wpdb->prefix . 'crellyslider_slides', $slides);
			if($temp === false) {
				$output = false;
			}
		}

		// Clone elements
		$elements = $wpdb->get_results($wpdb->prepare('SELECT * FROM ' . $wpdb->prefix . 'crellyslider_elements WHERE slider_parent = %d', $slider_id), ARRAY_A);
		if(empty($elements)) {
			$output = true;
		}
		else {
			foreach($elements as $key => $element) {
				unset($elements[$key]['id']);
				$elements[$key]['slider_parent'] = $cloned_slider_id;
			}
			$temp = crellyslider_wp_insert_rows($wpdb->prefix . 'crellyslider_elements', $elements);
			if($temp === false) {
				$output = false;
			}

			if($output === false) {
				$real_output = false;
			}
		}
	}

	if($real_output === true) {
		$real_output = array(
			'response' => true,
			'cloned_slider_id' => $cloned_slider_id,
			'cloned_slider_name' => $cloned_slider_name,
			'cloned_slider_alias' => $cloned_slider_alias,
		);
	}
	else {
		$real_output = array(
			'response' => false,
			'cloned_slider_id' => false,
			'cloned_slider_name' => false,
			'cloned_slider_alias' => false,
		);
	}

	// Returning
	$real_output = json_encode($real_output);
	if(is_array($real_output)) print_r($real_output);
	else echo $real_output;

	die();
}

// Exports the slider in .zip
add_action('wp_ajax_crellyslider_exportSlider', 'crellyslider_exportSlider_callback');
function crellyslider_exportSlider_callback() {
	if(! current_user_can(CS_MIN_CAPABILITY)) {
		die('User must be able to ' . CS_MIN_CAPABILITY . ' to execute this function');
	}
	if(! check_ajax_referer('crellyslider_export-slider', 'security', false)) {
		die('Could not verify nonce');
	}

	global $wpdb;

	$options = $_POST['datas'];

	if(!CrellySliderCommon::sliderExists((esc_sql($options['id'])))) {
		echo json_encode(false);
		return;
	}

	// Make dir with random name
	$dirName = uniqid();
	$tmpDir = CS_PATH . '/wordpress/temp/' . $dirName;
	mkdir($tmpDir);

	$real_output = true;

	$result = array();

	// Get the slider
	$sliders = $wpdb->get_results($wpdb->prepare('SELECT * FROM ' . $wpdb->prefix . 'crellyslider_sliders WHERE id = %d', esc_sql($options['id'])), ARRAY_A);
	if(empty($sliders)) {
		$real_output = false;
	}
	else {
		foreach($sliders as $key => $temp) {
			unset($sliders[$key]['id']);
		}
		$result['sliders'] = $sliders;
	}

	$zip = new ZipArchive();
	$filename = 'crellyslider-' . $sliders[0]['alias'] . '.zip';
	if($zip->open($tmpDir . '/' . $filename, ZipArchive::CREATE) !== TRUE) {
		echo false;
		CrellySliderHelpers::delTree($tmpDir);
		die();
	}

	// Get the slides
	$slides = $wpdb->get_results($wpdb->prepare('SELECT * FROM ' . $wpdb->prefix . 'crellyslider_slides WHERE slider_parent = %d ORDER BY position', esc_sql($options['id'])), ARRAY_A);
	if(! empty($slides)) {
		foreach($slides as $key => $temp) {
			unset($slides[$key]['id']);
			unset($slides[$key]['slider_parent']);

			// Add images to zip and remove media directory URLs
			if($slides[$key]['background_type_image'] != 'none' && $slides[$key]['background_type_image'] != 'undefined') {
				$img = CrellySliderCommon::getURL($slides[$key]['background_type_image']);
				$imgFile = download_url($img);
				if(is_wp_error($imgFile)) {
					echo false;
					die();
				}
				$zip->addFile($imgFile, basename($img));
        		$slides[$key]['background_type_image'] = basename($img);
			}
		}
		$result['slides'] = $slides;
	}

	// Get the elements
	$elements = $wpdb->get_results($wpdb->prepare('SELECT * FROM ' . $wpdb->prefix . 'crellyslider_elements WHERE slider_parent = %d', esc_sql($options['id'])), ARRAY_A);
	if(! empty($elements)) {
		foreach($elements as $key => $temp) {
			unset($elements[$key]['id']);
			unset($elements[$key]['slider_parent']);

			// Add images to zip and remove media directory URLs
			if($elements[$key]['type'] == 'image') {
				$img = CrellySliderCommon::getURL($elements[$key]['image_src']);
				$imgFile = download_url($img);
				if(is_wp_error($imgFile)) {
					echo false;
					die();
				}
				$zip->addFile($imgFile, basename($img));
				$elements[$key]['image_src'] = basename($img);
			}
		}
		$result['elements'] = $elements;
	}

	$json = json_encode($result);
	$zip->addFromString("slider.json", $json);

	$zip->close();

	if($real_output === true) {
		$real_output = array(
			'response' => true,
			'url' => CS_PLUGIN_URL . "/wordpress/temp/$dirName/$filename",
		);
	}
	else {
		$real_output = array(
			'response' => false,
			'url' => false,
		);
	}

	// Returning
	$real_output = json_encode($real_output);
	if(is_array($real_output)) print_r($real_output);
	else echo $real_output;

	die();
}

// Imports a slider given a .zip in $_FILES
add_action('wp_ajax_crellyslider_importSlider', 'crellyslider_importSlider_callback');
function crellyslider_importSlider_callback() {
	if(! current_user_can(CS_MIN_CAPABILITY)) {
		die('User must be able to ' . CS_MIN_CAPABILITY . ' to execute this function');
	}
	if (! isset($_POST['security']) || ! wp_verify_nonce($_POST['security'], 'crellyslider_import-slider')) {
		die('Could not verify nonce');
	}

	foreach($_FILES as $file) {
		$real_output = crellyslider_importSlider($file['tmp_name']);

		if($real_output == false) {
			echo false;
			die();
		}

		$real_output = json_encode($real_output);
		if(is_array($real_output)) print_r($real_output);
		else echo $real_output;

		die();
	}
}

// Imports a slider given a .zip file path
function crellyslider_importSlider($filePath) {
	global $wpdb;

	// Make dir with random name
	$dirName = uniqid();
	$tmpDir = CS_PATH . '/wordpress/temp/' . $dirName;
	mkdir($tmpDir);

	$output = true;
	$real_output = true;

	$zip = new ZipArchive();
	if($zip->open($filePath) !== TRUE) {
		return false;
	}

	// The zip archive should only contain a json file and images.
	$safeFiles = array(
		'slider.json'
	);
	$safeExtensions = array(
		// List of common images extensions stolen from https://github.com/dyne/file-extension-list/blob/master/data/image
		'3dm',
		'3ds',
		'max',
		'bmp',
		'dds',
		'gif',
		'jpg',
		'jpeg',
		'png',
		'psd',
		'xcf',
		'tga',
		'thm',
		'tif',
		'tiff',
		'yuv',
		'ai',
		'eps',
		'ps',
		'svg',
		'dwg',
		'dxf',
		'gpx',
		'kml',
		'kmz',
	);
    for($i = 0; ! empty($zip->statIndex($i)['name']); $i++) {
		$fileName = $zip->statIndex($i)['name'];
		$ext = pathinfo($fileName, PATHINFO_EXTENSION);

		if(! in_array($fileName, $safeFiles) && ! in_array($ext, $safeExtensions)) {
			CrellySliderHelpers::delTree($tmpDir);
			die('Attempting to extract an unsupported file: ' . $fileName);
		}
    }

	$zip->extractTo($tmpDir);

	$imported_array = json_decode(file_get_contents($tmpDir . '/slider.json'));

	$sliders = $imported_array->sliders;
	foreach($sliders as $slider) {
		// Prevent compatiblity issues with old .zip exported sliders (< 1.2.0)
		if(! isset($slider->randomOrder)) {
			$slider->randomOrder = 0;
		}
		if(! isset($slider->startFromSlide)) {
			$slider->startFromSlide = 0;
		}

		$output = crellyslider_insertSliderSQL((array) $slider);
	}

	if($output === false) {
		$real_output = false;
	}
	else {
		$imported_slider_id = $wpdb->insert_id;

		// Import slides
		$slides = $imported_array->slides;
		if(empty($slides)) {
			$output = true;
		}
		else {
			foreach($slides as $key => $slide) {
				$slides[$key]->slider_parent = $imported_slider_id;

				// Set background images
				if($slides[$key]->background_type_image != 'undefined' && $slides[$key]->background_type_image != 'none') {
					$url = $tmpDir . '/' . $slides[$key]->background_type_image;
					$id = crellyslider_importImage($url);
					$slides[$key]->background_type_image = $id;
				}
			}
			$temp = crellyslider_insertSlidesSQL((array) $slides);
			if($temp === false) {
				$output = false;
			}
		}

		// Import elements
		$elements = isset($imported_array->elements) ? (array) $imported_array->elements : array();
		if(empty($elements)) {
			$output = true;
		}
		else {
			foreach($elements as $key => $element) {
				$elements[$key]->slider_parent = $imported_slider_id;

				// Set images
				if($elements[$key]->type == 'image') {
					$url = $tmpDir . '/' . $elements[$key]->image_src;
					$id = crellyslider_importImage($url);
					$elements[$key]->image_src = $id;
				}
			}
			$temp = crellyslider_insertElementsSQL((array) $elements);
			if($temp === false) {
				$output = false;
			}

			if($output === false) {
				$real_output = false;
			}
		}
	}

	if($real_output === true) {
		$real_output = array(
			'response' => true,
			'imported_slider_id' => $imported_slider_id,
			'imported_slider_name' => $imported_array->sliders[0]->name,
			'imported_slider_alias' => $imported_array->sliders[0]->alias,
		);
	}
	else {
		$real_output = array(
			'response' => false,
			'imported_slider_id' => false,
			'imported_slider_name' => false,
			'imported_slider_alias' => false,
		);
	}

	CrellySliderHelpers::delTree($tmpDir);

	return $real_output;
}

// Imports an image to the WordPress media library. Returns the attachment ID
// Original script: https://gist.github.com/hissy/7352933
function crellyslider_importImage($local_url) {
  $file = $local_url;
  $filename = basename($file);

  $upload_file = wp_upload_bits($filename, null, file_get_contents($file));
  if (!$upload_file['error']) {
  	$wp_filetype = wp_check_filetype($filename, null );
  	$attachment = array(
  		'post_mime_type' => $wp_filetype['type'],
  		'post_parent' => 0,
  		'post_title' => preg_replace('/\.[^.]+$/', '', $filename),
  		'post_content' => '',
  		'post_status' => 'inherit'
  	);
  	$attachment_id = wp_insert_attachment($attachment, $upload_file['file'], 0);
  	if (!is_wp_error($attachment_id)) {
  		require_once(ABSPATH . "wp-admin" . '/includes/image.php');
  		$attachment_data = wp_generate_attachment_metadata( $attachment_id, $upload_file['file'] );
  		wp_update_attachment_metadata( $attachment_id,  $attachment_data );
  	}
  }

  return $attachment_id;
}
?>
