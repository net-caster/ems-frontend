export default function inputValidation(values) {
	let errors = {};

	if (!values.name) {
		errors.name = 'Name is required!';
	} else if (!/^[a-zA-Z.\s]+$/.test(values.name) || values.name.length < 2) {
		errors.name = 'Please enter a valid name!';
	}

	if (!values.email) {
		errors.email = 'An E-Mail address is required!';
	} else if (
		!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(
			values.email
		)
	) {
		errors.email = 'Please enter a valid e-mail address!';
	}

	if (!values.password && !values.confirmPassword) {
		errors.password = 'You need a password to continue!';
	} else if (values.password.length < 8) {
		errors.password = 'Your password must be at least 8 characters long!';
	}

	if (values.password && values.password.length >= 8 && !values.confirmPassword) {
		errors.confirmPassword = 'Please enter your password again!';
	} else if (values.confirmPassword !== values.password && values.password.length >= 8) {
		errors.confirmPassword = 'Please make sure the passwords match!';
	}

	if (!values.payRate) {
		errors.payRate = 'You must enter an hourly wage!';
	} else if (values.payRate === 0 || !/^\d+.?\d+$/.test(values.payRate)) {
		errors.payRate = 'Please enter a valid wage!';
	}

	return errors;
}
