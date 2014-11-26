<div id="cs-slides">
	<div class="cs-slide-tabs cs-tabs cs-tabs-border">
		<ul class="cs-sortable">
			<?php
			if($edit) {
				$j = 0;
				$slides_num = count($slides);
				foreach($slides as $slide) {
					if($j == $slides_num - 1) {
						echo '<li class="ui-state-default active">';
					}
					else {
						echo '<li class="ui-state-default">';
					}
					echo '<a>' . __('Slide', 'crellyslider') . ' <span class="cs-slide-index">' . (($slide->position) + 1) . '</span></a>';
					echo '<span class="cs-close"></span>';
					echo '</li>';
					
					$j++;
				}
			}
			?>
			<li class="ui-state-default ui-state-disabled"><a class="cs-add-new"><?php _e('Add Slide', 'crellyslider'); ?></a></li>
		</ul>
		
		<div class="cs-slides-list">
			<?php
				if($edit) {
					foreach($slides as $slide) {
						echo '<div class="cs-slide">';
						crellyslider_printSlide($slider, $slide, $edit);
						echo '</div>';
					}
				}
			?>
		</div>		
		<div class="cs-void-slide"><?php crellyslider_printSlide($slider, false, $edit); ?></div>
		
		<div style="clear: both"></div>
	</div>
</div>

<?php
// Prints a slide. If the ID is not false, prints the values from MYSQL database, else prints a slide with default values. It has to receive the $edit variable because the elements.php file has to see it
function crellyslider_printSlide($slider, $slide, $edit) {
	$void = !$slide ? true : false;	
	
	$animations = array(
		'fade' => array(__('Fade', 'crellyslider'), true),
		'fadeLeft' => array(__('Fade left', 'crellyslider'), false),
		'fadeRight' => array(__('Fade right', 'crellyslider'), false),
		'slideLeft' => array(__('Slide left', 'crellyslider'), false),
		'slideRight' => array(__('Slide right', 'crellyslider'), false),
		'slideUp' => array(__('Slide up', 'crellyslider'), false),
		'slideDown' => array(__('Slide down', 'crellyslider'), false),
	);
	?>
	
	<table class="cs-slide-settings-list cs-table">
		<thead>
			<tr class="odd-row">
				<th colspan="3"><?php _e('Slide Options', 'crellyslider'); ?></th>
			</tr>
		</thead>
		
		<tbody>
			<tr class="cs-table-header">
				<td><?php _e('Option', 'crellyslider'); ?></td>
				<td><?php _e('Parameter', 'crellyslider'); ?></td>
				<td><?php _e('Description', 'crellyslider'); ?></td>
			</tr>
			<tr>
				<td class="cs-name"><?php _e('Background', 'crellyslider'); ?></td>
				<td class="cs-content">
					<?php
					if($void): ?>
					<?php _e('Background image:', 'crellyslider'); ?> &nbsp;
						<form>
							<input type="radio" value="0" name="cs-slide-background_type_image" checked /> <?php _e('None', 'crellyslider'); ?> &nbsp;
							<input type="radio" value="1" name="cs-slide-background_type_image" /> <input class="cs-slide-background_type_image-upload-button cs-button cs-is-default" type="button" value="<?php _e('Select image', 'crellyslider'); ?>" />
						</form>
						
						<br />
						<br />
						
						<?php _e('Background color:', 'crellyslider'); ?> &nbsp;
						<form>
							<input type="radio" value="0" name="cs-slide-background_type_color" checked /> <?php _e('Transparent', 'crellyslider'); ?> &nbsp;
							<input type="radio" value="1" name="cs-slide-background_type_color" /> <input class="cs-slide-background_type_color-picker-input cs-button cs-is-default" type="text" value="rgb(255, 255, 255)" />
						</form>
						
						<br />
						<br />
						
						<?php _e('Background position-x:', 'crellyslider'); ?> &nbsp;
						<input type="text" value="0" class="cs-slide-background_propriety_position_x" />
						<br />
						<?php _e('Background position-y:', 'crellyslider'); ?> &nbsp;
						<input type="text" value="0" class="cs-slide-background_propriety_position_y" />
						
						<br />
						<br />
						
						<?php _e('Background repeat:', 'crellyslider'); ?> &nbsp;
						<form>
							<input type="radio" value="1" name="cs-slide-background_repeat" checked /> <?php _e('Repeat', 'crellyslider'); ?> &nbsp;
							<input type="radio" value="0" name="cs-slide-background_repeat" /> <?php _e('No repeat', 'crellyslider'); ?>
						</form>
						
						<br />
						<br />
						
						<?php _e('Background size:', 'crellyslider'); ?> &nbsp;
						<input type="text" value="auto" class="cs-slide-background_propriety_size" />
					<?php else: ?>
						<?php _e('Background image:', 'crellyslider'); ?> &nbsp;
						<form>
							<?php if($slide->background_type_image == 'none' || $slide->background_type_image == 'undefined'): ?>
								<input type="radio" value="0" name="cs-slide-background_type_image" checked /> <?php _e('None', 'crellyslider'); ?> &nbsp;
								<input type="radio" value="1" name="cs-slide-background_type_image" /> <input class="cs-slide-background_type_image-upload-button cs-button cs-is-default" type="button" value="<?php _e('Select image', 'crellyslider'); ?>" />
							<?php else: ?>
								<input type="radio" value="0" name="cs-slide-background_type_image" /> <?php _e('None', 'crellyslider'); ?> &nbsp;
								<input type="radio" value="1" name="cs-slide-background_type_image" checked /> <input class="cs-slide-background_type_image-upload-button cs-button cs-is-default" type="button" value="<?php _e('Select image', 'crellyslider'); ?>" />
							<?php endif; ?>
						</form>	
						
						<br />
						<br />
						
						<?php _e('Background color:', 'crellyslider'); ?> &nbsp;
						<form>
							<?php if($slide->background_type_color == 'transparent'): ?>
								<input type="radio" value="0" name="cs-slide-background_type_color" checked /> <?php _e('Transparent', 'crellyslider'); ?> &nbsp;
								<input type="radio" value="1" name="cs-slide-background_type_color" /> <input class="cs-slide-background_type_color-picker-input cs-button cs-is-default" type="text" value="rgb(255, 255, 255)" />
							<?php else: ?>
								<input type="radio" value="0" name="cs-slide-background_type_color" /> <?php _e('Transparent', 'crellyslider'); ?> &nbsp;
								<input type="radio" value="1" name="cs-slide-background_type_color" checked /> <input class="cs-slide-background_type_color-picker-input cs-button cs-is-default" type="text" value="<?php echo $slide->background_type_color; ?>" />
							<?php endif; ?>	
						</form>
						
						<br />
						<br />
						
						<?php _e('Background position-x:', 'crellyslider'); ?> &nbsp;
						<input type="text" value="<?php echo $slide->background_propriety_position_x; ?>" class="cs-slide-background_propriety_position_x" />
						<br />
						<?php _e('Background position-y:', 'crellyslider'); ?> &nbsp;
						<input type="text" value="<?php echo $slide->background_propriety_position_y; ?>" class="cs-slide-background_propriety_position_y" />
						
						<br />
						<br />
						
						<?php _e('Background repeat:', 'crellyslider'); ?> &nbsp;
						<form>
							<?php if($slide->background_repeat == 'repeat'): ?>
								<input type="radio" value="1" name="cs-slide-background_repeat" checked /> <?php _e('Repeat', 'crellyslider'); ?> &nbsp;
								<input type="radio" value="0" name="cs-slide-background_repeat" /> <?php _e('No repeat', 'crellyslider'); ?>
							<?php else: ?>
								<input type="radio" value="1" name="cs-slide-background_repeat" /> <?php _e('Repeat', 'crellyslider'); ?> &nbsp;
								<input type="radio" value="0" name="cs-slide-background_repeat" checked /> <?php _e('No repeat', 'crellyslider'); ?>
							<?php endif; ?>
						</form>
						
						<br />
						<br />
						
						<?php _e('Background size:', 'crellyslider'); ?> &nbsp;
						<input type="text" value="<?php echo $slide->background_propriety_size; ?>" class="cs-slide-background_propriety_size" />
					<?php endif; ?>
				</td>
				<td class="cs-description">
					<?php _e('The background of the slide and its proprieties.', 'crellyslider'); ?>
				</td>
			</tr>
			<tr>
				<td class="cs-name"><?php _e('In animation', 'crellyslider'); ?></td>
				<td class="cs-content">
					<select class="cs-slide-data_in">
						<?php
						foreach($animations as $key => $value) {
							echo '<option value="' . $key . '"';
							if(($void && $value[1]) || (!$void && $slide->data_in == $key)) {
								echo ' selected';
							}
							echo '>' . $value[0] . '</option>';
						}
						?>
					</select>
				</td>
				<td class="cs-description">
					<?php _e('The in animation of the slide.', 'crellyslider'); ?>
				</td>
			</tr>
			<tr>
				<td class="cs-name"><?php _e('Out animation', 'crellyslider'); ?></td>
				<td class="cs-content">
					<select class="cs-slide-data_out">
						<?php
						foreach($animations as $key => $value) {
							echo '<option value="' . $key . '"';
							if(($void && $value[1]) || (!$void && $slide->data_in == $key)) {
								echo ' selected';
							}
							echo '>' . $value[0] . '</option>';
						}
						?>
					</select>
				</td>
				<td class="cs-description">
					<?php _e('The out animation of the slide.', 'crellyslider'); ?>
				</td>
			</tr>
			<tr>
				<td class="cs-name"><?php _e('Time', 'crellyslider'); ?></td>
				<td class="cs-content">
					<?php
					if($void) echo '<input class="cs-slide-data_time" type="text" value="3000" />';
					else echo '<input class="cs-slide-data_time" type="text" value="' . $slide->data_time .'" />';
					?>
					ms
				</td>
				<td class="cs-description">
					<?php _e('The time that the slide will remain on the screen.', 'crellyslider'); ?>
				</td>
			</tr>
			<tr>
				<td class="cs-name"><?php _e('Ease In', 'crellyslider'); ?></td>
				<td class="cs-content">
					<?php
					if($void) echo '<input class="cs-slide-data_easeIn" type="text" value="300" />';
					else echo '<input class="cs-slide-data_easeIn" type="text" value="' . $slide->data_easeIn .'" />';
					?>
					ms
				</td>
				<td class="cs-description">
					<?php _e('The time that the slide will take to get in.', 'crellyslider'); ?>
				</td>
			</tr>
			<tr>
				<td class="cs-name"><?php _e('Ease Out', 'crellyslider'); ?></td>
				<td class="cs-content">
					<?php
					if($void) echo '<input class="cs-slide-data_easeOut" type="text" value="300" />';
					else echo '<input class="cs-slide-data_easeOut" type="text" value="' . $slide->data_easeOut .'" />';
					?>
					ms
				</td>
				<td class="cs-description">
					<?php _e('The time that the slide will take to get out.', 'crellyslider'); ?>
				</td>
			</tr>
			<tr>
				<td class="cs-name"><?php _e('Custom CSS', 'crellyslider'); ?></td>
				<td class="cs-content">
					<?php
					if($void) echo '<textarea class="cs-slide-custom_css"></textarea>';
					else echo '<textarea class="cs-slide-custom_css">' . stripslashes($slide->custom_css) . '</textarea>';
					?>
				</td>
				<td class="cs-description">
					<?php _e('Apply CSS to the slide.', 'crellyslider'); ?>
				</td>
			</tr>
		</tbody>
	</table>
	
	<br />
	<br />
	
	<?php
	// If the slide is not void, select her elements
	if(!$void) {
		global $wpdb;
		$id = isset($_GET['id']) ? $_GET['id'] : NULL;
		$slide_parent = $slide->position;
		$elements = $wpdb->get_results('SELECT * FROM ' . $wpdb->prefix . 'crellyslider_elements WHERE slider_parent = ' . $id . ' AND slide_parent = ' . $slide_parent);
	}
	else {
		$slide_id = NULL;
		$elements = NULL;
	}
	
	crellyslider_printElements($edit, $slider, $slide, $elements);
}
?>