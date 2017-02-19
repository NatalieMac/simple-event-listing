import ReactDOM from 'react-dom';
import React, {Component} from 'react';
import {AdminHeader, Button, Notice} from 'components/wp';
import WPAPI from 'wpapi';
import WP_API_Settings from 'WP_API_Settings';
import { Icon } from 'react-fa';
import EventForm from './components/simple-events/EventForm';
import EventList from './components/simple-events/EventList';

require('./admin.scss');

class App extends Component {

	constructor(props) {
		super(props);

		this.state = {
			authError: false,
			simpleEvents: [],
			loading: true,
		};

		this.hideEvent = this.hideEvent.bind(this);
		this.showEvent = this.showEvent.bind(this);
		this.deleteEvent = this.deleteEvent.bind(this);
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

	hideEvent(simpleEvent) {
		this.api.simpleEvents()
			.id(simpleEvent.id)
			.update(Object.assign(simpleEvent, {
				status: 'draft'
			}))
			.then(result => {
				this.updateData();
				return result;
			})
	}

	showEvent(simpleEvent) {
		this.api.simpleEvents()
			.id(simpleEvent.id)
			.update(Object.assign(simpleEvent, {
				status: 'publish'
			}))
			.then(result => {
				this.updateData();
				return result;
			})
	}

	deleteEvent(simpleEvent) {
		this.api.simpleEvents()
			.id(simpleEvent.id)
			.delete()
			.then(result => {
				this.updateData();
				return result;
			})
	}

	saveEvent(simpleEvent) {
		const { currentEvent } = this.state;

		console.table(currentEvent);

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
				this.setState({
					currentEvent: null
				});
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
		let viewClass = this.state.currentEvent ? 'single-view' : 'list-view';
		let header = (
			<div className="app-header">
				<AdminHeader>Simple Event Listing</AdminHeader>
				<button
					className="btn"
					onClick={()=>this.handleEditClick({})}
					title="Add new event">
					<Icon name="plus"/> Add New
				</button>
			</div>
		);
		let listing = this.state.simpleEvents.length ? (
			<EventList
				simpleEvents={this.state.simpleEvents}
				onEdit={this.handleEditClick}
				onHide={this.hideEvent}
				onShow={this.showEvent}
				onDelete={this.deleteEvent}
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
				<div className={'simple-event-listing-ui' + ' ' + viewClass}>
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
