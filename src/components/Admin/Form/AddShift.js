import React, { useContext, useEffect, useState } from 'react';

import '../../../assets/styles/scss/add-shift.scss';

import { AuthContext } from '../../../contexts/AuthContext';
import { ScheduleContext } from '../../../contexts/ScheduleContext';
import { FormContext } from '../../../contexts/FormContext';

import shiftValidator from '../../../middleware/shiftValidator';
import useTime from '../../../hooks/useTime';
import AlertError from '../../AlertError';
import AlertSuccess from '../../AlertSuccess';

const AddShift = () => {
	const {
		time,
		totalHours,
		totalPay,
		setTotalPay,
		hoursStartUp,
		hoursStartDown,
		hoursEndUp,
		hoursEndDown,
		minutesStartUp,
		minutesStartDown,
		minutesEndUp,
		minutesEndDown
	} = useTime();
	const [ authState, setAuthState ] = useContext(AuthContext);
	const [ schStates, setSchStates ] = useContext(ScheduleContext);
	const [ formState, setFormState ] = useContext(FormContext);
	const [ employees, setEmployees ] = useState([]);
	const [ selEmp, setSelEmp ] = useState([]);

	const [ formValues, setFormValues ] = useState({});
	const [ formErrors, setFormErrors ] = useState({});
	const [ isSubmitting, setIsSubmitting ] = useState(false);
	const [ errMsg, setErrMsg ] = useState('');
	const [ msg, setMsg ] = useState('');

	useEffect(() => {
		fetchEmployees();
		document.title = 'Dashboard | Add Shift';
	}, []);

	useEffect(
		() => {
			totalPay;
		},
		[ selEmp, totalHours, time, schStates ]
	);

	useEffect(
		() => {
			if (Object.keys(formErrors).length === 0 && isSubmitting) {
				submitShift();
			}
		},
		[ formErrors ]
	);

	useEffect(
		() => {
			setFormValues({
				...formValues,
				employeeId: selEmp.map((emp) => emp.id)[0],
				name: selEmp.map((emp) => emp.name)[0],
				payRate: selEmp.map((emp) => emp.payRate)[0],
				userId: authState.userId,
				date: schStates.filteredDay.map((day) => day.date)[0],
				dateId: schStates.filteredDay.map((day) => day.id)[0],
				weekNum: schStates.filteredDay.map((day) => day.w)[0],
				hourStart: time.hourStart.toString(),
				minutesStart: time.minutesStart.toString(),
				hourEnd: time.hourEnd.toString(),
				minutesEnd: time.minutesEnd.toString(),
				shiftHours: totalHours,
				shiftWage: parseFloat(totalPay[0]),
				year: schStates.filteredDay.map((day) => day.y)[0],
				month: schStates.filteredDay.map((day) => day.m)[0],
				day: schStates.filteredDay.map((day) => day.d)[0],
				weekDay: schStates.filteredDay.map((day) => day.wd)[0]
			});
		},
		[ time, totalPay, schStates.filteredDay ]
	);

	useEffect(
		() => {
			setTotalPay(selEmp.map((emp) => parseFloat(Math.round(emp.payRate * totalHours * 100) / 100).toFixed(2)));
		},
		[ selEmp, totalHours ]
	);

	const nextDate = () => {
		setSchStates({ ...schStates, day: schStates.day + 1 });

		schStates.day === schStates.filteredMonth.length &&
			setSchStates({ ...schStates, month: schStates.month + 1, day: 1 });
	};

	const previousDate = () => {
		setSchStates({ ...schStates, day: schStates.day - 1 });

		schStates.day === 1 &&
			setSchStates({
				...schStates,
				month: schStates.month - 1,
				day: new Date(schStates.year, schStates.month, 0).getDate()
			});
	};

	const urlGet = 'https://react-ems.herokuapp.com/auth/get-employees';
	const optionsGet = {
		credentials: 'include',
		userId: authState.userId
	};

	const fetchEmployees = async () => {
		try {
			const response = await fetch(urlGet, optionsGet);

			const data = await response.json();

			setEmployees(data.employees);
		} catch (err) {
			console.log(err);
		}
	};

	const urlPost = 'https://react-ems.herokuapp.com/auth/add-shift';
	const optionsPost = {
		method: 'POST',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(formValues),
		userId: authState.userId
	};

	const submitShift = async () => {
		try {
			const result = await fetch(urlPost, optionsPost);
			const data = await result.json();

			if (data.errMsg) {
				setFormState({ ...formState, showAlertError: true });
				setErrMsg(data.errMsg);
				return;
			}
			if (data.redirect && data.msg) {
				setFormState({ ...formState, showAlertSuccess: true });
				setMsg(data.msg);
				return;
			}
		} catch (err) {
			console.log(err);
		}
	};

	const handleSubmit = (event) => {
		event.preventDefault();

		setFormErrors(shiftValidator(formValues));
		setIsSubmitting(true);
	};

	const changeHandler = (event) => {
		let { name, value } = event.target;
		setSchStates({ ...schStates, [name]: parseInt(value) });
	};

	const selectEmployee = (event) => {
		let { value } = event.target;
		setSelEmp(employees.filter((employee) => employee.name === value));
	};

	const jumpToCurrDate = () => {
		setSchStates({
			...schStates,
			day: new Date().getDate(),
			month: new Date().getMonth(),
			year: new Date().getFullYear()
		});
	};

	const closeAlert = () => {
		setFormState({ ...formState, showAlertError: false, showAlertSuccess: false });
	};

	const shiftBody = (
		<div className="add-shift__box">
			<div className="shift-employees__list">
				<input
					data-id={selEmp.map((el) => el.id)}
					className={`add-shift__name ${formErrors.employee && 'invalid'}`}
					onChange={selectEmployee}
					list="employees-list"
				/>
				<datalist id="employees-list">
					{employees.map((employee) => (
						<option key={employee.id} data-id={employee.id} value={employee.name}>
							{employee.name} - &#163;{employee.payRate}
						</option>
					))}
				</datalist>
				<div className="errors-container">
					{formErrors.employee && <span className="help inavild">{formErrors.employee}</span>}
				</div>
			</div>
			<div className="time-date">
				<div className="date-box">
					<div className="date-box__picker">
						<div className="date-box__picker--options">
							<select
								name="year"
								className="date-box__select years"
								value={schStates.year}
								onChange={changeHandler}
							>
								<option value={schStates.year}>{schStates.year}</option>
							</select>
							<select
								name="month"
								className="date-box__select months"
								value={schStates.month}
								onChange={changeHandler}
							>
								{schStates.months.map((month, idx) => (
									<option key={idx} value={idx}>
										{month}
									</option>
								))}
							</select>
							<select
								name="day"
								className="date-box__select days"
								value={schStates.day}
								onChange={changeHandler}
							>
								{schStates.filteredMonth.map((date, idx) => (
									<option key={idx} value={date.d}>
										{date.d}
									</option>
								))}
							</select>
						</div>
						<div className="date-box__picker--controls">
							<div className="prev-date__btn" onClick={previousDate} />
							<div className="curr-date__btn" onClick={jumpToCurrDate} />
							<div className="next-date__btn" onClick={nextDate} />
						</div>
					</div>
					<div className="date-box__info">
						<div className="info-box__group">
							<div className="info-box__cells">
								<div className="info-cell">
									<span className="info-cell__prop info-cell__prop__date">Date:</span>
								</div>
								<div className="info-cell">
									<span className="info-cell__value info-cell__value__date">
										{schStates.filteredDay.map((day) => day.date)}
									</span>
								</div>
							</div>
							<div className="info-box__cells">
								<div className="info-cell">
									<span className="info-cell__prop info-cell__prop__year">Year:</span>
								</div>
								<div className="info-cell">
									<span className="info-cell__value info-cell__value__year">
										{schStates.filteredDay.map((day) => day.y)}
									</span>
								</div>
							</div>
							<div className="info-box__cells">
								<div className="info-cell">
									<span className="info-cell__prop info-cell__prop__month">Month:</span>
								</div>
								<div className="info-cell">
									<span className="info-cell__value info-cell__value__month">
										{schStates.filteredDay.map((day) => day.m_name)}
									</span>
								</div>
							</div>
							<div className="info-box__cells">
								<div className="info-cell">
									<span className="info-cell__prop info-cell__prop__day">Day:</span>
								</div>
								<div className="info-cell">
									<span className="info-cell__value info-cell__value__day">
										{schStates.filteredDay.map((day) => day.wd_name)},&nbsp;
										{schStates.filteredDay.map((day) => day.d)}
									</span>
								</div>
							</div>
							<div className="info-box__cells">
								<div className="info-cell">
									<span className="info-cell__prop info-cell__prop__week">Week:</span>
								</div>
								<div className="info-cell">
									<span className="info-cell__value info-cell__value__week">
										{schStates.filteredDay.map((day) => day.w)}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="time-box">
					<div className="time-box__start">
						<div className="time-box__hours time-box__inputs">
							<div className="time-box__hours--up" onClick={hoursStartUp}>
								^
							</div>
							<input name="hour_start" type="text" value={time.hourStart} readOnly />
							<div className="time-box__hours--down" onClick={hoursStartDown}>
								^
							</div>
						</div>
						<span className="time-seperator">:</span>
						<div className="time-box__minutes time-box__inputs">
							<div className="time-box__minutes--up" onClick={minutesStartUp}>
								^
							</div>
							<input name="minutes_start" type="text" value={time.minutesStart} readOnly />
							<div className="time-box__minutes--down" onClick={minutesStartDown}>
								^
							</div>
						</div>
					</div>
					<div className="time-box__end">
						<div className="time-box__hours time-box__inputs">
							<div className="time-box__hours--up" onClick={hoursEndUp}>
								^
							</div>
							<input name="hour_end" type="text" value={time.hourEnd} readOnly />
							<div className="time-box__hours--down" onClick={hoursEndDown}>
								^
							</div>
						</div>
						<span className="time-seperator">:</span>
						<div className="time-box__minutes time-box__inputs">
							<div className="time-box__minutes--up" onClick={minutesEndUp}>
								^
							</div>
							<input name="minutes_end" type="text" value={time.minutesEnd} readOnly />
							<div className="time-box__minutes--down" onClick={minutesEndDown}>
								^
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="shift-info">
				<div className="shift-hours">
					<span className="shift-hours__title">
						Total Hours:{' '}
						<input
							className={`${formErrors.shiftHours ? 'invalid-inputs' : 'shift-hours__count'}`}
							name="shift_hours"
							value={totalHours}
							readOnly
						/>
					</span>
					<div className="errors-container">
						{formErrors.shiftHours && <span className="help inavild">{formErrors.shiftHours}</span>}
					</div>
				</div>
				<div className="shift-wage">
					<span className="shift-wage__title">
						Total Pay: &nbsp; &#163;<input
							className="shift-wage__count"
							name="shift_wage"
							value={totalPay}
							readOnly
						/>
					</span>
				</div>
			</div>
		</div>
	);

	return (
		<div className="add-shift__container">
			{errMsg && <AlertError message={errMsg} action={closeAlert} />}
			{msg && <AlertSuccess message={msg} action={closeAlert} />}
			<form className="add-shift__form" onSubmit={handleSubmit}>
				{shiftBody}
				<button type="submit" className="add-shift__form--submit form-submit__btn">
					Add Shift
				</button>
			</form>
		</div>
	);
};

export default AddShift;
