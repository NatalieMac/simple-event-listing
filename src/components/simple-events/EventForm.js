import React, {PropTypes, Component} from 'react';

class EventForm extends Component {
  constructor(props) {
    super(props);

    let simpleEvent = props.simpleEvent;

		this.state = {
			missingTitle: false,
			missingStartDate: false,
			title: null,
			content: null,
			locale: null,
			link: null,
			start_date: null
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
		let locale = this.valueOf('locale');
		let link = this.valueOf('link');
		let start_date = this.valueOf('start_date');

		this.setState({
			missingTitle: !title,
			missingStartDate: !start_date,
		});

    if (!title || !start_date) {
      return;
    }

    onSubmit({
			title,
			content,
			locale,
			link,
			start_date
    }).then(result => {
      this.setState({
				title: null,
				content: null,
				locale: null,
				link: null,
				start_date: null
      });
    });
  }

  valueOf(prop) {
    if (this.state[prop] !== null) {
      return this.state[prop];
    }

    if (this.props.simpleEvent && this.props.simpleEvent[prop]) {
      return this.props.simpleEvent[prop].raw ?
        this.props.simpleEvent[prop].raw :
        this.props.simpleEvent[prop];
    }

    return '';
  }

	render() {
		let values = {
			title: this.valueOf('title'),
			content: this.valueOf('content'),
			locale: this.valueOf('locale'),
			link: this.valueOf('link'),
			start_date: this.valueOf('start_date')
		};

		return(
			<form onSubmit={this.handleSubmit}>
				<h2>{!!this.props.simpleEvent ? 'Edit' : 'Create'} Event</h2>
				<div className="form-field">
					<label>Event Title</label>
					{this.state.missingTitle ? (
						<p class="error">Title is required</p>
					) : null}
					<input
						type="text"
						name="title"
						value={values.title}
						onChange={this.handleChange}
						required />
				</div>
				<div className="form-field">
					<label>Location</label>
					<input
						type="text"
						name="locale"
						value={values.locale}
						onChange={this.handleChange}/>
				</div>
				<div className="form-field">
					<label>Link</label>
					<input
						type="text"
						name="link"
						value={values.link}
						onChange={this.handleChange}/>
				</div>
				<div className="form-field">
					{this.state.missingStartDate ? (
						<p class="error">Start Date is required</p>
					) : null}
					<label>Start Date</label>
					<input
						type="text"
						name="start_date"
						value={values.start_date}
						onChange={this.handleChange}
						required/>
				</div>
				<div className="form-field">
					<label>Description</label>
					<textarea
						name="content"
						value={values.content}
						onChange={this.handleChange}></textarea>
				</div>
				<button
					type="button"
					className="button-secondary"
					onClick={()=>this.props.onCancel(null)}>Cancel</button>
				<button
					type="submit"
					className="button-primary">Save</button>
			</form>
		);
	}
}

EventForm.propTypes = {
  simpleEvent: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.shape({
      raw: PropTypes.string,
      rendered: PropTypes.string,
    }),
    content: PropTypes.shape({
      raw: PropTypes.string,
      rendered: PropTypes.string,
    }),
    date: PropTypes.string,
    locale: PropTypes.string,
    link: PropTypes.string,
    start_date: PropTypes.string,
  }),
  onSubmit: PropTypes.func.isRequired,
};


export default EventForm;