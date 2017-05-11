<?php

function simple_event_listing_shortcode( $atts ) {
	$a = shortcode_atts( array(
		'type' => 'upcoming',
		'order' => 'ASC',
	), $atts );

	$today = date( 'Ymd' );
	$meta_query = array(
		array(
			'key' => '_start_date',
			'compare' => '>=',
			'value' => $today
		),
	);

	$args = array(
		'meta_key'	=> '_start_date',
		'order'	=> $a['order'],
		'orderby'	=> 'meta_value_num',
		'post_type'	=> 'simple_event',
		'posts_per_page'	=> -1,
		'meta_query'	=> $meta_query,
	);

	$events = new WP_Query( $args );

	ob_start(); ?>

	<?php if ( $events->have_posts() ) : ?>
		<ul class="simple-event-listing">
			<?php while( $events->have_posts() ): $events->the_post(); ?>
				<li>
					<h3 class="simple-event-title">
						<a href="<?php echo get_post_meta( get_the_id(), '_link', true ); ?>">
							<?php the_title(); ?>
						</a>
					</h3>
					<div class="simple-event-meta">
						<div class="simple-event-start_date">
							<?php
								$date = get_post_meta( get_the_id(), '_start_date', true );
								$date = new DateTime( $date );
							?>
							<strong>When:</strong> <?php echo $date->format('F j, Y'); ?>
						</div>
						<div class="simple-event-locale">
							<strong>Locale:</strong> <?php echo get_post_meta( get_the_id(), '_locale', true ); ?></div>
					</div>
					<div class="simple-event-description">
						<?php the_content(); ?>
					</div>
				</li>
			<?php endwhile; ?>
		</ul>
	<?php
		else : ?>
			<p class="simple-events-empty">No events found</p>
		<?php endif;
		wp_reset_postdata();
	 ?>

	<?php return ob_get_clean();
}

add_shortcode( 'simple_event_listing', 'simple_event_listing_shortcode' );