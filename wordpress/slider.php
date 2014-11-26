<div id="cs-slider-settings">
	<?php
	// Contains the key, the display name and a boolean: true if is the default option
	$slider_select_options = array(
		'layout' => array(
			'full-width' => array(__('Full Width', 'crellyslider'), false),
			'fixed' => array(__('Fixed', 'crellyslider'), true),
		),
		'boolean' => array(
			1 => array(__('Yes', 'crellyslider'), true),
			0 => array(__('No', 'crellyslider'), false),
		),
	);
	?>
	
	<?php if($edit) { ?>
		<input type="text" id="cs-slider-name" placeholder="<?php _e('Slider Name', 'crellyslider'); ?>" value="<?php echo $slider->name; ?>" />
	<?php
	}
	else { ?>
		<input type="text" id="cs-slider-name" placeholder="<?php _e('Slider Name', 'crellyslider'); ?>" />
	<?php } ?>
	
	<br />
	<br />
	
	<strong><?php _e('Alias:', 'crellyslider'); ?></strong>
	<?php if($edit) { ?>
		<span id="cs-slider-alias"><?php echo $slider->alias; ?></span>
	<?php
	}
	else { ?>
		<span id="cs-slider-alias"></span>
	<?php } ?>
	
	<br />
	<br />
	
	<strong><?php _e('Shortcode:', 'crellyslider'); ?></strong>	
	<?php if($edit) { ?>
		<span id="cs-slider-shortcode">[crellyslider alias="<?php echo $slider->alias; ?>"]</span>
	<?php
	}
	else { ?>
		<span id="cs-slider-shortcode"></span>
	<?php } ?>
	
	<br />
	<br />
	
	<table class="cs-slider-settings-list cs-table">
		<thead>
			<tr class="odd-row">
				<th colspan="3"><?php _e('Slider General Options', 'crellyslider'); ?></th>
			</tr>
		</thead>
		<tbody>
			<tr class="cs-table-header">
				<td><?php _e('Option', 'crellyslider'); ?></td>
				<td><?php _e('Parameter', 'crellyslider'); ?></td>
				<td><?php _e('Description', 'crellyslider'); ?></td>
			</tr>
			<tr>
				<td class="cs-name"><?php _e('Layout', 'crellyslider'); ?></td>
				<td class="cs-content">
					<select id="cs-slider-layout">
						<?php
						foreach($slider_select_options['layout'] as $key => $value) {
							echo '<option value="' . $key . '"';
							if((!$edit && $value[1]) || ($edit && $slider->layout == $key)) {
								echo ' selected';
							}
							echo '>' . $value[0] . '</option>';
						}
						?>
					</select>
				</td>
				<td class="cs-description">
					<?php _e('Modify the layout type of the slider.', 'crellyslider'); ?>
				</td>
			</tr>
			<tr>
				<td class="cs-name"><?php _e('Responsive', 'crellyslider'); ?></td>
				<td class="cs-content">
					<select id="cs-slider-responsive">
						<?php
						foreach($slider_select_options['boolean'] as $key => $value) {
							echo '<option value="' . $key . '"';
							if((!$edit && $value[1]) || ($edit && $slider->responsive == $key)) {
								echo ' selected';
							}
							echo '>' . $value[0] . '</option>';
						}
						?>
					</select>
				</td>
				<td class="cs-description">
					<?php _e('The slider will be adapted to the screen size.', 'crellyslider'); ?>
				</td>
			</tr>
			<tr>
				<td class="cs-name"><?php _e('Start Width', 'crellyslider'); ?></td>
				<td class="cs-content">
					<?php
					if(!$edit) echo '<input id="cs-slider-startWidth" type="text" value="1170" />';
					else echo '<input id="cs-slider-startWidth" type="text" value="' . $slider->startWidth .'" />';
					?>
					px
				</td>
				<td class="cs-description">
					<?php _e('The content initial width of the slider.', 'crellyslider'); ?>
				</td>
			</tr>
			<tr>
				<td class="cs-name"><?php _e('Start Height', 'crellyslider'); ?></td>
				<td class="cs-content">
					<?php
					if(!$edit) echo '<input id="cs-slider-startHeight" type="text" value="500" />';
					else echo '<input id="cs-slider-startHeight" type="text" value="' . $slider->startHeight .'" />';
					?>
					px
				</td>
				<td class="cs-description">
					<?php _e('The content initial height of the slider.', 'crellyslider'); ?>
				</td>
			</tr>
			<tr>
				<td class="cs-name"><?php _e('Automatic Slide', 'crellyslider'); ?></td>
				<td class="cs-content">
					<select id="cs-slider-automaticSlide">
						<?php
						foreach($slider_select_options['boolean'] as $key => $value) {
							echo '<option value="' . $key . '"';
							if((!$edit && $value[1]) || ($edit && $slider->automaticSlide == $key)) {
								echo ' selected';
							}
							echo '>' . $value[0] . '</option>';
						}
						?>
					</select>
				</td>
				<td class="cs-description">
					<?php _e('The slides loop is automatic.', 'crellyslider'); ?>
				</td>
			</tr>
			<tr>
				<td class="cs-name"><?php _e('Show Controls', 'crellyslider'); ?></td>
				<td class="cs-content">
					<select id="cs-slider-showControls">
						<?php
						foreach($slider_select_options['boolean'] as $key => $value) {
							echo '<option value="' . $key . '"';
							if((!$edit && $value[1]) || ($edit && $slider->showControls == $key)) {
								echo ' selected';
							}
							echo '>' . $value[0] . '</option>';
						}
						?>
					</select>
				</td>
				<td class="cs-description">
					<?php _e('Show the previous and next arrows.', 'crellyslider'); ?>
				</td>
			</tr>
			<tr>
				<td class="cs-name"><?php _e('Show Navigation', 'crellyslider'); ?></td>
				<td class="cs-content">
					<select id="cs-slider-showNavigation">
						<?php
						foreach($slider_select_options['boolean'] as $key => $value) {
							echo '<option value="' . $key . '"';
							if((!$edit && $value[1]) || ($edit && $slider->showNavigation == $key)) {
								echo ' selected';
							}
							echo '>' . $value[0] . '</option>';
						}
						?>
					</select>
				</td>
				<td class="cs-description">
					<?php _e('Show the links buttons to change slide.', 'crellyslider'); ?>
				</td>
			</tr>
			<tr>
				<td class="cs-name"><?php _e('Enable swipe and drag', 'crellyslider'); ?></td>
				<td class="cs-content">
					<select id="cs-slider-enableSwipe">
						<?php
						foreach($slider_select_options['boolean'] as $key => $value) {
							echo '<option value="' . $key . '"';
							if((!$edit && $value[1]) || ($edit && $slider->enableSwipe == $key)) {
								echo ' selected';
							}
							echo '>' . $value[0] . '</option>';
						}
						?>
					</select>
				</td>
				<td class="cs-description">
					<?php _e('Enable swipe left, swipe right, drag left, drag right commands.', 'crellyslider'); ?>
				</td>
			</tr>
			<tr>
				<td class="cs-name"><?php _e('Show Progress Bar', 'crellyslider'); ?></td>
				<td class="cs-content">
					<select id="cs-slider-showProgressBar">
						<?php
						foreach($slider_select_options['boolean'] as $key => $value) {
							echo '<option value="' . $key . '"';
							if((!$edit && $value[1]) || ($edit && $slider->showProgressBar == $key)) {
								echo ' selected';
							}
							echo '>' . $value[0] . '</option>';
						}
						?>
					</select>
				</td>
				<td class="cs-description">
					<?php _e('Draw the progress bar during the slide execution.', 'crellyslider'); ?>
				</td>
			</tr>
			<tr>
				<td class="cs-name"><?php _e('Pause on Hover', 'crellyslider'); ?></td>
				<td class="cs-content">
					<select id="cs-slider-pauseOnHover">
						<?php
						foreach($slider_select_options['boolean'] as $key => $value) {
							echo '<option value="' . $key . '"';
							if((!$edit && $value[1]) || ($edit && $slider->pauseOnHover == $key)) {
								echo ' selected';
							}
							echo '>' . $value[0] . '</option>';
						}
						?>
					</select>
				</td>
				<td class="cs-description">
					<?php _e('Pause the current slide when hovered.', 'crellyslider'); ?>
				</td>
			</tr>
			<tr>
				<td class="cs-name"><?php _e('Callbacks', 'crellyslider'); ?></td>
				<td class="cs-content">
					<?php
					if(!$edit || ($edit && stripslashes($slider->callbacks) == '')) {
					// Sorry for this ugly indentation, ajax compatibility problems...
					?>
<textarea id="cs-slider-callbacks">
beforeStart : function() {},
beforeSetResponsive : function() {},
beforeSlideStart : function() {},
beforePause	: function() {},
beforeResume : function() {},</textarea>
					<?php
					}
					else echo '<textarea id="cs-slider-callbacks">' . stripslashes($slider->callbacks) . '</textarea>';
					?>
				</td>
				<td class="cs-description">
					<?php _e('Some jQuery functions that you can fire during the slider execution.', 'crellyslider'); ?>
				</td>
			</tr>
		</tbody>
	</table>
</div>