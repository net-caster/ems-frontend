import React, { useState, useEffect } from 'react';

const useForm = (callback, validate) => {
	const [ formValues, setFormValues ] = useState({});
	const [ formErrors, setFormErrors ] = useState({});
	const [ isSubmitting, setIsSubmitting ] = useState(false);

	const handleChange = (event) => {
		let { name, value } = event.target;

		setFormValues({
			...formValues,
			[name]: value
		});
	};

	const handleSubmit = (event) => {
		event.preventDefault();

		setFormErrors(validate(formValues));
		setIsSubmitting(true);
	};

	useEffect(
		() => {
			if (Object.keys(formErrors).length === 0 && isSubmitting) {
				callback();
			}
		},
		[ formErrors ]
	);

	return {
		handleChange,
		handleSubmit,
		formValues,
		setFormValues,
		formErrors,
		setFormErrors,
		setIsSubmitting
	};
};

export default useForm;
