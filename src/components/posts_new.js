import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import { createPost } from '../actions/index';
import { Link } from 'react-router';
import _ from 'lodash';

const FIELDS = {
	title: {
		type: 'input',
		label: 'Title for Post'
	},
	categories: {
		type: 'input',
		label: 'Enter some categories for this post'
	},
	content: {
		type: 'textarea',
		label: 'Post Contents'
	}
};

class PostsNew extends Component {
	// only use context when using router
	static contextTypes = {
		router: PropTypes.object
	};

	renderField(fieldConfig, field){
		const fieldHelper = this.props.fields[field]; //from redux form

		return (
			<div className={`form-group ${fieldHelper.touched && fieldHelper.invalid ? 'has-danger' : ''}`}>
				<label>{fieldConfig.label}</label>
				<fieldConfig.type  className="form-control" {...fieldHelper} />
				<div className="text-help">
					{fieldHelper.touched ? fieldHelper.error : ''}
				</div>
			</div>
		)
	}

	onSubmit(props) {
		this.props.createPost(props)
			.then(() => {
				// blog post has been created, navigate the user to the index
				// we navigate by calling this.context//router/push with the new path to navigate to
				this.context.router.push('/');
			});
	}

	render(){
		const { handleSubmit } = this.props;

		return (
			<form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
				<h3>Create a New Post </h3>

				{_.map(FIELDS, this.renderField.bind(this))}

				<button type="submit" className="btn btn-primary">Submit</button>
				<Link to="/" className="btn btn-danger">Cancel</Link>

			</form>
		);
	}
}

function validate(values) {
	const errors = {};

	_.each(FIELDS, (type, field) => {
		if (!values[field]){
			errors[field] = `Enter a ${field}`
		}
	})

	return errors;
}

// connect: first argument is mapStateToProps, seoncd mapDispatchToProps
// redux Form: first is form config, 2nd and 3rd are the same as connect

export default reduxForm({
	form: 'PostsNewForm',
	fields: _.keys(FIELDS),
	validate
}, null, { createPost })(PostsNew);

//{...title} destructures and passes all the functions in