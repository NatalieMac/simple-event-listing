import ReactDOM from 'react-dom';
import React, {Component} from 'react';
import {AdminHeader, Button, Notice} from 'components/wp';
import WPAPI from 'wpapi';
import WP_API_Settings from 'WP_API_Settings';
import EventForm from 'components/simple-events/EventForm';
import EventList from 'components/simple-events/EventList';

class App extends Component {
	constructor() {
		super(...arguments);

		this.state = {
			events: [],
			loading: true
		};
	}

	componentDidMount() {
		this.api = new WPAPI({
			endpoint: WP_API_Settings.root,
			nonce: WP_API_Settings.nonce
		});

		this.api.simpleEvents = this.api.registerRoute( 'wp/v2', 'simpleEvents/(?P<id>[\\d]+)', {
			params: ['status']
		});

		this.updateData();
	}

	updateData() {
		this.api.simpleEvents()
			.status('any')
			.context('edit')
			.then(events => {
				this.setState({
					loading: false,
					events,
				});
			})
			.catch(e => {
				this.setState({
					loading: false,
				});
				console.error(e);
			});
	}

	saveEvent(event) {
		let {current_event} = this.state;

		if (current_event && current_event.id) {

		}

		return this.api.simpleEvents()
			.create({
				title: event.title,
				content: event.content,
				event_location: event.location,
				event_link: event.link,
				event_start_date: event.startDate,
				status:'publish'
			})
			.then(result => {
				this.updateData();
				return result;
			})
	}

	render() {
		if (this.state.loading) {
			return (
				<div className='simple-event-listing'>
					<AdminHeader>Simple Event Listing</AdminHeader>
					<p>Loading&hellip;</p>
				</div>
			);
		}
		return (
			<div className='simple-event-listing'>
				<AdminHeader>Simple Event Listing</AdminHeader>
				<EventList events={this.state.events} />
				<EventForm onSubmit={this.saveEvent.bind(this)}/>
			</div>
		);
	}
}

ReactDOM.render(
	<App />,
	document.getElementById( 'simple_event_listing' )
);
