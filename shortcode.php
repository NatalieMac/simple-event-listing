<?php

function simple_event_listing_shortcode( $atts ) {
	return '<p>Boo!</p>';
}

add_shortcode( 'simple_event_listing', 'simple_event_listing_shortcode' );