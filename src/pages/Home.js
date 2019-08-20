import React, { useEffect, useContext } from 'react';

import '../assets/styles/scss/form.scss';

import Login from '../components/Login';
import SignUp from '../components/SignUp';
import Loading from '../components/Loading';

import { AuthContext } from '../contexts/AuthContext';

const Home = () => {
	const [ authState, setAuthState ] = useContext(AuthContext);

	useEffect(() => {
		localStorage.setItem('redirect', true);
		document.title = 'EMS Technologies LTD.';
	}, []);

	return (
		<div className="home-container">
			<Loading />
			<Login />
			<SignUp />
		</div>
	);
};

export default Home;
