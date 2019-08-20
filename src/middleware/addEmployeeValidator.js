export default function inputValidation(values) {
	let errors = {};

	if (!values.name) {
		errors.name = 'Employee name is required!';
	} else if (!/^([a-z-'.]+\s?)+$/gi.test(values.name) || values.name.length < 2) {
		errors.name = 'Please enter a valid name!';
	}

	if (!values.payRate) {
		errors.payRate = 'You must enter an hourly wage!';
	} else if (values.payRate === '0') {
		errors.payRate = "Wage can't be 0!";
	} else if (!/^([0-9]*|\d*\.\d{1}?\d{0,1})$/.test(values.payRate)) {
		errors.payRate = 'Entered wage is not valid!';
	}

	return errors;
}
