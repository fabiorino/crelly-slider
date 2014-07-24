<?php
global $wpdb;
$sliders = $wpdb->get_results('SELECT * FROM ' . $wpdb->prefix . 'crellyslider_sliders');

if(!$sliders) {
	echo '<div class="cs-no-sliders">';
	_e('No Sliders found. Please add a new one.', 'crellyslider');
	echo '</div>';
	echo '<br /><br />';
}
else {
	?>
	
	<table class="cs-sliders-list cs-table">
		<thead>
			<tr>
				<th colspan="5"><?php _e('Sliders List', 'crellyslider'); ?></th>
			</tr>
		</thead>
		<tbody>
			<tr class="cs-table-header">
				<td><?php _e('ID', 'crellyslider'); ?></td>
				<td><?php _e('Name', 'crellyslider'); ?></td>
				<td><?php _e('Alias', 'crellyslider'); ?></td>
				<td><?php _e('Shortcode', 'crellyslider'); ?></td>
				<td><?php _e('Actions', 'crellyslider'); ?></td>
			</tr>
			<?php
			foreach($sliders as $slider) {
				echo '<tr>';
				echo '<td>' . $slider->id . '</td>';
				echo '<td><a href="?page=crellyslider&view=edit&id=' . $slider->id . '">' . $slider->name . '</a></td>';
				echo '<td>' . $slider->alias . '</td>';
				echo '<td>[crellyslider alias="' . $slider->alias . '"]</td>';
				echo '<td>
					<a class="cs-edit-slider cs-button cs-button cs-is-success" href="?page=crellyslider&view=edit&id=' . $slider->id . '">' . __('Edit Slider', 'crellyslider') . '</a>
					<a class="cs-delete-slider cs-button cs-button cs-is-danger" href="javascript:void(0)" data-delete="' . $slider->id . '">' . __('Delete Slider', 'crellyslider') . '</a>
				</td>';
				echo '</tr>';
			}
			?>
		</tbody>
	</table>
	<?php
}
?>

<br />
<a class="cs-button cs-is-primary cs-add-slider" href="?page=crellyslider&view=add"><?php _e('Add Slider', 'crellyslider'); ?></a>