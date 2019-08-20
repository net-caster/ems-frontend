import React, { useEffect, useContext } from 'react';

import { ScheduleContext } from '../../../contexts/ScheduleContext';

import Dates from '../../../utils/Dates';

import '../../../assets/styles/scss/schedule.scss';

const ScheduleCalendar = () => {
	const [ schStates, setSchStates ] = useContext(ScheduleContext);

	useEffect(() => {
		document.title = 'Dashboard | Calendar';
	}, []);

	useEffect(
		() => {
			generateDays();
		},
		[ schStates.filteredMonth ]
	);

	const generateDays = () => {
		const firstDay = (year, month) => {
			return new Date(year, month, 0).getDay();
		};

		let days = [];
		let weeks = [];

		let date = 1;
		let int = 1;

		for (let i = 0; i < 6; i++) {
			let cell = <li />;
			for (let j = 0; j < 7; j++) {
				if (i === 0 && j < firstDay(schStates.year, schStates.month)) {
					cell = <li key={int++} className="table-cell__empty" />;
				} else if (date > schStates.filteredMonth.length) {
					break;
				} else {
					schStates.filteredMonth.forEach((dateObj, idx) => {
						if (dateObj.d === date) {
							cell = (
								<li key={dateObj.id} id={dateObj.id} className="table-cell__block">
									<span className="date-text">{dateObj.d}</span>
									<span className="day-text">{schStates.daysOfWeek[dateObj.wd]}</span>
								</li>
							);
						}
						if (
							date === Dates.day &&
							dateObj.d === Dates.day &&
							dateObj.y === Dates.year &&
							dateObj.m === Dates.month
						) {
							cell = (
								<li key={dateObj.id} id={dateObj.id} className="table-cell__block table-cell__today">
									<input type="hidden" value={dateObj.id} />
									<span className="curr-date__text">{dateObj.d}</span>
									<span className="curr-day__text">{schStates.daysOfWeek[dateObj.wd]}</span>
								</li>
							);
						}
					});
					date++;
				}
				days.push(cell);
			}

			while (days.length > 0) {
				weeks.push(days.slice(0, 7));
				days = days.slice(7);
			}
			setSchStates({ ...schStates, weeksOfMonth: weeks });
		}
	};

	const currMonth = () => {
		setSchStates({ ...schStates, month: new Date().getMonth(), year: new Date().getFullYear() });
	};

	const nextMonth = () => {
		schStates.month === 11
			? setSchStates({ ...schStates, month: 0, year: schStates.year + 1 })
			: setSchStates({ ...schStates, month: (schStates.month + 1) % 12 });
	};

	const previousMonth = () => {
		schStates.month === 0
			? setSchStates({ ...schStates, month: 11, year: schStates.year - 1 })
			: setSchStates({ ...schStates, month: schStates.month - 1 });
	};

	let int = 1;

	const renderWeeks = schStates.weeksOfMonth.map((week) => (
		<ul key={int++} className="table-row">
			{week}
		</ul>
	));

	return (
		<div className="schedule-container">
			<div className="schedule-header">
				<button onClick={previousMonth}>PREVIOUS</button>
				<h2 className="curr-date__picker" onClick={currMonth}>
					{schStates.months[schStates.month]} {schStates.year}
				</h2>
				<button onClick={nextMonth}>NEXT</button>
			</div>
			<div className="schedule-calendar">
				<div className="schedule-calendar__table">
					<div className="table-head">
						<ul className="table-head__days">
							<li>Monday</li>
							<li>Tuesday</li>
							<li>Wednesday</li>
							<li>Thursday</li>
							<li>Friday</li>
							<li>Saturday</li>
							<li>Sunday</li>
						</ul>
					</div>
					<div className="schedule-calendar__content">{renderWeeks}</div>
				</div>
			</div>
		</div>
	);
};

export default ScheduleCalendar;
