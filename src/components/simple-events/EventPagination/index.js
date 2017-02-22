import ReactDOM from 'react-dom';
import React, {Component} from 'react';
import {Icon} from 'react-fa';

require('./style.scss');

class Pagination extends Component {
	constructor(props) {
		super(props);

	}

	render() {
		if ( this.props.totalEvents > 0) {
			let pages = new Array(this.props.totalPages);
			return (
				<nav className="pagination">
					<ul>
						<li>The current page is: {this.props.currentPage}</li>
						<li>The total number of pages is: {this.props.totalPages}</li>
						<li>The total number of events is: {this.props.totalEvents}</li>
					</ul>
				</nav>
			);
		}
	}
}

export default Pagination;