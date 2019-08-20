import React, { useContext, useState } from 'react';

import { FormContext } from '../contexts/FormContext';

import useForm from '../hooks/useForm';
import loginValidator from '../middleware/loginValidator';

const Login = () => {
	const { handleChange, handleSubmit, formValues, formErrors, setFormErrors } = useForm(submit, loginValidator);
	const [ formState, setFormState ] = useContext(FormContext);

	if (!formState.showLogin) return null;

	const toggleForm = () => {
		if (!formState.showSignup) {
			setFormState({
				...formState,
				showSignup: true,
				showLogin: false
			});
		}
	};

	const url = 'https://react-ems.herokuapp.com/auth/login';
	const options = {
		method: 'POST',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(formValues)
	};

	async function submit() {
		setFormState({ ...formState, showLoading: true });

		try {
			const result = await fetch(url, options);
			const data = await result.json();

			if (data.errorEmail) {
				setFormErrors({ ...formErrors, email: data.errorEmail });
				setFormState({ ...formState, showLoading: false });
				return;
			} else if (data.errorPassword) {
				setFormErrors({ ...formErrors, password: data.errorPassword });
				setFormState({ ...formState, showLoading: false });
				return;
			}

			localStorage.setItem('data', JSON.stringify(data));
			localStorage.setItem('redirect', true);

			location.reload();
		} catch (err) {
			console.log(err);
		}
	}

	return (
		<div className="form-box">
			<div className="form-container">
				<div className="btn btn-signup" onClick={toggleForm}>
					<span>Sign Up >></span>
				</div>
				<span className="form-heading">Welcome to EMS Technologies LTD.</span>
				<span className="form-title">Login</span>
				<form onSubmit={handleSubmit} className="form login-form" noValidate>
					<div className="form-group">
						<input
							type="email"
							name="email"
							className={`login-form__email ${formErrors.email && 'invalid'}`}
							placeholder="E-Mail Address"
							onChange={handleChange}
							value={formValues.email || ''}
						/>
					</div>
					{formErrors.email && <span className="help inavild">{formErrors.email}</span>}
					<div className="form-group">
						<input
							type="password"
							name="password"
							className={`login-form__password ${formErrors.password && 'invalid'}`}
							placeholder="Password"
							onChange={handleChange}
							value={formValues.password || ''}
						/>
					</div>
					{formErrors.password && <span className="help inavild">{formErrors.password}</span>}
					<button type="submit" className="btn btn-submit">
						Login
					</button>
				</form>
			</div>
		</div>
	);
};

export default Login;
