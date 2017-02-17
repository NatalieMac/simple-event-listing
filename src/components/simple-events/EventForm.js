import React, {Component} from 'react';

class EventForm extends Component {
  constructor(props) {
    super(props);

    let event = props.event;

		this.state = {
			title: null,
			content: null,
			location: null,
			link: null,
			startDate: null
		}

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const { value, name } = event.target;
    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    event.preventDefault();

		let { onSubmit } = this.props;
		let title = this.valueOf('title');
		let content = this.valueOf('content');
		let location = this.valueOf('location');
		let link = this.valueOf('link');
		let startDate = this.valueOf('startDate');

    if (!title || !startDate) {
      return;
    }

    onSubmit({
			title,
			content,
			location,
			link,
			startDate
    }).then(result => {
      this.setState({
				title: null,
				content: null,
				location: null,
				link: null,
				startDate: null
      });
    });
  }

  valueOf(prop) {
    if (this.state[prop] !== null) {
      return this.state[prop];
    }

    if (this.props.event && this.props.event[prop]) {
      return this.props.event[prop].raw ?
        this.props.event[prop].raw :
        this.props.event[prop];
    }

    return '';
  }

	render() {
		let values = {
			title: this.valueOf('title'),
			content: this.valueOf('content'),
			location: this.valueOf('location'),
			link: this.valueOf('link'),
			startDate: this.valueOf('startDate')
		};

		return(
			<form onSubmit={this.handleSubmit.bind(this)}>
				<h2>Create an Event</h2>
				<div className="form-field">
					<label>Event Title</label>
					<input
						type="text"
						name="title"
						value={values.title}
						onChange={this.handleChange.bind(this)}
						required />
				</div>
				<div className="form-field">
					<label>Location</label>
					<input
						type="text"
						name="location"
						value={values.location}
						onChange={this.handleChange.bind(this)}/>
				</div>
				<div className="form-field">
					<label>Link</label>
					<input
						type="text"
						name="link"
						value={values.link}
						onChange={this.handleChange.bind(this)}/>
				</div>
				<div className="form-field">
					<label>Start Date</label>
					<input
						type="text"
						name="startDate"
						value={values.startDate}
						onChange={this.handleChange.bind(this)}
						required/>
				</div>
				<div className="form-field">
					<label>Description</label>
					<textarea
						name="content"
						value={values.content}
						onChange={this.handleChange.bind(this)}></textarea>
				</div>
				<button type="submit" className="button-primary">Save</button>
			</form>
		);
	}
}

export default EventForm;