import React, { useContext } from 'react';

import { FormContext } from '../contexts/FormContext';

import '../assets/styles/scss/modal.scss';

const AlertError = (props) => {
	const [ formState, setFormState ] = useContext(FormContext);

	if (!formState.showAlertError) return null;

	return (
		<div className="alert-error__container">
			<div className="alert-error__backdrop" />
			<div className="alert-error__modal">
				<span className="alert-error__modal--text">{props.message}</span>
				<button className="alert-error__modal--btn" onClick={props.action}>
					OK
				</button>
			</div>
		</div>
	);
};

export default AlertError;
