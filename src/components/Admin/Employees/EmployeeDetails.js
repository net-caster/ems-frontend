import React, { useEffect, useState, useContext } from 'react';
import { Redirect } from 'react-router-dom';

import { AuthContext } from '../../../contexts/AuthContext';
import { FormContext } from '../../../contexts/FormContext';

import ConfirmDeleteBox from './ConfirmDelete';
import Loading from '../../Loading';
import EditEmployee from '../Form/EditEmployee';

import '../../../assets/styles/scss/employees.scss';

import checkAuth from '../../../middleware/checkAuth';

const EmployeeDetails = ({ match }) => {
	const { checkSession } = checkAuth();
	const [ employee, setEmployee ] = useState({});
	const [ redirect, setRedirect ] = useState(false);
	const [ notFound, setNotFound ] = useState(false);
	const [ weekHours, setWeekHours ] = useState(0);
	const [ weekWage, setWeekWage ] = useState(0);

	const [ authState, setAuthState ] = useContext(AuthContext);
	const [ formState, setFormState ] = useContext(FormContext);

	useEffect(() => {
		fetchEmployee();
	}, []);

	useEffect(
		() => {
			checkSession();
		},
		[ location.pathname ]
	);

	useEffect(
		() => {
			document.title = `Details for ${employee.name}`;
		},
		[ employee ]
	);

	const getUrl = `https://react-ems.herokuapp.com/auth/get-employee/${match.params.employeeId}`;
	const getOptions = {
		credentials: 'include',
		userId: authState.userId
	};

	const deleteUrl = `https://react-ems.herokuapp.com/auth/delete-employee/${match.params.employeeId}`;
	const deleteOptions = {
		method: 'DELETE',
		credentials: 'include'
	};

	const fetchEmployee = async () => {
		setFormState({ ...formState, showLoading: true });

		try {
			const result = await fetch(getUrl, getOptions);
			const data = await result.json();

			if (data.notFound) {
				setTimeout(() => {
					setNotFound(data.notFound);
					setFormState({ ...formState, showLoading: false });
				}, 500);
				return;
			}

			if (data.employee) {
				let tempHours = 0;
				let tempWage = 0;
				setTimeout(() => {
					setEmployee(data.employee);
					data.workWeek.map((day) => (tempHours = parseFloat(day.shift_hours) + tempHours));
					data.workWeek.map((day) => (tempWage = parseFloat(day.shift_wage) + tempWage));
					setWeekHours(tempHours);
					setWeekWage(parseFloat(Math.round(tempWage * 100) / 100).toFixed(2));
					setFormState({ ...formState, showLoading: false });
				}, 500);
				return;
			}
		} catch (err) {
			console.log(err);
		}
	};

	const deleteEmployee = async () => {
		setFormState({ ...formState, showLoading: true });

		const result = await fetch(deleteUrl, deleteOptions);
		const data = await result.json();

		setTimeout(() => {
			setFormState({ ...formState, showLoading: false, showDeleteEmployee: false });
			setRedirect(data.redirect);
		}, 500);
	};

	const cancelDelete = () => {
		setFormState({ ...formState, showDeleteEmployee: false });
	};

	const showDeleteBox = () => {
		checkSession();
		setFormState({ ...formState, showDeleteEmployee: true });
	};

	const showEditBox = () => {
		checkSession();
		setFormState({ ...formState, showEditEmployee: true });
	};

	const renderedEmployee = (
		<div className="employee-details">
			<div className="employee-details__name">
				<h1>{employee.name}</h1>
			</div>
			<div className="employee-details__email">
				<span>{employee.email ? employee.email : 'No email provided.'}</span>
			</div>
			<div className="employee-details__payRate">
				<span>&#163; {employee.payRate}</span>
			</div>
			<div className="employee-details__shifts">
				<div className="details-shifts__group">
					<div className="details-shifts__cell">
						<span className="details-shifts__cell--title">Current week hours:</span>
					</div>
					<div className="details-shifts__cell">
						<span className="details-shifts__cell--hours">{weekHours}</span>
					</div>
				</div>
				<div className="details-shifts__group">
					<div className="details-shifts__cell">
						<span className="details-shifts__cell--title">Current week wage:</span>
					</div>
					<div className="details-shifts__cell">
						<span className="details-shifts__cell--wage">&#163; {weekWage}</span>
					</div>
				</div>
			</div>
			<div className="employee-details__buttons">
				<button className="employee-buttons__edit" onClick={showEditBox}>
					Update Employee
				</button>
				<button className="employee-buttons__delete" onClick={showDeleteBox}>
					Delete Employee
				</button>
			</div>
		</div>
	);

	return (
		<div className="employee-container">
			{redirect && <Redirect to="/auth/employees" />}
			{notFound && <Redirect to="/auth/not-found" />}
			<Loading />
			<EditEmployee employee={employee} />
			<ConfirmDeleteBox name={employee.name} delete={deleteEmployee} cancel={cancelDelete} />
			{employee.id && renderedEmployee}
		</div>
	);
};

export default EmployeeDetails;
