import React, { useState, createContext, useEffect } from 'react';

import Dates from '../utils/Dates';

export const ScheduleContext = createContext();

export const ScheduleProvider = (props) => {
	const [ schStates, setSchStates ] = useState({
		day: Dates.day,
		year: Dates.year,
		month: Dates.month,
		week: Dates.week,
		months: [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December'
		],
		daysOfWeek: [ 'SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT' ],
		filteredMonth: [],
		filteredWeek: [],
		filteredDay: [],
		weeksOfMonth: [],
		dateRange: []
	});

	useEffect(() => {
		fetchDateRange();
	}, []);

	useEffect(
		() => {
			setSchStates({
				...schStates,
				filteredMonth: schStates.dateRange.filter(
					(dates) => dates.m === schStates.month && dates.y === schStates.year
				),
				filteredWeek: schStates.dateRange.filter(
					(dates) => dates.w === schStates.week && dates.wy === schStates.year
				),
				filteredDay: schStates.dateRange.filter(
					(dates) => dates.d === schStates.day && dates.m === schStates.month && dates.y === schStates.year
				)
			});
		},
		[ schStates.month, schStates.day, schStates.year, schStates.dateRange, schStates.week ]
	);

	const urlDateRange = 'https://react-ems.herokuapp.com/auth/get-schedule';
	const optionsDateRange = {
		credentials: 'include'
	};

	const fetchDateRange = async () => {
		try {
			const result = await fetch(urlDateRange, optionsDateRange);
			const data = await result.json();

			setSchStates({ ...schStates, dateRange: data.dates });
		} catch (err) {
			console.log(err);
		}
	};

	return <ScheduleContext.Provider value={[ schStates, setSchStates ]}>{props.children}</ScheduleContext.Provider>;
};
