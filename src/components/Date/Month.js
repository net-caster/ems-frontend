import React, { useContext, useEffect } from 'react';
import { DateContext } from '../../contexts/DateContext';

const Month = () => {
	const [ dateStates, setDateStates ] = useContext(DateContext);

	if (!dateStates.showMonth) return null;

	const toggleMonthsModal = () => {
		if (!dateStates.showMonthsModal) {
			setDateStates({ ...dateStates, showMonthsModal: true, showMonth: false });
		} else {
			setDateStates({ ...dateStates, showMonthsModal: false, showMonth: true });
		}
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

	const renderMonth = dateStates.monthsOfYear[dateStates.month].map((week) => <tr key={int++}>{week}</tr>);

	return (
		<div className="month-card">
			<div className="btn-form__inline">
				<div className="btn btn-previous" onClick={previousMonth}>
					<span>&lsaquo;&lsaquo; </span>
				</div>
				<div className="btn toggle-months__btn" onClick={toggleMonthsModal}>
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
						<th>Mon</th>
						<th>Tue</th>
						<th>Wed</th>
						<th>Thu</th>
						<th>Fri</th>
						<th>Sat</th>
						<th>Sun</th>
					</tr>
				</thead>
				<tbody className="calendar-content">{renderMonth}</tbody>
			</table>
		</div>
	);
};

export default Month;
