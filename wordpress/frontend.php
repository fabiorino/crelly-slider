<?php

// Code output
function crellySlider($alias) {
	CrellySliderFrontend::output($alias, true);
}

function getCrellySlider($alias) {
	CrellySliderFrontend::output($alias, false);
}

class CrellySliderFrontend {
	
	public static function setNotAdminJs() {
		add_action('wp_enqueue_scripts', 'CrellySliderFrontend::notAdminJs');
	}
	
	// Shortcode
	public static function shortcode($atts) {
		$a = shortcode_atts( array(
			'alias' => false,
		), $atts );

		if(! $a['alias']) {
			return __('You have to insert a valid alias in the shortcode', 'crellyslider');
		}
		else {
			return CrellySliderFrontend::output($a['alias'], false);
		}
	}

	public static function addShortcode() {
		add_shortcode('crellyslider', array( __CLASS__, 'shortcode'));
	}

	public static function output($alias, $echo) {
		global $wpdb;
		
		$slider = $wpdb->get_row('SELECT * FROM ' . $wpdb->prefix . 'crellyslider_sliders WHERE alias = \'' . $alias . '\'');
		
		if(! $slider) {
			if($echo) {
				_e('The slider hasn\'t been found', 'crellyslider');
				return;
			}
			else {
				return __('The slider hasn\'t been found', 'crellyslider');
			}
		}
		
		$slider_id = $slider->id;
		$slides = $wpdb->get_results('SELECT * FROM ' . $wpdb->prefix . 'crellyslider_slides WHERE slider_parent = ' . $slider_id . ' ORDER BY position');
		
		$output = '';
		
		$output .= '<div style="display: none;" class="crellyslider-slider crellyslider-slider-' . $slider->layout . ' crellyslider-slider-' . $alias . '" id="crellyslider-' . $slider_id . '">' . "\n";
		$output .= '<ul>' . "\n";
		foreach($slides as $slide) {
			$background_type_image = $slide->background_type_image == 'undefined' || $slide->background_type_image == 'none' ? 'none;' : 'url(\'' . $slide->background_type_image . '\');';
			$output .= '<li' .  "\n" .
			'style="' . "\n" .
			'background-color: ' . $slide->background_type_color . ';' . "\n" .
			'background-image: ' . $background_type_image . "\n" .
			'background-position-x: ' . $slide->background_propriety_position_x . ';' . "\n" .
			'background-position-y: ' . $slide->background_propriety_position_y . ';' . "\n" .
			'background-repeat: ' . $slide->background_repeat . ';' . "\n" .
			'background-size: ' . $slide->background_propriety_size . ';' . "\n" .
			stripslashes($slide->custom_css) . "\n" .
			'"' . "\n" .
			
			'data-in="' . $slide->data_in . '"' . "\n" .
			'data-ease-in="' . $slide->data_easeIn . '"' . "\n" .
			'data-out="' . $slide->data_out . '"' . "\n" .
			'data-ease-out="' . $slide->data_easeOut . '"' . "\n" .
			'data-time="' . $slide->data_time . '"' . "\n" .
			'>' . "\n";
			
			$slide_parent = $slide->position;
			$elements = $wpdb->get_results('SELECT * FROM ' . $wpdb->prefix . 'crellyslider_elements WHERE slider_parent = ' . $slider_id . ' AND slide_parent = ' . $slide_parent);	
			
			foreach($elements as $element) {
				if($element->link != '') {
					$target = $element->link_new_tab == 1 ? 'target="_blank"' : '';
					
					$output .= '<a' . "\n" .
					'data-delay="' . $element->data_delay . '"' . "\n" .
					'data-ease-in="' . $element->data_easeIn . '"' . "\n" .
					'data-ease-out="' . $element->data_easeOut . '"' . "\n" .
					'data-in="' . $element->data_in . '"' . "\n" .
					'data-out="' . $element->data_out . '"' . "\n" .
					'data-ignore-ease-out="' . $element->data_ignoreEaseOut . '"' . "\n" .
					'data-top="' . $element->data_top . '"' . "\n" .
					'data-left="' . $element->data_left . '"' . "\n" .
					'data-time="' . $element->data_time . '"' . "\n" .
					'href="' . stripslashes($element->link) . '"' . "\n" .
					$target . "\n" .
					'style="' .
					'z-index: ' . $element->z_index . ';' . "\n" .
					'">' .  "\n";
				}
				
				switch($element->type) {
					case 'text':
						$output .= '<div' . "\n" .
						'style="';
						if($element->link == '') {
							$output .= 'z-index: ' . $element->z_index . ';' . "\n";
						}
						$output .= stripslashes($element->custom_css) . "\n" .
						'"' .  "\n";
						if($element->link == '') {
							$output .= 'data-delay="' . $element->data_delay . '"' . "\n" .
							'data-ease-in="' . $element->data_easeIn . '"' . "\n" .
							'data-ease-out="' . $element->data_easeOut . '"' . "\n" .
							'data-in="' . $element->data_in . '"' . "\n" .
							'data-out="' . $element->data_out . '"' . "\n" .
							'data-ignore-ease-out="' . $element->data_ignoreEaseOut . '"' . "\n" .
							'data-top="' . $element->data_top . '"' . "\n" .
							'data-left="' . $element->data_left . '"' . "\n" .
							'data-time="' . $element->data_time . '"' . "\n";
						}
						$output .= '>' . "\n" .
						stripslashes($element->inner_html) . "\n" .
						'</div>' . "\n";
					break;
					case 'image':
						$output .= '<img' . "\n" .
						'src="' . $element->image_src . '"' . "\n" .
						'alt="' . $element->image_alt . '"' . "\n" .
						'style="' . "\n";
						if($element->link == '') {
							$output .= 'z-index: ' . $element->z_index . ';' . "\n";
						}
						$output .= stripslashes($element->custom_css) . "\n" .
						'"' . "\n";
						if($element->link == '') {
							$output .= 'data-delay="' . $element->data_delay . '"' . "\n" .
							'data-ease-in="' . $element->data_easeIn . '"' . "\n" .
							'data-ease-out="' . $element->data_easeOut . '"' . "\n" .
							'data-in="' . $element->data_in . '"' . "\n" .
							'data-out="' . $element->data_out . '"' . "\n" .
							'data-ignore-ease-out="' . $element->data_ignoreEaseOut . '"' . "\n" .
							'data-top="' . $element->data_top . '"' . "\n" .
							'data-left="' . $element->data_left . '"' . "\n" .
							'data-time="' . $element->data_time . '"' . "\n";
						}
						$output .= '/>' . "\n";
					break;
				}
				
				if($element->link != '') {
					$output .= '</a>' . "\n";
				}
			}
			
			$output .= '</li>' . "\n";
		}
		$output .= '</ul>' . "\n";
		$output .= '</div>' . "\n";
		
		$output .= '<script type="text/javascript">' . "\n";
		$output .= '(function($) {' . "\n";
		$output .= '$(document).ready(function() {' . "\n";
		$output .= '$("#crellyslider-' . $slider_id  . '").crellySlider({' . "\n";
		$output .= 'layout: \'' . $slider->layout . '\',' . "\n";
		$output .= 'responsive: ' . $slider->responsive . ',' . "\n";
		$output .= 'startWidth: ' . $slider->startWidth . ',' . "\n";
		$output .= 'startHeight: ' . $slider->startHeight . ',' . "\n";
		$output .= 'automaticSlide: ' . $slider->automaticSlide . ',' . "\n";
		$output .= 'showControls: ' . $slider->showControls . ',' . "\n";
		$output .= 'showNavigation: ' . $slider->showNavigation . ',' . "\n";
		$output .= 'enableSwipe: ' . $slider->enableSwipe . ',' . "\n";
		$output .= 'showProgressBar: ' . $slider->showProgressBar . ',' . "\n";
		$output .= 'pauseOnHover: ' . $slider->pauseOnHover . ',' . "\n";
		$output .= $slider->callbacks . "\n";
		$output .= '});' . "\n";
		$output .= '});' . "\n";
		$output .= '})(jQuery);' . "\n";
		$output .= '</script>' . "\n";
		
		if($echo) {
			echo $output;
		}
		else {
			return $output;
		}
	}

}