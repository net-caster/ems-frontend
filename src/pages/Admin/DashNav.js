import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';

import checkAuth from '../../middleware/checkAuth';

const DashNav = () => {
	const { checkSession } = checkAuth();

	useEffect(
		() => {
			checkSession();
		},
		[ location.pathname ]
	);

	return (
		<div className="nav">
			<div className="nav-list">
				<NavLink
					onClick={checkSession}
					activeClassName="curr-link"
					className="nav__link nav__profile"
					to="/auth/profile"
				>
					<span>Profile</span>
				</NavLink>
				<NavLink
					onClick={checkSession}
					activeClassName="curr-link"
					className="nav__link nav__employees"
					to="/auth/employees"
				>
					<span>Employees</span>
				</NavLink>
				<NavLink
					onClick={checkSession}
					activeClassName="curr-link"
					className="nav__link nav__addEmployee"
					to="/auth/add-employee"
				>
					<span>Add Employee</span>
				</NavLink>
				<NavLink
					onClick={checkSession}
					activeClassName="curr-link"
					className="nav__link nav__schedule"
					to={`/auth/schedule`}
				>
					<span>Schedule</span>
				</NavLink>
				<NavLink
					onClick={checkSession}
					activeClassName="curr-link"
					className="nav__link nav__addShifts"
					to="/auth/add-shift"
				>
					<span>Add Shift</span>
				</NavLink>
				<NavLink
					onClick={checkSession}
					activeClassName="curr-link"
					className="nav__link nav__calendar"
					to="/auth/calendar"
				>
					<span>Calendar</span>
				</NavLink>
			</div>
		</div>
	);
};

export default DashNav;
