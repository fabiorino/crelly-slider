<?php
function crellyslider_printElements($edit, $slider, $slide, $elements) {
?>
	<div class="cs-elements">

		<div
		class="cs-slide-editing-area"
		<?php if($edit && $slide): ?>
			<?php
			if($slide->background_type_image != 'none') {
				echo 'data-background-image-src="' . $slide->background_type_image . '"';
			}
			?>
			style="
			width: <?php echo $slider->startWidth; ?>px;
			height: <?php echo $slider->startHeight; ?>px;
			background-image: url('<?php echo $slide->background_type_image; ?>');
			background-color: <?php echo $slide->background_type_color == 'transparent' ? 'rgb(255, 255, 255)' : $slide->background_type_color; ?>;
			background-position: <?php echo $slide->background_propriety_position_x . ' ' . $slide->background_propriety_position_y; ?>;
			background-repeat: <?php echo $slide->background_repeat; ?>;
			background-size: <?php echo $slide->background_propriety_size; ?>;
			<?php echo stripslashes($slide->custom_css); ?>
			"
		<?php endif; ?>
		>		
			<?php
			if($edit && $elements != NULL) {
				foreach($elements as $element) {
					if($element->link != '') {
						$target = $element->link_new_tab == 1 ? 'target="_blank"' : '';
						
						$link_output = '<a' . "\n" .
						'class="cs-element cs-' . $element->type . '-element"' . "\n" .
						'href="' . stripslashes($element->link) . '"' . "\n" .
						$target . "\n" .
						'style="' .
						'z-index: ' . $element->z_index . ';' . "\n" .
						'top: ' . $element->data_top . 'px;' . "\n" .
						'left: ' . $element->data_left . 'px;' . "\n" .
						'">' .  "\n";
						
						echo $link_output;
					}
					
					switch($element->type) {
						case 'text':
							?>
							<div
							style="
							<?php
							if($element->link == '') {
								echo 'z-index: ' . $element->z_index . ';';
								echo 'left: ' . $element->data_left . 'px;';
								echo 'top: ' . $element->data_top . 'px;';
							}
							echo stripslashes($element->custom_css);
							?>
							"
							<?php
							if($element->link == '') {
								echo 'class="cs-element cs-text-element ' . stripslashes($element->custom_css_classes) . '"';
							}
							else {
								echo 'class="' . stripslashes($element->custom_css_classes) . '"';
							}
							?>
							>
							<?php echo stripslashes($element->inner_html); ?>
							</div>
							<?php
						break;
						
						case 'image':
							?>
							<img
							src="<?php echo $element->image_src; ?>"
							alt="<?php echo $element->image_alt; ?>"
							style="
							<?php
							if($element->link == '') {
								echo 'z-index: ' . $element->z_index . ';';
								echo 'left: ' . $element->data_left . 'px;';
								echo 'top: ' . $element->data_top . 'px;';
							}
							echo stripslashes($element->custom_css);
							?>
							"
							<?php
							if($element->link == '') {
								echo 'class="cs-element cs-image-element ' . stripslashes($element->custom_css_classes) . '"';
							}
							else {
								echo 'class="' . stripslashes($element->custom_css_classes) . '"';
							}
							?>
							/>
							<?php
						break;
						
						case 'youtube_video':
							?>
							<div
							class="cs-element cs-video-element"
							style="
							<?php
							if($element->link == '') {
								echo 'z-index: ' . $element->z_index . ';';
								echo 'left: ' . $element->data_left . 'px;';
								echo 'top: ' . $element->data_top . 'px;';
							}
							?>
							"
							>
								<div class="cs-avoid-interaction"></div>
								<iframe style="<?php echo stripslashes($element->custom_css); ?>" class="cs-yt-iframe <?php echo stripslashes($element->custom_css_classes); ?>" type="text/html" width="560" height="315" src="http://www.youtube.com/embed/<?php echo $element->video_id; ?>?enablejsapi=1" frameborder="0"></iframe>
							</div>
							<?php
						break;
						
						case 'vimeo_video':
							?>
							<div
							class="cs-element cs-video-element"
							style="
							<?php
							if($element->link == '') {
								echo 'z-index: ' . $element->z_index . ';';
								echo 'left: ' . $element->data_left . 'px;';
								echo 'top: ' . $element->data_top . 'px;';
							}
							?>
							"
							>
								<div class="cs-avoid-interaction"></div>
								<iframe style="<?php echo stripslashes($element->custom_css); ?>" class="cs-vimeo-iframe <?php echo stripslashes($element->custom_css_classes); ?>" src="https://player.vimeo.com/video/<?php echo $element->video_id; ?>?api=1" width="560" height="315" frameborder="0" ></iframe>
							</div>
							<?php
						break;
					}
					
					if($element->link != '') {
						echo '</a>' . "\n";
					}
				}
			}
			?>
		</div>
		
		<br />
		<br />

		<div class="cs-elements-actions">
			<div style="float: left;">		
				<a class="cs-add-text-element cs-button cs-is-warning"><?php _e('Add text', 'crellyslider'); ?></a>
				<a class="cs-add-image-element cs-button cs-is-warning"><?php _e('Add image', 'crellyslider'); ?></a>
				<a class="cs-add-video-element cs-button cs-is-warning"><?php _e('Add video', 'crellyslider'); ?></a>
			</div>
			<div style="float: right;">
				<a class="cs-live-preview cs-button cs-is-success"><?php _e('Live preview', 'crellyslider'); ?></a>
				<a class="cs-delete-element cs-button cs-is-danger cs-is-disabled"><?php _e('Delete element', 'crellyslider'); ?></a>
				<a class="cs-duplicate-element cs-button cs-is-primary cs-is-disabled"><?php _e('Duplicate element', 'crellyslider'); ?></a>
			</div>
			<div style="clear: both;"></div>
		</div>
		
		<br />
		<br />
		
		<div class="cs-elements-list">
			<?php
			if($edit && $elements != NULL) {
				foreach($elements as $element) {
					switch($element->type) {
						case 'text':
							echo '<div class="cs-element-settings cs-text-element-settings" style="display: none;">';
							crellyslider_printTextElement($element);
							echo '</div>';
							break;
							
						case 'image':
							echo '<div class="cs-element-settings cs-image-element-settings" style="display: none;">';
							crellyslider_printImageElement($element);
							echo '</div>';
							break;
							
						case 'youtube_video':
						case 'vimeo_video':
							echo '<div class="cs-element-settings cs-video-element-settings" style="display: none;">';
							crellyslider_printVideoElement($element);
							echo '</div>';
							break;
					}
				}
			}
			echo '<div class="cs-void-element-settings cs-void-text-element-settings cs-element-settings cs-text-element-settings">';
			crellyslider_printTextElement(false);
			echo '</div>';
			echo '<div class="cs-void-element-settings cs-void-image-element-settings cs-element-settings cs-image-element-settings">';
			crellyslider_printImageElement(false);
			echo '</div>';
			echo '<div class="cs-void-element-settings cs-void-video-element-settings cs-element-settings cs-video-element-settings">';
			crellyslider_printVideoElement(false);
			echo '</div>';
			?>
		</div>

	</div>
<?php
}

function crellyslider_printTextElement($element) {
	$void = !$element ? true : false;
	
	$animations = array(
		'none' => array(__('None', 'crellyslider'), false),
		'slideDown' => array(__('Slide down', 'crellyslider'), false),
		'slideUp' => array(__('Slide up', 'crellyslider'), false),
		'slideLeft' => array(__('Slide left', 'crellyslider'), false),
		'slideRight' => array(__('Slide right', 'crellyslider'), false),
		'fade' => array(__('Fade', 'crellyslider'), true),
		'fadeDown' => array(__('Fade down', 'crellyslider'), false),
		'fadeUp' => array(__('Fade up', 'crellyslider'), false),
		'fadeLeft' => array(__('Fade left', 'crellyslider'), false),
		'fadeRight' => array(__('Fade right', 'crellyslider'), false),
		'fadeSmallDown' => array(__('Fade small down', 'crellyslider'), false),
		'fadeSmallUp' => array(__('Fade small up', 'crellyslider'), false),
		'fadeSmallLeft' => array(__('Fade small left', 'crellyslider'), false),
		'fadeSmallRight' => array(__('Fade small right', 'crellyslider'), false),
	);
	
	?>
	<table class="cs-element-settings-list cs-text-element-settings-list cs-table">
		<thead>
			<tr class="odd-row">
				<th colspan="3"><?php _e('Element Options', 'crellyslider'); ?></th>
			</tr>
		</thead>
		
		<tbody>
			<tr class="cs-table-header">
				<td><?php _e('Option', 'crellyslider'); ?></td>
				<td><?php _e('Parameter', 'crellyslider'); ?></td>
				<td><?php _e('Description', 'crellyslider'); ?></td>
			</tr>
			<tr>
				<td class="cs-name"><?php _e('Text', 'crellyslider'); ?></td>
				<td class="cs-content">
					<?php					
					if($void) echo '<textarea class="cs-element-inner_html">' . __('Text element', 'crellyslider') . '</textarea>';
					else echo '<textarea class="cs-element-inner_html">' . stripslashes($element->inner_html) . '</textarea>';
					?>
				</td>
				<td class="cs-description">
					<?php _e('Write the text or the HTML.', 'crellyslider'); ?>
				</td>
			</tr>
			<tr>
				<td class="cs-name"><?php _e('Left', 'crellyslider'); ?></td>
				<td class="cs-content">
					<?php
					if($void) echo '<input class="cs-element-data_left" type="text" value="0" />';
					else echo '<input class="cs-element-data_left" type="text" value="' . $element->data_left .'" />';
					?>
					px
					<br />
					<br />
					<input type="button" class="cs-element-center-x cs-button cs-is-default" value="<?php _e('Center horizontally', 'crellyslider'); ?>" />
				</td>
				<td class="cs-description">
					<?php _e('Left distance in px from the start width.', 'crellyslider'); ?>
				</td>
			</tr>
			<tr>
				<td class="cs-name"><?php _e('Top', 'crellyslider'); ?></td>
				<td class="cs-content">
					<?php
					if($void) echo '<input class="cs-element-data_top" type="text" value="0" />';
					else echo '<input class="cs-element-data_top" type="text" value="' . $element->data_top .'" />';
					?>
					px
					<br />
					<br />
					<input type="button" class="cs-element-center-y cs-button cs-is-default" value="<?php _e('Center vertically', 'crellyslider'); ?>" />
				</td>
				<td class="cs-description">
					<?php _e('Top distance in px from the start height.', 'crellyslider'); ?>
				</td>
			</tr>
			<tr>
				<td class="cs-name"><?php _e('Z - index', 'crellyslider'); ?></td>
				<td class="cs-content">
					<?php
					if($void) echo '<input class="cs-element-z_index" type="text" value="1" />';
					else echo '<input class="cs-element-z_index" type="text" value="' . $element->z_index .'" />';
					?>
				</td>
				<td class="cs-description">
					<?php _e('An element with an high z-index will cover an element with a lower z-index if they overlap.', 'crellyslider'); ?>
				</td>
			</tr>
			<tr>
				<td class="cs-name"><?php _e('Delay', 'crellyslider'); ?></td>
				<td class="cs-content">
					<?php
					if($void) echo '<input class="cs-element-data_delay" type="text" value="0" />';
					else echo '<input class="cs-element-data_delay" type="text" value="' . $element->data_delay .'" />';
					?>
					ms
				</td>
				<td class="cs-description">
					<?php _e('How long will the element wait before the entrance.', 'crellyslider'); ?>
				</td>
			</tr>
			<tr>
				<td class="cs-name"><?php _e('Time', 'crellyslider'); ?></td>
				<td class="cs-content">
					<?php
					if($void) echo '<input class="cs-element-data_time" type="text" value="all" />';
					else echo '<input class="cs-element-data_time" type="text" value="' . $element->data_time .'" />';
					?>
					ms
				</td>
				<td class="cs-description">
					<?php _e('How long will the element be displayed during the slide execution.', 'crellyslider'); ?>
					<br />
					<br />					
					<?php _e('Write "all" to set the entire time.', 'crellyslider'); ?>
					<br />
					<br />
					<?php _e('Write "3000" to set 3000 milliseconds minus delay time (so, if the delay time is 1000 milliseconds, the element will be displayed for 3000-1000=2000 milliseconds).', 'crellyslider'); ?>
				</td>
			</tr>
			<tr>
				<td class="cs-name"><?php _e('In animation', 'crellyslider'); ?></td>
				<td class="cs-content">
					<select class="cs-element-data_in">
						<?php
						foreach($animations as $key => $value) {
							echo '<option value="' . $key . '"';
							if(($void && $value[1]) || (!$void && $element->data_in == $key)) {
								echo ' selected';
							}
							echo '>' . $value[0] . '</option>';
						}
						?>
					</select>
				</td>
				<td class="cs-description">
					<?php _e('The in animation of the element.', 'crellyslider'); ?>
				</td>
			</tr>
			<tr>
				<td class="cs-name"><?php _e('Out animation', 'crellyslider'); ?></td>
				<td class="cs-content">
					<select class="cs-element-data_out">
						<?php
						foreach($animations as $key => $value) {
							echo '<option value="' . $key . '"';
							if(($void && $value[1]) || (!$void && $element->data_out == $key)) {
								echo ' selected';
							}
							echo '>' . $value[0] . '</option>';
						}
						?>
					</select>
					<br />
					<?php
					if($void) echo '<input class="cs-element-data_ignoreEaseOut" type="checkbox" />' . __('Disable synchronization with slide out animation', 'crellyslider');
					else {
						if($element->data_ignoreEaseOut) {
							echo '<input class="cs-element-data_ignoreEaseOut" type="checkbox" checked />' . __('Disable synchronization with slide out animation', 'crellyslider');
						}
						else {
							echo '<input class="cs-element-data_ignoreEaseOut" type="checkbox" />' . __('Disable synchronization with slide out animation', 'crellyslider');
						}
					}
					?>
				</td>
				<td class="cs-description">
					<?php _e('The out animation of the element.<br /><br />Disable synchronization with slide out animation: if not checked, the slide out animation won\'t start until all the elements that have this option unchecked are animated out.', 'crellyslider'); ?>
				</td>
			</tr>
			<tr>
				<td class="cs-name"><?php _e('Ease in', 'crellyslider'); ?></td>
				<td class="cs-content">
					<?php
					if($void) echo '<input class="cs-element-data_easeIn" type="text" value="300" />';
					else echo '<input class="cs-element-data_easeIn" type="text" value="' . $element->data_easeIn .'" />';
					?>
					ms
				</td>
				<td class="cs-description">
					<?php _e('How long will the in animation take.', 'crellyslider'); ?>
				</td>
			</tr>
			<tr>
				<td class="cs-name"><?php _e('Ease out', 'crellyslider'); ?></td>
				<td class="cs-content">
					<?php
					if($void) echo '<input class="cs-element-data_easeOut" type="text" value="300" />';
					else echo '<input class="cs-element-data_easeOut" type="text" value="' . $element->data_easeOut .'" />';
					?>
					ms
				</td>
				<td class="cs-description">
					<?php _e('How long will the out animation take.', 'crellyslider'); ?>
				</td>
			</tr>
			<tr>
				<td class="cs-name"><?php _e('Link', 'crellyslider'); ?></td>
				<td class="cs-content">
					<?php
					if($void) echo '<input class="cs-element-link" type="text" value="" />';
					else echo '<input class="cs-element-link" type="text" value="' . stripslashes($element->link) .'" />';
					?>
					<br />
					<?php
					if($void) echo '<input class="cs-element-link_new_tab" type="checkbox" />' . __('Open link in a new tab', 'crellyslider');
					else {
						if($element->link_new_tab) {
							echo '<input class="cs-element-link_new_tab" type="checkbox" checked />' . __('Open link in a new tab', 'crellyslider');
						}
						else {
							echo '<input class="cs-element-link_new_tab" type="checkbox" />' . __('Open link in a new tab', 'crellyslider');
						}
					}
					?>
				</td>
				<td class="cs-description">
					<?php _e('Open the link (e.g.: http://www.google.it) on click. Leave it empty if you don\'t want it.', 'crellyslider'); ?>
				</td>
			</tr>
			<tr>
				<td class="cs-name"><?php _e('Custom CSS', 'crellyslider'); ?></td>
				<td class="cs-content">
					<?php
					if($void) echo '<textarea class="cs-element-custom_css"></textarea>';
					else echo '<textarea class="cs-element-custom_css">' . stripslashes($element->custom_css) . '</textarea>';
					?>
				</td>
				<td class="cs-description">
					<?php _e('Style the element.', 'crellyslider'); ?>
				</td>
			</tr>
			<tr>
				<td class="cs-name"><?php _e('Custom classes', 'crellyslider'); ?></td>
				<td class="cs-content">
					<?php
					if($void) echo '<input class="cs-element-custom_css_classes" type="text" />';
					else echo '<input class="cs-element-custom_css_classes" type="text" value="' . stripslashes($element->custom_css_classes) . '" />';
					?>
				</td>
				<td class="cs-description">
					<?php _e('Apply custom CSS classes to the element. The style of the classes may not work when working on backend.', 'crellyslider'); ?>
				</td>
			</tr>
		</tbody>
	</table>
	<?php
}

function crellyslider_printImageElement($element) {
	$void = !$element ? true : false;
	
	$animations = array(
		'none' => array(__('None', 'crellyslider'), false),
		'slideDown' => array(__('Slide down', 'crellyslider'), false),
		'slideUp' => array(__('Slide up', 'crellyslider'), false),
		'slideLeft' => array(__('Slide left', 'crellyslider'), false),
		'slideRight' => array(__('Slide right', 'crellyslider'), false),
		'fade' => array(__('Fade', 'crellyslider'), true),
		'fadeDown' => array(__('Fade down', 'crellyslider'), false),
		'fadeUp' => array(__('Fade up', 'crellyslider'), false),
		'fadeLeft' => array(__('Fade left', 'crellyslider'), false),
		'fadeRight' => array(__('Fade right', 'crellyslider'), false),
		'fadeSmallDown' => array(__('Fade small down', 'crellyslider'), false),
		'fadeSmallUp' => array(__('Fade small up', 'crellyslider'), false),
		'fadeSmallLeft' => array(__('Fade small left', 'crellyslider'), false),
		'fadeSmallRight' => array(__('Fade small right', 'crellyslider'), false),
	);
	
	?>
	<table class="cs-element-settings-list cs-image-element-settings-list cs-table">
		<thead>
			<tr class="odd-row">
				<th colspan="3"><?php _e('Element Options', 'crellyslider'); ?></th>
			</tr>
		</thead>
		<tbody>
			<tr class="cs-table-header">
				<td><?php _e('Option', 'crellyslider'); ?></td>
				<td><?php _e('Parameter', 'crellyslider'); ?></td>
				<td><?php _e('Description', 'crellyslider'); ?></td>
			</tr>
			<tr>
				<td class="cs-name"><?php _e('Modify image', 'crellyslider'); ?></td>
				<td class="cs-content">
					<?php
					if($void) echo '<input class="cs-image-element-upload-button cs-button cs-is-default" type="button" value="' . __('Open gallery', 'crellyslider') . '" />';
					else echo '<input data-src="' . $element->image_src . '" data-alt="' . $element->image_alt . '" class="cs-image-element-upload-button cs-button cs-is-default" type="button" value="' . __('Open gallery', 'crellyslider') . '" />';
					?>
				</td>
				<td class="cs-description">
					<?php _e('Change the image source or the alt text.', 'crellyslider'); ?>
				</td>
			</tr>
			<tr>
				<td class="cs-name"><?php _e('Left', 'crellyslider'); ?></td>
				<td class="cs-content">
					<?php
					if($void) echo '<input class="cs-element-data_left" type="text" value="0" />';
					else echo '<input class="cs-element-data_left" type="text" value="' . $element->data_left .'" />';
					?>
					px
					<br />
					<br />
					<input type="button" class="cs-element-center-x cs-button cs-is-default" value="<?php _e('Center horizontally', 'crellyslider'); ?>" />
				</td>
				<td class="cs-description">
					<?php _e('Left distance in px from the start width.', 'crellyslider'); ?>
				</td>
			</tr>
			<tr>
				<td class="cs-name"><?php _e('Top', 'crellyslider'); ?></td>
				<td class="cs-content">
					<?php
					if($void) echo '<input class="cs-element-data_top" type="text" value="0" />';
					else echo '<input class="cs-element-data_top" type="text" value="' . $element->data_top .'" />';
					?>
					px
					<br />
					<br />
					<input type="button" class="cs-element-center-y cs-button cs-is-default" value="<?php _e('Center vertically', 'crellyslider'); ?>" />
				</td>
				<td class="cs-description">
					<?php _e('Top distance in px from the start height.', 'crellyslider'); ?>
				</td>
			</tr>
			<tr>
				<td class="cs-name"><?php _e('Z - index', 'crellyslider'); ?></td>
				<td class="cs-content">
					<?php
					if($void) echo '<input class="cs-element-z_index" type="text" value="1" />';
					else echo '<input class="cs-element-z_index" type="text" value="' . $element->z_index .'" />';
					?>
				</td>
				<td class="cs-description">
					<?php _e('An element with an high z-index will cover an element with a lower z-index if they overlap.', 'crellyslider'); ?>
				</td>
			</tr>
			<tr>
				<td class="cs-name"><?php _e('Delay', 'crellyslider'); ?></td>
				<td class="cs-content">
					<?php
					if($void) echo '<input class="cs-element-data_delay" type="text" value="0" />';
					else echo '<input class="cs-element-data_delay" type="text" value="' . $element->data_delay .'" />';
					?>
					ms
				</td>
				<td class="cs-description">
					<?php _e('How long will the element wait before the entrance.', 'crellyslider'); ?>
				</td>
			</tr>
			<tr>
				<td class="cs-name"><?php _e('Time', 'crellyslider'); ?></td>
				<td class="cs-content">
					<?php
					if($void) echo '<input class="cs-element-data_time" type="text" value="all" />';
					else echo '<input class="cs-element-data_time" type="text" value="' . $element->data_time .'" />';
					?>
					ms
				</td>
				<td class="cs-description">
					<?php _e('How long will the element be displayed during the slide execution.', 'crellyslider'); ?>
					<br />
					<br />					
					<?php _e('Write "all" to set the entire time.', 'crellyslider'); ?>
					<br />
					<br />
					<?php _e('Write "3000" to set 3000 milliseconds minus delay time (so, if the delay time is 1000 milliseconds, the element will be displayed for 3000-1000=2000 milliseconds).', 'crellyslider'); ?>
				</td>
			</tr>
			<tr>
				<td class="cs-name"><?php _e('In animation', 'crellyslider'); ?></td>
				<td class="cs-content">
					<select class="cs-element-data_in">
						<?php
						foreach($animations as $key => $value) {
							echo '<option value="' . $key . '"';
							if(($void && $value[1]) || (!$void && $element->data_in == $key)) {
								echo ' selected';
							}
							echo '>' . $value[0] . '</option>';
						}
						?>
					</select>
				</td>
				<td class="cs-description">
					<?php _e('The in animation of the element.', 'crellyslider'); ?>
				</td>
			</tr>
			<tr>
				<td class="cs-name"><?php _e('Out animation', 'crellyslider'); ?></td>
				<td class="cs-content">
					<select class="cs-element-data_out">
						<?php
						foreach($animations as $key => $value) {
							echo '<option value="' . $key . '"';
							if(($void && $value[1]) || (!$void && $element->data_out == $key)) {
								echo ' selected';
							}
							echo '>' . $value[0] . '</option>';
						}
						?>
					</select>
					<br />
					<?php
					if($void) echo '<input class="cs-element-data_ignoreEaseOut" type="checkbox" />' . __('Disable synchronization with slide out animation', 'crellyslider');
					else {
						if($element->data_ignoreEaseOut) {
							echo '<input class="cs-element-data_ignoreEaseOut" type="checkbox" checked />' . __('Disable synchronization with slide out animation', 'crellyslider');
						}
						else {
							echo '<input class="cs-element-data_ignoreEaseOut" type="checkbox" />' . __('Disable synchronization with slide out animation', 'crellyslider');
						}
					}
					?>
				</td>
				<td class="cs-description">
					<?php _e('The out animation of the element.<br /><br />Disable synchronization with slide out animation: if not checked, the slide out animation won\'t start until all the elements that have this option unchecked are animated out.', 'crellyslider'); ?>
				</td>
			</tr>
			<tr>
				<td class="cs-name"><?php _e('Ease in', 'crellyslider'); ?></td>
				<td class="cs-content">
					<?php
					if($void) echo '<input class="cs-element-data_easeIn" type="text" value="300" />';
					else echo '<input class="cs-element-data_easeIn" type="text" value="' . $element->data_easeIn .'" />';
					?>
					ms
				</td>
				<td class="cs-description">
					<?php _e('How long will the in animation take.', 'crellyslider'); ?>
				</td>
			</tr>
			<tr>
				<td class="cs-name"><?php _e('Ease out', 'crellyslider'); ?></td>
				<td class="cs-content">
					<?php
					if($void) echo '<input class="cs-element-data_easeOut" type="text" value="300" />';
					else echo '<input class="cs-element-data_easeOut" type="text" value="' . $element->data_easeOut .'" />';
					?>
					ms
				</td>
				<td class="cs-description">
					<?php _e('How long will the out animation take.', 'crellyslider'); ?>
				</td>
			</tr>
			<tr>
				<td class="cs-name"><?php _e('Link', 'crellyslider'); ?></td>
				<td class="cs-content">
					<?php
					if($void) echo '<input class="cs-element-link" type="text" value="" />';
					else echo '<input class="cs-element-link" type="text" value="' . stripslashes($element->link) .'" />';
					?>
					<br />
					<?php
					if($void) echo '<input class="cs-element-link_new_tab" type="checkbox" />' . __('Open link in a new tab', 'crellyslider');
					else {
						if($element->link_new_tab) {
							echo '<input class="cs-element-link_new_tab" type="checkbox" checked />' . __('Open link in a new tab', 'crellyslider');
						}
						else {
							echo '<input class="cs-element-link_new_tab" type="checkbox" />' . __('Open link in a new tab', 'crellyslider');
						}
					}
					?>
				</td>
				<td class="cs-description">
					<?php _e('Open the link (e.g.: http://www.google.it) on click. Leave it empty if you don\'t want it.', 'crellyslider'); ?>
				</td>
			</tr>
			<tr>
				<td class="cs-name"><?php _e('Custom CSS', 'crellyslider'); ?></td>
				<td class="cs-content">
					<?php
					if($void) echo '<textarea class="cs-element-custom_css"></textarea>';
					else echo '<textarea class="cs-element-custom_css">' . stripslashes($element->custom_css) . '</textarea>';
					?>
				</td>
				<td class="cs-description">
					<?php _e('Style the element.', 'crellyslider'); ?>
				</td>
			</tr>
			<tr>
				<td class="cs-name"><?php _e('Custom classes', 'crellyslider'); ?></td>
				<td class="cs-content">
					<?php
					if($void) echo '<input class="cs-element-custom_css_classes" type="text" />';
					else echo '<input class="cs-element-custom_css_classes" type="text" value="' . stripslashes($element->custom_css_classes) . '" />';
					?>
				</td>
				<td class="cs-description">
					<?php _e('Apply custom CSS classes to the element. The style of the classes may not work when working on backend.', 'crellyslider'); ?>
				</td>
			</tr>
		</tbody>
	</table>
<?php
}

function crellyslider_printVideoElement($element) {
	$void = !$element ? true : false;
	
	$animations = array(
		'none' => array(__('None', 'crellyslider'), false),
		'slideDown' => array(__('Slide down', 'crellyslider'), false),
		'slideUp' => array(__('Slide up', 'crellyslider'), false),
		'slideLeft' => array(__('Slide left', 'crellyslider'), false),
		'slideRight' => array(__('Slide right', 'crellyslider'), false),
		'fade' => array(__('Fade', 'crellyslider'), true),
		'fadeDown' => array(__('Fade down', 'crellyslider'), false),
		'fadeUp' => array(__('Fade up', 'crellyslider'), false),
		'fadeLeft' => array(__('Fade left', 'crellyslider'), false),
		'fadeRight' => array(__('Fade right', 'crellyslider'), false),
		'fadeSmallDown' => array(__('Fade small down', 'crellyslider'), false),
		'fadeSmallUp' => array(__('Fade small up', 'crellyslider'), false),
		'fadeSmallLeft' => array(__('Fade small left', 'crellyslider'), false),
		'fadeSmallRight' => array(__('Fade small right', 'crellyslider'), false),
	);
	
	?>
	<table class="cs-element-settings-list cs-video-element-settings-list cs-table">
		<thead>
			<tr class="odd-row">
				<th colspan="3"><?php _e('Element Options', 'crellyslider'); ?></th>
			</tr>
		</thead>
		
		<tbody>
			<tr class="cs-table-header">
				<td><?php _e('Option', 'crellyslider'); ?></td>
				<td><?php _e('Parameter', 'crellyslider'); ?></td>
				<td><?php _e('Description', 'crellyslider'); ?></td>
			</tr>
			<tr>
				<td class="cs-name"><?php _e('Video source', 'crellyslider'); ?></td>
				<td class="cs-content">
					<?php					
					if($void) echo '<select class="cs-element-video_src"><option selected value="youtube">YouTube</option><option value="vimeo">Vimeo</option></select>';
					else {
						if($element->type == 'youtube_video') {
							echo '<select class="cs-element-video_src"><option selected value="youtube">YouTube</option><option value="vimeo">Vimeo</option></select>';
						}
						else {
							echo '<select class="cs-element-video_src"><option value="youtube">YouTube</option><option selected value="vimeo">Vimeo</option></select>';
						}
					}
					
					echo '<br /><br />';
					
					if($void) echo '<input placeholder="Video ID" class="cs-element-video_id" type="text" />';
					else echo '<input placeholder="Video ID" class="cs-element-video_id" type="text" value="' . $element->video_id .'" />';
					?>
				</td>
				<td class="cs-description">
					<?php _e('Set source and ID.', 'crellyslider'); ?>
				</td>
			</tr>
			<tr>
				<td class="cs-name"><?php _e('Loop video', 'crellyslider'); ?></td>
				<td class="cs-content">
					<?php					
					if($void) echo '<select class="cs-element-video_loop"><option value="1">Yes</option><option selected value="0">No</option></select>';
					else {
						if($element->video_loop == 0) {
							echo '<select class="cs-element-video_loop"><option value="1">Yes</option><option selected value="0">No</option></select>';
						}
						else {
							echo '<select class="cs-element-video_loop"><option selected value="1">Yes</option><option value="0">No</option></select>';
						}
					}
					?>
				</td>
				<td class="cs-description">
					<?php _e('The video will automatically restart from the beginning when it reaches the end.', 'crellyslider'); ?>
				</td>
			</tr>
			<tr>
				<td class="cs-name"><?php _e('Autoplay', 'crellyslider'); ?></td>
				<td class="cs-content">
					<?php					
					if($void) echo '<select class="cs-element-video_autoplay"><option value="1">Yes</option><option selected value="0">No</option></select>';
					else {
						if($element->video_autoplay == 0) {
							echo '<select class="cs-element-video_autoplay"><option value="1">Yes</option><option selected value="0">No</option></select>';
						}
						else {
							echo '<select class="cs-element-video_autoplay"><option selected value="1">Yes</option><option value="0">No</option></select>';
						}
					}
					?>
				</td>
				<td class="cs-description">
					<?php _e('The video will automatically be played after the in animation.', 'crellyslider'); ?>
				</td>
			</tr>
			<tr>
				<td class="cs-name"><?php _e('Left', 'crellyslider'); ?></td>
				<td class="cs-content">
					<?php
					if($void) echo '<input class="cs-element-data_left" type="text" value="0" />';
					else echo '<input class="cs-element-data_left" type="text" value="' . $element->data_left .'" />';
					?>
					px
					<br />
					<br />
					<input type="button" class="cs-element-center-x cs-button cs-is-default" value="<?php _e('Center horizontally', 'crellyslider'); ?>" />
				</td>
				<td class="cs-description">
					<?php _e('Left distance in px from the start width.', 'crellyslider'); ?>
				</td>
			</tr>
			<tr>
				<td class="cs-name"><?php _e('Top', 'crellyslider'); ?></td>
				<td class="cs-content">
					<?php
					if($void) echo '<input class="cs-element-data_top" type="text" value="0" />';
					else echo '<input class="cs-element-data_top" type="text" value="' . $element->data_top .'" />';
					?>
					px
					<br />
					<br />
					<input type="button" class="cs-element-center-y cs-button cs-is-default" value="<?php _e('Center vertically', 'crellyslider'); ?>" />
				</td>
				<td class="cs-description">
					<?php _e('Top distance in px from the start height.', 'crellyslider'); ?>
				</td>
			</tr>
			<tr>
				<td class="cs-name"><?php _e('Z - index', 'crellyslider'); ?></td>
				<td class="cs-content">
					<?php
					if($void) echo '<input class="cs-element-z_index" type="text" value="1" />';
					else echo '<input class="cs-element-z_index" type="text" value="' . $element->z_index .'" />';
					?>
				</td>
				<td class="cs-description">
					<?php _e('An element with an high z-index will cover an element with a lower z-index if they overlap.', 'crellyslider'); ?>
				</td>
			</tr>
			<tr>
				<td class="cs-name"><?php _e('Delay', 'crellyslider'); ?></td>
				<td class="cs-content">
					<?php
					if($void) echo '<input class="cs-element-data_delay" type="text" value="0" />';
					else echo '<input class="cs-element-data_delay" type="text" value="' . $element->data_delay .'" />';
					?>
					ms
				</td>
				<td class="cs-description">
					<?php _e('How long will the element wait before the entrance.', 'crellyslider'); ?>
				</td>
			</tr>
			<tr>
				<td class="cs-name"><?php _e('Time', 'crellyslider'); ?></td>
				<td class="cs-content">
					<?php
					if($void) echo '<input class="cs-element-data_time" type="text" value="all" />';
					else echo '<input class="cs-element-data_time" type="text" value="' . $element->data_time .'" />';
					?>
					ms
				</td>
				<td class="cs-description">
					<?php _e('How long will the element be displayed during the slide execution.', 'crellyslider'); ?>
					<br />
					<br />					
					<?php _e('Write "all" to set the entire time.', 'crellyslider'); ?>
					<br />
					<br />
					<?php _e('Write "3000" to set 3000 milliseconds minus delay time (so, if the delay time is 1000 milliseconds, the element will be displayed for 3000-1000=2000 milliseconds).', 'crellyslider'); ?>
				</td>
			</tr>
			<tr>
				<td class="cs-name"><?php _e('In animation', 'crellyslider'); ?></td>
				<td class="cs-content">
					<select class="cs-element-data_in">
						<?php
						foreach($animations as $key => $value) {
							echo '<option value="' . $key . '"';
							if(($void && $value[1]) || (!$void && $element->data_in == $key)) {
								echo ' selected';
							}
							echo '>' . $value[0] . '</option>';
						}
						?>
					</select>
				</td>
				<td class="cs-description">
					<?php _e('The in animation of the element.', 'crellyslider'); ?>
				</td>
			</tr>
			<tr>
				<td class="cs-name"><?php _e('Out animation', 'crellyslider'); ?></td>
				<td class="cs-content">
					<select class="cs-element-data_out">
						<?php
						foreach($animations as $key => $value) {
							echo '<option value="' . $key . '"';
							if(($void && $value[1]) || (!$void && $element->data_out == $key)) {
								echo ' selected';
							}
							echo '>' . $value[0] . '</option>';
						}
						?>
					</select>
					<br />
					<?php
					if($void) echo '<input class="cs-element-data_ignoreEaseOut" type="checkbox" />' . __('Disable synchronization with slide out animation', 'crellyslider');
					else {
						if($element->data_ignoreEaseOut) {
							echo '<input class="cs-element-data_ignoreEaseOut" type="checkbox" checked />' . __('Disable synchronization with slide out animation', 'crellyslider');
						}
						else {
							echo '<input class="cs-element-data_ignoreEaseOut" type="checkbox" />' . __('Disable synchronization with slide out animation', 'crellyslider');
						}
					}
					?>
				</td>
				<td class="cs-description">
					<?php _e('The out animation of the element.<br /><br />Disable synchronization with slide out animation: if not checked, the slide out animation won\'t start until all the elements that have this option unchecked are animated out.', 'crellyslider'); ?>
				</td>
			</tr>
			<tr>
				<td class="cs-name"><?php _e('Ease in', 'crellyslider'); ?></td>
				<td class="cs-content">
					<?php
					if($void) echo '<input class="cs-element-data_easeIn" type="text" value="300" />';
					else echo '<input class="cs-element-data_easeIn" type="text" value="' . $element->data_easeIn .'" />';
					?>
					ms
				</td>
				<td class="cs-description">
					<?php _e('How long will the in animation take.', 'crellyslider'); ?>
				</td>
			</tr>
			<tr>
				<td class="cs-name"><?php _e('Ease out', 'crellyslider'); ?></td>
				<td class="cs-content">
					<?php
					if($void) echo '<input class="cs-element-data_easeOut" type="text" value="300" />';
					else echo '<input class="cs-element-data_easeOut" type="text" value="' . $element->data_easeOut .'" />';
					?>
					ms
				</td>
				<td class="cs-description">
					<?php _e('How long will the out animation take.', 'crellyslider'); ?>
				</td>
			</tr>
			<tr>
				<td class="cs-name"><?php _e('Custom CSS', 'crellyslider'); ?></td>
				<td class="cs-content">
					<?php
					if($void) echo '<textarea class="cs-element-custom_css"></textarea>';
					else echo '<textarea class="cs-element-custom_css">' . stripslashes($element->custom_css) . '</textarea>';
					?>
				</td>
				<td class="cs-description">
					<?php _e('Style the element.', 'crellyslider'); ?>
				</td>
			</tr>
			<tr>
				<td class="cs-name"><?php _e('Custom classes', 'crellyslider'); ?></td>
				<td class="cs-content">
					<?php
					if($void) echo '<input class="cs-element-custom_css_classes" type="text" />';
					else echo '<input class="cs-element-custom_css_classes" type="text" value="' . stripslashes($element->custom_css_classes) . '" />';
					?>
				</td>
				<td class="cs-description">
					<?php _e('Apply custom CSS classes to the element. The style of the classes may not work when working on backend.', 'crellyslider'); ?>
				</td>
			</tr>
		</tbody>
	</table>
<?php } ?>