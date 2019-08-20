import React, { useContext } from 'react';

import { FormContext } from '../contexts/FormContext';

import '../assets/styles/scss/modal.scss';

const AlertSuccess = (props) => {
	const [ formState, setFormState ] = useContext(FormContext);

	if (!formState.showAlertSuccess) return null;

	return (
		<div className="alert-success__container">
			<div className="alert-success__backdrop" />
			<div className="alert-success__modal">
				<span className="alert-success__modal--text">{props.message}</span>
				<button className="alert-success__modal--btn" onClick={props.action}>
					OK
				</button>
			</div>
		</div>
	);
};

export default AlertSuccess;
