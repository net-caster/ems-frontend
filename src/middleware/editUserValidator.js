export default function editUserValidation(values) {
	let errors = {};

	if (!values.name) {
		errors.name = 'Name is required!';
	} else if (!/^([a-z-'.]+\s?)+$/gi.test(values.name) || values.name.length < 2) {
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

	if (!values.password) {
		errors.password = 'You need your password to make changes!';
	}

	if (values.password && values.newPassword && values.newPassword.length < 8) {
		errors.newPassword = 'Your new password must be 8 characters or longer!';
	}

	if (values.newPassword && values.confirmNewPassword !== values.newPassword) {
		errors.confirmNewPassword = 'Passwords do not match!';
	}

	if (values.company && !/^([a-z-'.0-9]+\s?)+$/gi.test(values.company)) {
		errors.company = 'No special characters are allowed!';
	}

	return errors;
}
