import React, { useContext } from 'react';

import { DateContext } from '../../contexts/DateContext';

import '../../assets/styles/scss/monthsModal.scss';

const MonthModal = () => {
	const [ states, setStates ] = useContext(DateContext);

	if (!states.showMonthsModal) return null;

	const previousYear = () => {
		setStates({ ...states, year: states.year - 1 });
	};

	const nextYear = () => {
		setStates({ ...states, year: states.year + 1 });
	};

	const pickMonth = (e) => {
		setStates({
			...states,
			month: parseInt(e.target.attributes.monthindex.value),
			showMonthsModal: false,
			showMonth: true
		});
	};

	let int = 1000;

	let renderMonths = states.monthsOfYear.map((month, i) => {
		return (
			<div key={int++} className="month-cell">
				<span className="months-modal__heading">
					{states.months[i]} {states.year}
				</span>
				<div className="month-cell__layer" monthindex={i} onClick={(e) => pickMonth(e)} />
				<table className="full-calendar__table">
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
					<tbody className="full-calendar__content">
						{states.monthsOfYear[i].map((week) => <tr key={int++}>{week}</tr>)}
					</tbody>
				</table>
			</div>
		);
	});

	return (
		<div className="months-modal">
			<div className="previous-year" onClick={previousYear}>
				<span>&lsaquo;&lsaquo; {states.year - 1}</span>
			</div>
			<div className="months-table">{renderMonths}</div>
			<div className="next-year" onClick={nextYear}>
				<span>{states.year + 1} &rsaquo;&rsaquo;</span>
			</div>
		</div>
	);
};

export default MonthModal;
