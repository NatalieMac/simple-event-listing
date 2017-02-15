<?php

/**
 * Simple widget for listing events
 */
class Simple_Event_Listing_Widget extends WP_Widget {

	function __construct() {
		$widget_ops = array(
			'description' => __( 'Customizable listing of simple-event-listing.php')
		);
		parent::__construct( 'react-demo', __('Simple Event Listing'), $widget_ops);
	}

	function widget( $args, $instance ) {
		echo $args['before_widget'];
		?>
			<div class="simple-event-listing-widget"></div>
		<?php
		echo $args['after_widget'];
	}

	function update( $new_instance, $old_instance ) {

	}

	function form( $instance ) {

	}

}
