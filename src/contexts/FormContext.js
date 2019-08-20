import React, { useState, createContext } from 'react';

export const FormContext = createContext();

export const FormProvider = (props) => {
	const [ formState, setFormState ] = useState({
		showLogin: true,
		showSignup: false,
		showLoading: false,
		showDeleteEmployee: false,
		showEditEmployee: false,
		showDeleteAccount: false,
		showEditUser: false,
		showAlertError: false,
		showAlertSuccess: false,
		showComponent: false
	});

	return <FormContext.Provider value={[ formState, setFormState ]}>{props.children}</FormContext.Provider>;
};
