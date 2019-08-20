export default function inputValidation(values) {
	let errors = {};

	if (!values.email) {
		errors.email = 'An E-Mail address is required!';
	} else if (
		!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(
			values.email
		)
	) {
		errors.email = 'Please enter a valid e-mail address!';
	}

	if (!values.password) {
		errors.password = 'You need a password to login!';
	}

	return errors;
}
