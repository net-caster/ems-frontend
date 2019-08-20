import React, { useContext, useEffect } from 'react';

import '../assets/styles/scss/nav.scss';

import { FormContext } from '../contexts/FormContext';
import { AuthContext } from '../contexts/AuthContext';

const MainNav = () => {
	return (
		<div className="nav-container">
			<nav className="main-nav">
				<ul className="main-nav__list">
					<div className="nav-list__home">
						<li>EMS Technologies LTD.</li>
					</div>
				</ul>
			</nav>
		</div>
	);
};

export default MainNav;
