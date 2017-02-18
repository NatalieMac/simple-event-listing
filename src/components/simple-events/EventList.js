import React, { PropTypes } from 'react';

let EventList = (props) => props.simpleEvents ? (
	<ul className="event-list">
		{props.simpleEvents.map(simpleEvent => (
			<li key={`simpleEvent${simpleEvent.id}`}>
				<p>{simpleEvent.start_date}</p>
				<h3 dangerouslySetInnerHTML={{
          __html: simpleEvent.title.rendered
        }} />
        <button
        	onClick={() => {
        		if (props.selected && props.selected.id === simpleEvent.id) {
        			return props.onEdit(null);
        		}
        		return props.onEdit(simpleEvent);
        	}}
        >Edit</button>
			</li>
		))}
	</ul>
) : null;

export default EventList;