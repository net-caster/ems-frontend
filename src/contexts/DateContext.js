import React, { useState, createContext, useEffect } from 'react';

export const DateContext = createContext();

export const DateProvider = (props) => {
	const today = new Date();
	const currDay = today.getDate();
	const currYear = today.getFullYear();
	const currMonth = today.getMonth();

	Date.prototype.getWeekNumber = (year, month, day) => {
		let d = new Date(Date.UTC(year, month, day));
		let dayNum = d.getUTCDay() || 7;
		d.setUTCDate(d.getUTCDate() + 4 - dayNum);
		let yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
		return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
	};

	const [ dateStates, setDateStates ] = useState({
		day: currDay,
		year: currYear,
		month: currMonth,
		dayObject: {},
		showMonth: true,
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
		monthsOfYear: [ [], [], [], [], [], [], [], [], [], [], [], [] ],
		daysOfWeek: [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ],
		showDateModal: false,
		showMonthsModal: false,
		showErrorModal: false
	});

	let monthsOfYear = [];

	/* const checkDateObj = (obj) => {
		for (let key in obj) {
			let content = obj[key];
			if (content === null || content === NaN || content === undefined || content === '--') {
				setStates({ ...states, showErrorModal: true, showMonth: false });
			} else {
				setStates({
					...states,
					showDateModal: true,
					showMonth: false
				});
			}
		}
	};

	const clickHandle = (e) => {
		const dateId = e.target.id;
		const year = dateId.slice(0, 4);
		const month = dateId.slice(4, 6);
		const day = dateId.slice(6);

		const selectedDay = {
			dateId: parseInt(dateId),
			date: `${year}-${month}-${day}`,
			year: parseInt(year),
			month: parseInt(month),
			day: parseInt(day),
			week: new Date().getWeekNumber(year, month - 1, day),
			weekDay: new Date(year, month - 1, day - 1).getDay() + 1,
			quarter: Math.floor(((new Date(year, month, day).getMonth() + 11) / 3) % 4) + 1,
			weekDayName: states.daysOfWeek[new Date(year, month - 1, day).getDay()],
			monthName: states.months[month - 1]
		};

		setStates((states.dayObject = selectedDay));
		checkDateObj(states.dayObject);

		console.log(states.dayObject);

		return selectedDay;
	}; */

	const generateYear = () => {
		const firstDay = (year, month) => {
			return new Date(year, month, 0).getDay();
		};

		const daysInMonth = (year, month) => {
			return 32 - new Date(year, month, 32).getDate();
		};

		const generateDays = (year, month) => {
			let days = [];
			let weeks = [];

			let date = 1;
			let int = 1;

			for (let i = 0; i < 6; i++) {
				let cell = <td />;
				for (let j = 0; j < 7; j++) {
					if (i === 0 && j < firstDay(year, month)) {
						cell = <td key={int++} className="empty-block" />;
					} else if (date > daysInMonth(year, month)) {
						break;
					} else {
						const dateId = `${year}${month + 1 < 10 ? '0' + (month + 1) : month + 1}${date < 10
							? '0' + date
							: date}`;
						cell = (
							<td key={dateId} id={dateId} className="day-block">
								<span className="day-text">{date}</span>
							</td>
						);
						if (date === currDay && year === currYear && month === currMonth) {
							cell = (
								<td key={dateId} id={dateId} className="day-block curr-day">
									<span className="day-text">{date}</span>
								</td>
							);
						}
						date++;
					}
					days.push(cell);
				}
			}

			while (days.length > 0) {
				weeks.push(days.slice(0, 7));
				days = days.slice(7);
			}
			return weeks;
		};

		for (let x = 0; x < 12; x++) {
			monthsOfYear.push(generateDays(dateStates.year, x));
		}
	};

	const dependencies = [
		dateStates.month,
		dateStates.day,
		dateStates.year,
		dateStates.dayObject,
		dateStates.showDateModal,
		dateStates.showErrorModal,
		dateStates.showMonth,
		dateStates.showMonthsModal
	];

	useEffect(() => {
		generateYear();
		setDateStates({ ...dateStates, monthsOfYear: monthsOfYear });
	}, dependencies);

	return <DateContext.Provider value={[ dateStates, setDateStates ]}>{props.children}</DateContext.Provider>;
};
