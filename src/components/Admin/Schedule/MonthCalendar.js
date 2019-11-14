import React, { useContext, useEffect, useState } from 'react';

import { DateContext } from '../../../contexts/DateContext';
import { FormContext } from '../../../contexts/FormContext';

import '../../../assets/styles/scss/calendar.scss';

import ShowShifts from '../Form/ShowShifts';
import useShifts from '../../../hooks/useShifts';

const MonthCalendar = () => {
	const [dateStates, setDateStates, queries] = useContext(DateContext);
	const [formState, setFormState] = useContext(FormContext);

	const { shifts } = useShifts();
	const [selectedShifts, setSelectedShifts] = useState([]);

	useEffect(() => {
		document.title = 'Dashboard | Calendar';
	}, []);

	useEffect(() => {
		{ queries.clicked && showShiftsModal() }
	}, [queries]);

	const showShiftsModal = () => {
		let selShifts = shifts.filter(shift => {
			if (shift.year === queries.year && shift.month === queries.month && shift.day === queries.day) {
				return shift;
			}
		});
		setSelectedShifts(selShifts);

		setFormState({ ...formState, showLoading: true });

		setTimeout(() => {
			setFormState({ ...formState, showShiftsModal: true, showLoading: false });
		}, 500);
	};

	const resetDate = () => {
		setDateStates({ ...dateStates, year: new Date().getFullYear(), month: new Date().getMonth() });
	};

	const nextMonth = () => {
		dateStates.month === 11
			? setDateStates({ ...dateStates, year: dateStates.year++ })
			: setDateStates({ ...dateStates, year: dateStates.year });
		setDateStates({ ...dateStates, month: (dateStates.month + 1) % 12 });
	};

	const previousMonth = () => {
		dateStates.month === 0
			? setDateStates({ ...dateStates, year: dateStates.year-- })
			: setDateStates({ ...dateStates, year: dateStates.year });
		dateStates.month === 0
			? setDateStates({ ...dateStates, month: 11 })
			: setDateStates({ ...dateStates, month: dateStates.month - 1 });
	};

	let int = 1;

	const renderMonth = dateStates.monthOfYear.map((week) => <tr key={int++}>{week}</tr>);

	return (
		<div className="month-container">
			<ShowShifts shifts={selectedShifts} />
			<div className="month-card">
				<div className="btn-form__inline">
					<div className="btn btn-previous" onClick={previousMonth}>
						<span>&lsaquo;&lsaquo; </span>
					</div>
					<div className="btn reset-date__btn" onClick={resetDate}>
						<span className="btn-months">{dateStates.months[dateStates.month]}</span>
						<span className="btn-years">{dateStates.year}</span>
					</div>
					<div className="btn btn-next" onClick={nextMonth}>
						<span>&rsaquo;&rsaquo;</span>
					</div>
				</div>
				<table className="table">
					<thead>
						<tr>
							<th>Monday</th>
							<th>Tuesday</th>
							<th>Wednesday</th>
							<th>Thursday</th>
							<th>Friday</th>
							<th>Saturday</th>
							<th>Sunday</th>
						</tr>
					</thead>
					<tbody className="calendar-content">{renderMonth}</tbody>
				</table>
			</div>
		</div>
	);
};

export default MonthCalendar;
