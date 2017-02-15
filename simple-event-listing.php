<?php

/**
 * Plugin Name: Simple Event Listing
 * Description: Easily create events and list them with widgets, shortcodes, or custom templates
 * Author: Natalie MacLees
 */

include dirname( __FILE__ ) . '/widget.php';
include dirname( __FILE__ ) . '/shortcode.php';

class Simple_Event_Listing {

	static function widgets_init() {
		register_widget( 'Simple_Event_Listing_Widget' );
	}

	static function add_admin_page() {
		$my_page = add_menu_page(
			'Simple Event Listing',
			'Events',
			'manage_options',
			'simple-event-listing',
			array( 'Simple_Event_Listing', 'render_event_admin' ),
			'dashicons-editor-ul',
			21
		);

		add_action( 'load-' . $my_page, array( 'Simple_Event_Listing', 'load_admin_js') );
	}

	static function load_admin_js() {
		add_action( 'admin_enqueue_scripts', array( 'Simple_Event_Listing', 'admin_enqueue_scripts') );
	}

	static function admin_enqueue_scripts() {
		wp_register_script( 'simple-event-listing-admin', plugins_url( 'build/admin.js', __FILE__ ), array(), time(), true );
		wp_enqueue_style( 'simple-event-listing-admin', plugins_url( 'build/admin.css', __FILE__ ), array(), 'v0.0.1');

		wp_localize_script(
			'simple-event-listing-admin',
			'WP_API_Settings',
			array(
				'root' => esc_url_raw( rest_url() ),
				'nonce'	=> wp_create_nonce( 'wp_rest' )
			)
		);

		wp_enqueue_script( 'simple-event-listing-admin' );
	}

	static function render_event_admin() {
		echo '<div id="simple_event_listing" class="wrap"></div>';
	}

	static function register_event_post_type() {
		$args = array(
			'labels' => array(
				'name' => _x( 'Events', 'post type general name', 'simpleeventlisting' ),
				'singular_name' => _x( 'Event', 'post type singular name', 'simpleeventlisting' ),
			),
			'description' => __( 'Events to be listed', 'simpleeventlisting' ),
			'hierarchical' => false,
			'menu_position' => null,
			'public' => false,
			'show_in_rest' => true,
			'rest_base' => 'simpleEvents',
			'capability_type' => 'post',
			'supports' => array( 'title', 'editor', 'custom-fields' )
		);

		register_post_type( 'simple_event', $args );
	}

	static function register_rest_fields() {
		// Event Location field
		register_rest_field(
			'simple_event',
			'event_location',
			array(
				'get_callback' => function ( $data ) {
					return get_post_meta( $data['id'], '_event_location', true );
				},
				'update_callback' => function ( $value, $post ) {
					$value = sanitize_text_field( $value );
					update_post_meta( $post->ID, '_event_location', wp_slash( $value ) );
				},
				'schema' => array(
					'description' => __( 'The location of the event.', 'simpleeventlisting' ),
					'type' => 'string'
				),
			)
		);
		// Event Link field
		register_rest_field(
			'simple_event',
			'event_link',
			array(
				'get_callback' => function ( $data ) {
					return get_post_meta( $data['id'], '_event_link', true );
				},
				'update_callback' => function ( $value, $post ) {
					$value = sanitize_text_field( $value );
					update_post_meta( $post->ID, '_event_link', wp_slash( $value ) );
				},
				'schema' => array(
					'description' => __( 'The link to buy ticket or learn more about the event', 'simpleeventlisting' ),
					'type' => 'string'
				),
			)
		);
		// Event Start Date field
		register_rest_field(
			'simple_event',
			'event_start_date',
			array(
				'get_callback' => function ( $data ) {
					return get_post_meta( $data['id'], '_event_start_date', true );
				},
				'update_callback' => function ( $value, $post ) {
					$value = sanitize_text_field( $value );
					update_post_meta( $post->ID, '_event_start_date', wp_slash( $value ) );
				},
				'schema' => array(
					'description' => __( 'The starting date of the event', 'simpleeventlisting' )
				),
			)
		);
	}
}

add_action( 'widgets_init', array( 'Simple_Event_Listing', 'widgets_init' ) );
add_action( 'init', array( 'Simple_Event_Listing', 'register_event_post_type' ) );
add_action ('rest_api_init', array( 'Simple_Event_Listing', 'register_rest_fields' ) );
add_action( 'admin_menu', array( 'Simple_Event_Listing', 'add_admin_page' ) );
