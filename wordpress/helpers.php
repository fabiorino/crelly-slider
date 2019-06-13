<?php
if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class CrellySliderHelpers {
    // Removes a directory and its content
    public static function delTree($dir) {
        $files = array_diff(scandir($dir), array('.','..'));
        foreach ($files as $file) {
            (is_dir("$dir/$file")) ? delTree("$dir/$file") : unlink("$dir/$file");
        }
        return rmdir($dir);
    }

    public static function setNonce($sliderID) {
        global $wpdb;

        $nonce = self::randomString(10);

        $replace = $wpdb->replace(
            $wpdb->prefix . 'crellyslider_nonces',
            array(
                'slider_id' => $sliderID,
                'nonce' => $nonce,
            ),
            array(
                '%d',
                '%s',
            )
        );

        if($replace) {
            return $nonce;
        }
        return false;
    }

    public static function getNonce($sliderID) {
        global $wpdb;

        $table_name = $wpdb->prefix . 'crellyslider_nonces';

        $nonce = $wpdb->get_var($wpdb->prepare("SELECT nonce FROM $table_name WHERE slider_id=%d", $sliderID));
        if($nonce == null) {
            return self::setNonce($sliderID);
        }
        return $nonce;
    }

    public static function verifyNonce($sliderID, $nonce) {
        global $wpdb;
        $table_name = $wpdb->prefix . 'crellyslider_nonces';
        $dbNonce = $wpdb->get_var($wpdb->prepare("SELECT nonce FROM $table_name WHERE slider_id=%d", $sliderID));
        return $nonce === $dbNonce;
    }

    public static function removeNonce($sliderID) {
        global $wpdb;
        return $wpdb->delete( $wpdb->prefix . 'crellyslider_nonces', array( 'slider_id' => $sliderID ), array( '%d' ) );
    }

    public static function randomString($length) {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }
        return $randomString;
    }
}
?>