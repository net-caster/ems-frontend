import React, { useEffect, useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';

import { ScheduleContext } from '../../../contexts/ScheduleContext';
import { AuthContext } from '../../../contexts/AuthContext';

import Dates from '../../../utils/Dates';

const ScheduleWeek = () => {
	const [ schStates, setSchStates ] = useContext(ScheduleContext);
	const [ authState ] = useContext(AuthContext);
	const [ shifts, setShifts ] = useState([]);
	const [ filteredShifts, setFilteredShifts ] = useState([]);
	const [ weekAllWages, setWeekAllWages ] = useState(0);
	const [ weekAllHours, setWeekAllHours ] = useState(0);

	useEffect(() => {
		fetchShifts();
		document.title = 'Dashboard | Week Schedule';
	}, []);

	useEffect(
		() => {
			setFilteredShifts(shifts.filter((shift) => shift.week === schStates.week));
		},
		[ schStates.week, shifts, weekAllWages ]
	);

	useEffect(
		() => {
			let tempWages = 0;
			let tempHours = 0;
			filteredShifts.forEach((shift) => {
				tempWages = parseFloat(shift.shift_wage) + tempWages;
				tempHours = parseFloat(shift.shift_hours) + tempHours;
			});
			setWeekAllWages(parseFloat(Math.round(tempWages * 100) / 100).toFixed(2));
			setWeekAllHours(tempHours);
		},
		[ filteredShifts ]
	);

	const urlGet = 'https://react-ems.herokuapp.com/auth/get-shifts';
	const optionsGet = {
		credentials: 'include',
		userId: authState.userId
	};

	const fetchShifts = async () => {
		try {
			const result = await fetch(urlGet, optionsGet);
			const data = await result.json();

			setShifts(data.shifts);
		} catch (err) {
			console.log(err);
		}
	};

	const currWeek = () => {
		setSchStates({ ...schStates, week: Dates.week, year: Dates.year });
	};

	const nextWeek = () => {
		schStates.week === 52
			? setSchStates({ ...schStates, week: 1, year: schStates.year + 1 })
			: setSchStates({ ...schStates, week: schStates.week + 1 });
	};

	const previousWeek = () => {
		schStates.week === 1
			? setSchStates({ ...schStates, week: 52, year: schStates.year - 1 })
			: setSchStates({ ...schStates, week: schStates.week - 1 });
	};

	const renderedWeek = schStates.filteredWeek.map((day) => {
		if (day.d === Dates.day && day.y === Dates.year && day.m === Dates.month) {
			return (
				<li key={day.id} id={day.id} className="week-cell__block week-cell__today">
					<div className="shift-cell">
						<span className="shift-cell__title--current">
							{day.wd_name}, {day.d} - {day.m_name} {day.y}
						</span>
						<div className="shift-cell__before">
							<span className="shift-title">Morning</span>
							{shifts.map((shift) => {
								if (day.date === shift.date && parseInt(shift.shift_start.replace(/:[\d]+/, '')) < 12) {
									return (
										<div key={shift.id} className="shift-cell__before__info">
											<div className="before">
												<span className="before-name">{shift.name}:</span>
												<span className="before-hours">
													{shift.shift_start.replace(/:[\d]+$/, '')} -{' '}
													{shift.shift_end.replace(/:[\d]+$/, '')}
												</span>
												<NavLink to={`/auth/schedule/${shift.id}`}>
													<div className="shift-cell__edit--icon" />
												</NavLink>
											</div>
										</div>
									);
								}
							})}
						</div>
						<div className="shift-cell__after">
							<span className="shift-title">Afternoon</span>
							{shifts.map((shift) => {
								if (
									day.date === shift.date &&
									parseInt(shift.shift_start.replace(/:[\d]+/, '')) >= 12
								) {
									return (
										<div key={shift.id} className="shift-cell__after__info">
											<div className="after">
												<span className="after-name">{shift.name}:</span>
												<span className="after-hours">
													{shift.shift_start.replace(/:[\d]+$/, '')} -{' '}
													{shift.shift_end.replace(/:[\d]+$/, '')}
												</span>
												<NavLink to={`/auth/schedule/${shift.id}`}>
													<div className="shift-cell__edit--icon" />
												</NavLink>
											</div>
										</div>
									);
								}
							})}
						</div>
					</div>
				</li>
			);
		} else {
			return (
				<li key={day.id} id={day.id} className="week-cell__block">
					<div className="shift-cell">
						<span className="shift-cell__title">
							{day.wd_name}, {day.d} - {day.m_name} {day.y}
						</span>
						<div className="shift-cell__before">
							<span className="shift-title">Morning</span>
							{shifts.map((shift) => {
								if (day.date === shift.date && parseInt(shift.shift_start.replace(/:[\d]+/, '')) < 12) {
									return (
										<div key={shift.id} className="shift-cell__before__info">
											<div className="before">
												<span className="before-name">{shift.name}:</span>
												<span className="before-hours">
													{shift.shift_start.replace(/:[\d]+$/, '')} -{' '}
													{shift.shift_end.replace(/:[\d]+$/, '')}
												</span>
												<NavLink to={`/auth/schedule/${shift.id}`}>
													<div className="shift-cell__edit--icon" />
												</NavLink>
											</div>
										</div>
									);
								}
							})}
						</div>
						<div className="shift-cell__after">
							<span className="shift-title">Afternoon</span>
							{shifts.map((shift) => {
								if (
									day.date === shift.date &&
									parseInt(shift.shift_start.replace(/:[\d]+/, '')) >= 12
								) {
									return (
										<div key={shift.id} className="shift-cell__after__info">
											<div className="after">
												<span className="after-name">{shift.name}:</span>
												<span className="after-hours">
													{shift.shift_start.replace(/:[\d]+$/, '')} -{' '}
													{shift.shift_end.replace(/:[\d]+$/, '')}
												</span>
												<NavLink to={`/auth/schedule/${shift.id}`}>
													<div className="shift-cell__edit--icon" />
												</NavLink>
											</div>
										</div>
									);
								}
							})}
						</div>
					</div>
				</li>
			);
		}
	});

	return (
		<div className="week-schedule__container">
			<div className="week-schedule__buttons">
				<button onClick={previousWeek}>PREV</button>
				<button onClick={currWeek}>...</button>
				<button onClick={nextWeek}>NEXT</button>
			</div>
			<div className="week-schedule__info">
				<div className="week-schedule__info__cell">
					<span className="schedule-info__cell__title">Total Wages:</span>
					<span className="schedule-info__cell__value">&#163; {weekAllWages}</span>
				</div>
				<div className="week-schedule__info__cell">
					<span className="schedule-info__cell__title">Total Hours:</span>
					<span className="schedule-info__cell__value">{weekAllHours}</span>
				</div>
			</div>
			<div className="week-container">
				<ul className="week-container__row">{renderedWeek}</ul>
			</div>
		</div>
	);
};

export default ScheduleWeek;
