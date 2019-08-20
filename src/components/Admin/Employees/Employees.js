import React, { useEffect, useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';

import '../../../assets/styles/scss/employees.scss';

import { AuthContext } from '../../../contexts/AuthContext';

const Employees = () => {
	const [ authState, setAuthState ] = useContext(AuthContext);
	const [ employees, setEmployees ] = useState([]);
	const [ searchValue, setSearchValue ] = useState('');
	const [ filteredEmployees, setFilteredEmployees ] = useState([]);

	useEffect(() => {
		document.title = 'Dashboard | Employees';
		fetchEmployees();
	}, []);

	useEffect(
		() => {
			setFilteredEmployees(
				employees.filter((employee) => employee.name.toLowerCase().indexOf(searchValue) !== -1)
			);
		},
		[ searchValue ]
	);

	useEffect(
		() => {
			setFilteredEmployees(employees);
		},
		[ employees ]
	);

	const updateSearch = (event) => {
		setSearchValue(event.target.value.toLowerCase());
	};

	const url = 'https://react-ems.herokuapp.com/auth/get-employees';
	const options = {
		credentials: 'include',
		userId: authState.userId
	};

	const fetchEmployees = async () => {
		try {
			const response = await fetch(url, options);

			const data = await response.json();

			setEmployees(data.employees);
		} catch (err) {
			console.log(err);
		}
	};

	const employeeCards = filteredEmployees.map((employee) => (
		<NavLink key={employee.id} className="employee-details__link" to={`/auth/employees/${employee.id}`}>
			<div className="employee-card">
				<p className="employee-card__name">{employee.name}</p>
				<p className="employee-card__email">{employee.email ? employee.email : 'No email provided.'}</p>
				<p className="employee-card__payRate">&#163; {employee.payRate}</p>
			</div>
		</NavLink>
	));

	return (
		<div className="employees-container">
			<div className="employee-search">
				<input type="text" className="employee-search__box" value={searchValue} onChange={updateSearch} />
			</div>
			<div className="scroll-container__employees">
				<div className="employee-cards">{employeeCards}</div>
			</div>
		</div>
	);
};

export default Employees;
