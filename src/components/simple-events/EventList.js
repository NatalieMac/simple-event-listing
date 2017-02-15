import React from 'react';

let EventList = (props) => props.events ? (
	<ul className="event-list">
		{props.events.map(event => (
			<li key={`event${event.id}`}>
				<div>{event.event_start_date}</div>
				<h3 dangerouslySetInnerHTML={{
          __html: event.title.rendered
        }} />
			</li>
		))}
	</ul>
) : null;

export default EventList;