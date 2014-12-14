<?php

class CrellySliderTables {

	// Update the current Crelly Slider version in the database
	public static function setVersion() {
		update_option('cs_version', CS_VERSION);
	}

	public static function removeVersion() {
		delete_option('cs_version');
	}

	// Creates or updates all the tables
	public static function setTables() {
		self::setSlidersTable();
		self::setSlidesTable();
		self::setElementsTable();
	}

	public static function setSlidersTable(){
		global $wpdb;
		$table_name = $wpdb->prefix . 'crellyslider_sliders';
		
		$sql = "CREATE TABLE $table_name (
		id mediumint(9) NOT NULL AUTO_INCREMENT,
		name VARCHAR(100) CHARACTER SET utf8,
		alias VARCHAR(100) CHARACTER SET utf8,
		layout VARCHAR(100) CHARACTER SET utf8,
		responsive INT,
		startWidth INT,
		startHeight INT,
		automaticSlide INT,
		showControls INT,
		showNavigation INT,
		enableSwipe INT DEFAULT 1,
		showProgressBar INT,
		pauseOnHover INT,
		callbacks TEXT CHARACTER SET utf8,
		UNIQUE KEY id (id)
		);";
		
		require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
		dbDelta($sql);
	}

	// Warning: the time variable is a varchar because it could contain the 'all' word
	public static function setSlidesTable(){
		global $wpdb;
		$table_name = $wpdb->prefix . 'crellyslider_slides';
		
		$sql = "CREATE TABLE $table_name (
		id mediumint(9) NOT NULL AUTO_INCREMENT,
		slider_parent mediumint(9),
		position INT,
		background_type_image VARCHAR(255) CHARACTER SET utf8,
		background_type_color VARCHAR(100) CHARACTER SET utf8,
		background_propriety_position_x VARCHAR(100) CHARACTER SET utf8,
		background_propriety_position_y VARCHAR(100) CHARACTER SET utf8,
		background_repeat VARCHAR(100) CHARACTER SET utf8,
		background_propriety_size VARCHAR(100) CHARACTER SET utf8,
		data_in VARCHAR(100) CHARACTER SET utf8,
		data_out VARCHAR(100) CHARACTER SET utf8,
		data_time INT,
		data_easeIn INT,
		data_easeOut INT,
		custom_css TEXT CHARACTER SET utf8,
		UNIQUE KEY id (id)
		);";
		
		require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
		dbDelta($sql);
	}

	public static function setElementsTable(){
		global $wpdb;
		$table_name = $wpdb->prefix . 'crellyslider_elements';
		
		$sql = "CREATE TABLE $table_name (
		id mediumint(9) NOT NULL AUTO_INCREMENT,
		slider_parent mediumint(9),
		slide_parent mediumint(9),
		position INT,
		type VARCHAR(100) CHARACTER SET utf8,
		data_easeIn INT,
		data_easeOut INT,
		data_ignoreEaseOut INT DEFAULT 0,
		data_delay INT,
		data_time VARCHAR(100) CHARACTER SET utf8,
		data_top FLOAT,
		data_left FLOAT,
		z_index INT,
		data_in VARCHAR(100) CHARACTER SET utf8,
		data_out VARCHAR(100) CHARACTER SET utf8,
		custom_css VARCHAR(100) CHARACTER SET utf8,
		inner_html TEXT CHARACTER SET utf8,
		image_src TEXT CHARACTER SET utf8,
		image_alt TEXT CHARACTER SET utf8,
		link VARCHAR(100) CHARACTER SET utf8 DEFAULT '',
		link_new_tab INT DEFAULT 0,
		UNIQUE KEY id (id)
		);";
		
		require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
		dbDelta($sql);
	}

	// Drops all the slider tables
	public static function dropTables() {
		global $wpdb;
		
		self::dropTable($wpdb->prefix . 'crellyslider_sliders');
		self::dropTable($wpdb->prefix . 'crellyslider_slides');
		self::dropTable($wpdb->prefix . 'crellyslider_elements');
	}

	public static function dropTable($table_name) {
		global $wpdb;
		
		$sql = 'DROP TABLE ' . $table_name . ';';
		$wpdb->query($sql);
	}

}

?>
