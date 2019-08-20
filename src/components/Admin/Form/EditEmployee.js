import React, { useContext, useEffect, useState } from 'react';

import useForm from '../../../hooks/useForm';
import addEmployeeValidator from '../../../middleware/addEmployeeValidator';

import { FormContext } from '../../../contexts/FormContext';
import { AuthContext } from '../../../contexts/AuthContext';

const EditEmployee = (props) => {
	const { handleChange, handleSubmit, formValues, setFormValues, formErrors } = useForm(
		submitEdit,
		addEmployeeValidator
	);
	const [ formState, setFormState ] = useContext(FormContext);
	const [ authState, setAuthState ] = useContext(AuthContext);

	useEffect(
		() => {
			setFormValues(props.employee);
		},
		[ props.employee ]
	);

	if (!formState.showEditEmployee) return null;

	const cancelEdit = () => {
		setFormState({ ...formState, showEditEmployee: false });
	};

	const url = `https://react-ems.herokuapp.com/auth/edit-employee/${props.employee.id}`;
	const options = {
		method: 'PUT',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(formValues)
	};

	async function submitEdit() {
		setFormState({ ...formState, showLoading: true });

		try {
			const result = await fetch(url, options);
			const data = await result.json();

			if (data.redirect) {
				setTimeout(() => {
					location.reload();
					setFormState({ ...formState, showLoading: false });
				}, 1000);
			}
		} catch (err) {
			console.log(err);
		}
	}

	return (
		<div className="edit-employee__window">
			<div className="edit-employee__backdrop" />
			<div className="edit-employee__modal">
				<form onSubmit={handleSubmit} className="form employee-form">
					<div className="form-group">
						<input
							type="text"
							name="name"
							className={`edit-employee__name ${formErrors.name && 'invalid'}`}
							onChange={handleChange}
							value={formValues.name || ''}
						/>
					</div>
					<div className="errors-container">
						{formErrors.name && <span className="help inavild">{formErrors.name}</span>}
					</div>
					<div className="form-group">
						<input
							type="email"
							name="email"
							className="edit-employee__email"
							onChange={handleChange}
							value={formValues.email || ''}
						/>
					</div>
					<div className="form-group">
						<input
							type="text"
							name="payRate"
							className={`edit-employee__payRate ${formErrors.payRate && 'invalid'}`}
							onChange={handleChange}
							value={formValues.payRate || ''}
						/>
					</div>
					<div className="errors-container">
						{formErrors.payRate && <span className="help inavild">{formErrors.payRate}</span>}
					</div>
					<div className="edit-employee__buttons">
						<button className="btn edit-employee__submit" type="submit">
							Update
						</button>
						<button className="btn edit-employee__cancel" onClick={cancelEdit}>
							Cancel
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default EditEmployee;
