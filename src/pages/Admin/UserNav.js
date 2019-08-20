import React, { useContext } from 'react';

import '../../assets/styles/scss/nav.scss';

import { FormContext } from '../../contexts/FormContext';
import { AuthContext } from '../../contexts/AuthContext';

const UserNav = () => {
	const [ formState, setFormState ] = useContext(FormContext);
	const [ authState, setAuthState ] = useContext(AuthContext);

	const logOut = () => {
		setFormState({ ...formState, showLoading: true });

		setTimeout(() => {
			location.reload();

			localStorage.removeItem('data');

			setAuthState({ ...authState, isAuth: false });
		}, 1000);

		setFormState({ ...formState, showLoading: false });
	};

	const logOutButton = (
		<li className="nav-list__logout" onClick={logOut}>
			Log Out
		</li>
	);

	return (
		<div className="nav-container">
			<nav className="main-nav">
				<ul className="main-nav__list">
					<div className="nav-list__home">
						<li>EMS Technologies LTD.</li>
					</div>
					{authState.isAuth && logOutButton}
				</ul>
			</nav>
		</div>
	);
};

export default UserNav;
