import React, { useContext } from 'react';

import { AuthContext } from '../contexts/AuthContext';
import { FormContext } from '../contexts/FormContext';

const checkAuth = () => {
	const [ authState, setAuthState ] = useContext(AuthContext);
	const [ formState, setFormState ] = useContext(FormContext);

	const checkSession = () => {
		const currentTime = new Date().getTime() / 1000;

		if (authState.expiryDate && Math.floor(currentTime) > authState.expiryDate) {
			setAuthState({ ...authState, isAuth: false });

			setFormState({ ...formState, showLoading: true });

			setTimeout(() => {
				localStorage.removeItem('data');
				location.href = '/';
			}, 1000);
		}
	};

	return {
		checkSession
	};
};

export default checkAuth;
