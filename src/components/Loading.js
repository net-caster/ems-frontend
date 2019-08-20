import React, { useContext, useState } from 'react';
import { FormContext } from '../contexts/FormContext';

const Loading = () => {
	const [ formState, setFormState ] = useContext(FormContext);

	if (!formState.showLoading) return null;

	return (
		<div className="form-spinner">
			<div className="form-spinner__backdrop">
				<div className="form-spinner__content" />
			</div>
		</div>
	);
};

export default Loading;
