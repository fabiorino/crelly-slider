<?php
/********************/
/** AJAX CALLBACKS **/
/********************/

// Inserts an array into the database
// https://github.com/mirzazeyrek/wp-multiple-insert
function crellyslider_wp_insert_rows($row_arrays = array(), $wp_table_name) {
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

// Add slider
add_action('wp_ajax_crellyslider_addSlider', 'crellyslider_addSlider_callback');
function crellyslider_addSlider_callback() {
	global $wpdb;
	$options = $_POST['datas'];
	
	$output = crellyslider_insertSliderSQL($options);
	
	// Returning
	$output = json_encode($wpdb->insert_id);
	if(is_array($output)) print_r($output);
	else echo $output;
	
	die();
}

function crellyslider_insertSliderSQL($options) {
	global $wpdb;
	
	return $wpdb->insert(
		$wpdb->prefix . 'crellyslider_sliders',
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
	
	$output = true;
	
	// Remove all the old slides
	$output = $wpdb->delete($wpdb->prefix . 'crellyslider_slides', array('slider_parent' => $options['slider_parent']), array('%d'));
	if($output === false) {
		echo json_encode(false);
	}
	else {
		// It's impossible to have 0 slides (jQuery checks it)
		$output = crellyslider_wp_insert_rows($options['options'], $wpdb->prefix . 'crellyslider_slides');
		
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
	
	$output = true;	
	
	// Remove all the old elements
	$output = $wpdb->delete($wpdb->prefix . 'crellyslider_elements', array('slider_parent' => $options['slider_parent']), array('%d'));
	if($output === false) {
		echo json_encode(false);
	}
	else {
		// No elements
		$quick_temp = json_decode(stripslashes($options['options']));
		if(empty($quick_temp)) {
			echo json_encode(true);
		}
		else {			
			$options_array = json_decode(stripslashes($options['options']));
			
			$output = crellyslider_wp_insert_rows($options_array, $wpdb->prefix . 'crellyslider_elements');
			
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

// Duplicate slider and its content
add_action('wp_ajax_crellyslider_duplicateSlider', 'crellyslider_duplicateSlider_callback');
function crellyslider_duplicateSlider_callback() {
	global $wpdb;
	$options = $_POST['datas'];
	
	$output = true;
	$real_output = true;
	
	$slider_id = $options['id'];
	
	$cloned_slider_name = '';
	$cloned_slider_alias = '';
	
	$sliders = $wpdb->get_results('SELECT * FROM ' . $wpdb->prefix . 'crellyslider_sliders WHERE id = \'' . $slider_id . '\'', ARRAY_A);
	foreach($sliders as $slider) {
		$cloned_slider_name = $slider['name'] = $slider['name'] . '_' . __('Copy', 'crellyslider');
		$cloned_slider_alias = $slider['alias'] = $slider['alias'] . '_' . __('copy', 'crellyslider');
		$output = crellyslider_insertSliderSQL($slider);
	}
	
	if($output === false) {
		$real_output = false;
	}
	else {
		$cloned_slider_id = $wpdb->insert_id;
		
		// Clone slides
		$slides = $wpdb->get_results('SELECT * FROM ' . $wpdb->prefix . 'crellyslider_slides WHERE slider_parent = ' . $slider_id . ' ORDER BY position', ARRAY_A);
		if(empty($slides)) {
			$output = true;
		}
		else {
			foreach($slides as $key => $slide) {
				unset($slides[$key]['id']);
				$slides[$key]['slider_parent'] = $cloned_slider_id;
			}
			$temp = crellyslider_wp_insert_rows($slides, $wpdb->prefix . 'crellyslider_slides');
			if($temp === false) {
				$output = false;
			}
		}
		
		// Clone elements
		$elements = $wpdb->get_results('SELECT * FROM ' . $wpdb->prefix . 'crellyslider_elements WHERE slider_parent = ' . $slider_id, ARRAY_A);
		if(empty($elements)) {
			$output = true;
		}
		else {
			foreach($elements as $key => $element) {
				unset($elements[$key]['id']);
				$elements[$key]['slider_parent'] = $cloned_slider_id;
			}
			$temp = crellyslider_wp_insert_rows($elements, $wpdb->prefix . 'crellyslider_elements');
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

// Exports the slider in xml
add_action('wp_ajax_crellyslider_exportSlider', 'crellyslider_exportSlider_callback');
function crellyslider_exportSlider_callback() {
	global $wpdb;
	
	// Clear the temp folder
	array_map('unlink', glob(CS_PATH . '/wordpress/temp/*'));
	
	$options = $_POST['datas'];
	
	$real_output = true;
	
	$result = array();
	
	// Get the slider
	$sliders = $wpdb->get_results('SELECT * FROM ' . $wpdb->prefix . 'crellyslider_sliders WHERE id = \'' . $options['id'] . '\'', ARRAY_A);
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
	if($zip->open(CS_PATH . '/wordpress/temp/' . $filename, ZipArchive::CREATE) !== TRUE) {
		echo false;
		die();
	}
	
	// Get the slides
	$slides = $wpdb->get_results('SELECT * FROM ' . $wpdb->prefix . 'crellyslider_slides WHERE slider_parent = ' . $options['id'] . ' ORDER BY position', ARRAY_A);
	if(! empty($slides)) {
		foreach($slides as $key => $temp) {
			unset($slides[$key]['id']);
			unset($slides[$key]['slider_parent']);
			
			// Add images to zip and remove media directory URLs
			if($slides[$key]['background_type_image'] != 'none' && $slides[$key]['background_type_image'] != 'undefined') {
				$img = $slides[$key]['background_type_image'];
				$zip->addFromString(basename($img), file_get_contents($img));
				$slides[$key]['background_type_image'] = basename($img);
			}
		}
		$result['slides'] = $slides;
	}
	
	// Get the elements
	$elements = $wpdb->get_results('SELECT * FROM ' . $wpdb->prefix . 'crellyslider_elements WHERE slider_parent = ' . $options['id'], ARRAY_A);
	if(! empty($elements)) {
		foreach($elements as $key => $temp) {
			unset($elements[$key]['id']);
			unset($elements[$key]['slider_parent']);
			
			// Add images to zip and remove media directory URLs
			if($elements[$key]['type'] == 'image') {
				$img = $elements[$key]['image_src'];
				$zip->addFromString(basename($img), file_get_contents($img));
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
			'url' => CS_PLUGIN_URL . '/wordpress/temp/' . $filename,
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

// Inport the slider from a json string
add_action('wp_ajax_crellyslider_importSlider', 'crellyslider_importSlider_callback');
function crellyslider_importSlider_callback() {
	global $wpdb;
	
	// Clear the temp folder
	array_map('unlink', glob(CS_PATH . '/wordpress/temp/*'));
	
	foreach($_FILES as $file) {		
		$output = true;
		$real_output = true;
		
		$zip = new ZipArchive();
		if($zip->open($file['tmp_name']) !== TRUE) {
			echo false;
			die();
		}
		
		$zip->extractTo(CS_PATH . '/wordpress/temp/');
		
		$imported_array = json_decode(file_get_contents(CS_PATH . '/wordpress/temp/slider.json'));
		
		$sliders = $imported_array->sliders;
		foreach($sliders as $slider) {
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
						$upload = media_sideload_image(CS_PLUGIN_URL . '/wordpress/temp/' . $slides[$key]->background_type_image, 0, null, 'src');
						$slides[$key]->background_type_image = $upload;
					}
				}
				$temp = crellyslider_wp_insert_rows($slides, $wpdb->prefix . 'crellyslider_slides');
				if($temp === false) {
					$output = false;
				}
			}
			
			// Import elements
			$elements = (array) $imported_array->elements;
			if(empty($elements)) {
				$output = true;
			}
			else {
				foreach($elements as $key => $element) {
					$elements[$key]->slider_parent = $imported_slider_id;
					
					// Set images
					if($elements[$key]->type == 'image') {
						$upload = media_sideload_image(CS_PLUGIN_URL . '/wordpress/temp/' . $elements[$key]->image_src, 0, null, 'src');
						$elements[$key]->image_src = $upload;
					}
				}
				$temp = crellyslider_wp_insert_rows($elements, $wpdb->prefix . 'crellyslider_elements');
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
		
		// Returning
		$real_output = json_encode($real_output);
		if(is_array($real_output)) print_r($real_output);
		else echo $real_output;
		
		die();
	}
}
?>