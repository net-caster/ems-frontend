import React, { useContext, useEffect } from 'react';

import useForm from '../../../hooks/useForm';
import editUserValidator from '../../../middleware/editUserValidator';

import { FormContext } from '../../../contexts/FormContext';
import { AuthContext } from '../../../contexts/AuthContext';

const EditUser = (props) => {
	const { handleChange, handleSubmit, formValues, setFormValues, formErrors, setFormErrors } = useForm(
		submitEdit,
		editUserValidator
	);
	const [ formState, setFormState ] = useContext(FormContext);
	const [ authState, setAuthState ] = useContext(AuthContext);

	useEffect(
		() => {
			setFormValues(props.user);
		},
		[ props.user ]
	);

	if (!formState.showEditUser) return null;

	const urlEdit = `https://react-ems.herokuapp.com/auth/edit-user`;
	const optionsEdit = {
		method: 'PUT',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(formValues)
	};

	const cancelEdit = () => {
		setFormState({ ...formState, showEditUser: false });
	};

	async function submitEdit() {
		setFormState({ ...formState, showLoading: true });

		try {
			const result = await fetch(urlEdit, optionsEdit);
			const data = await result.json();

			if (data.errorPassword) {
				setFormErrors({ ...formErrors, password: data.errorPassword });
				setFormState({ ...formState, showLoading: false });
				return;
			}

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
		<div className="edit-user__window">
			<div className="edit-user__backdrop" />
			<div className="edit-user__modal">
				<form onSubmit={handleSubmit} className="form user-form">
					<div className="form-group">
						<input
							type="text"
							name="name"
							placeholder="Enter your name..."
							className={`edit-user__name ${formErrors.name && 'invalid'}`}
							onChange={handleChange}
							value={formValues.name || ''}
						/>
					</div>
					<div className="errors-container">
						{formErrors.name && <span className="help inavild">{formErrors.name}</span>}
					</div>
					<div className="form-group">
						<input
							type="text"
							name="company"
							placeholder="Enter company name..."
							className={`edit-user__company ${formErrors.company && 'invalid'}`}
							onChange={handleChange}
							value={formValues.company || ''}
						/>
					</div>
					<div className="errors-container">
						{formErrors.company && <span className="help inavild">{formErrors.company}</span>}
					</div>
					<div className="form-group">
						<input
							type="email"
							name="email"
							placeholder="Enter your email..."
							className={`edit-user__email ${formErrors.email && 'invalid'}`}
							onChange={handleChange}
							value={formValues.email || ''}
						/>
					</div>
					<div className="errors-container">
						{formErrors.email && <span className="help inavild">{formErrors.email}</span>}
					</div>
					<div className="form-group">
						<input
							type="password"
							name="password"
							placeholder="Enter your password..."
							className={`edit-user__password ${formErrors.password && 'invalid'}`}
							onChange={handleChange}
							value={formValues.password || ''}
						/>
					</div>
					<div className="errors-container">
						{formErrors.password && <span className="help inavild">{formErrors.password}</span>}
					</div>
					<div className="form-group">
						<span className="password-label">Change Password</span>
						<input
							type="password"
							name="newPassword"
							placeholder="Enter your new password..."
							className={`edit-user__newPassword ${formErrors.newPassword && 'invalid'}`}
							onChange={handleChange}
							value={formValues.newPassword || ''}
						/>
					</div>
					<div className="errors-container">
						{formErrors.newPassword && <span className="help inavild">{formErrors.newPassword}</span>}
					</div>
					<div className="form-group">
						<input
							type="password"
							name="confirmNewPassword"
							placeholder="Re-enter your new password..."
							className={`edit-user__confirmNewPassword ${formErrors.confirmNewPassword && 'invalid'}`}
							onChange={handleChange}
							value={formValues.confirmNewPassword || ''}
						/>
					</div>
					<div className="errors-container">
						{formErrors.confirmNewPassword && (
							<span className="help inavild">{formErrors.confirmNewPassword}</span>
						)}
					</div>
					<div className="edit-user__buttons">
						<button className="btn edit-user__submit" type="submit">
							Update
						</button>
						<div className="btn edit-user__cancel" onClick={cancelEdit}>
							Cancel
						</div>
					</div>
				</form>
			</div>
		</div>
	);
};

export default EditUser;
