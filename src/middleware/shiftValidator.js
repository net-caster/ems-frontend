export default function signupValidator(values) {
	let errors = {};

	if (!values.employeeId) {
		errors.employee = 'You must select an employee!';
	}

	if (!values.date) {
		errors.date = 'You must pick a valid date!';
	}

	if (values.shiftHours === 0) {
		errors.shiftHours = 'Total hours must be more than 0!';
	}

	if (!values.shiftWage) {
		errors.shiftWage = 'There is no wage for this shift!';
	}

	return errors;
}
