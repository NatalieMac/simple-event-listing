import ReactDOM from 'react-dom';
import React, {Component} from 'react';
import {AdminHeader, Button, Notice} from 'components/wp';
import WPAPI from 'wpapi';
import WP_API_Settings from 'WP_API_Settings';
import EventForm from 'components/simple-events/EventForm';
import EventList from 'components/simple-events/EventList';

class App extends Component {

	constructor(props) {
		super(props);

		this.state = {
			authError: false,
			simpleEvents: [],
			loading: true,
		};

		this.saveEvent = this.saveEvent.bind(this);
		this.handleEditClick = this.handleEditClick.bind(this);
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

	saveEvent(simpleEvent) {
		const { currentEvent } = this.state;

		if (currentEvent && currentEvent.id) {
			return this.api.simpleEvents()
				.id(currentEvent.id)
				.update(Object.assign(simpleEvent, {
					status: 'publish'
				}))
				.then(result => {
					this.setState({
						currentEvent: null
					});
					this.updateData();
					return result;
				});
		}

		return this.api.simpleEvents()
			.create({
				title: simpleEvent.title,
				content: simpleEvent.content,
				locale: simpleEvent.locale,
				link: simpleEvent.link,
				start_date: simpleEvent.start_date,
				status: 'publish'
			})
			.then(result => {
				this.updateData();
				return result;
			});
	}

	handleEditClick(simpleEvent) {
		this.setState({
			currentEvent: simpleEvent
		});
	}

  updateData() {
    this.api.simpleEvents()
      .status('any')
      .context('edit')
      .then(simpleEvents => {
        this.setState({
          loading: false,
          simpleEvents,
        });
      })
      .catch(e => {
        this.setState({
          loading: false,
        });
        if (e.data && e.data.status === 400) {
        	this.setState({
        		authError: true
        	});
        } else {
          console.error(e);
        }
      });
  }

	render() {
		let header = <AdminHeader>Simple Event Listing</AdminHeader>;
		let listing = this.state.simpleEvents.length ? (
			<EventList
				simpleEvents={this.state.simpleEvents}
				onEdit={this.handleEditClick}
				selected={this.state.currentEvent}/>
		) : (
			<p>No events found</p>
		);


		if (this.state.authError) {
			return (
				<div className='simple-event-listing'>
					{header}
					<h2>Authentication Failure</h2>
					<p>You must be logged in to manage events</p>
				</div>
			);
		}

		if (this.state.loading) {
			return (
				<div className='simple-event-listing'>
					{header}
					<p>Loading Simple Events&hellip;</p>
				</div>
			);
		}

		return (
			<div className='simple-event-listing'>
				{header}
				<div className='simple-event-listing-ui'>
					{listing}
					<EventForm
						simpleEvent={this.state.currentEvent}
						onSubmit={this.saveEvent}
						onCancel={this.handleEditClick}/>
				</div>
			</div>
		);
	}
}

ReactDOM.render(
	<App />,
	document.getElementById( 'simple_event_listing' )
);
