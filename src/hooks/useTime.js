import React, { useState, useEffect } from 'react';

const useTime = () => {
	const [ time, setTime ] = useState({
		hourStart: '09',
		hourEnd: '17',
		minutesStart: '00',
		minutesEnd: '00'
	});
	const [ totalHours, setTotalHours ] = useState(0);
	const [ totalPay, setTotalPay ] = useState(0);

	useEffect(
		() => {
			getShiftHours(time.hourStart, time.hourEnd, time.minutesStart, time.minutesEnd);
		},
		[ time ]
	);

	const getShiftHours = (hourStart, hourEnd, minutesStart, minutesEnd) => {
		let minsStart;
		let minsEnd;

		switch (parseInt(minutesStart)) {
			case 15:
				minsStart = 0.25;
				break;
			case 30:
				minsStart = 0.5;
				break;
			case 45:
				minsStart = 0.75;
				break;
			default:
				minsStart = 0;
				break;
		}

		switch (parseInt(minutesEnd)) {
			case 15:
				minsEnd = 0.25;
				break;
			case 30:
				minsEnd = 0.5;
				break;
			case 45:
				minsEnd = 0.75;
				break;
			default:
				minsEnd = 0;
				break;
		}

		setTotalHours(parseInt(hourEnd) + minsEnd - (parseInt(hourStart) + minsStart));

		if (parseInt(hourStart) + minsStart > parseInt(hourEnd) + minsEnd) {
			setTotalHours(24 - (parseInt(hourStart) + minsStart) + (parseInt(hourEnd) + minsEnd));
			if (24 - (parseInt(hourStart) + minsStart) + (parseInt(hourEnd) + minsEnd) > 12) {
				setTotalHours(0);
			}
		}
		if (parseInt(hourEnd) + minsEnd - (parseInt(hourStart) + minsStart) > 12) {
			setTotalHours(0);
		}
	};

	const hoursStartUp = () => {
		setTime({
			...time,
			hourStart: parseInt(time.hourStart) < 9 ? `0${parseInt(time.hourStart) + 1}` : parseInt(time.hourStart) + 1
		});
		if (parseInt(time.hourStart) === 23) {
			setTime({ ...time, hourStart: '00' });
		}
	};

	const hoursStartDown = () => {
		setTime({
			...time,
			hourStart: parseInt(time.hourStart) < 11 ? `0${parseInt(time.hourStart) - 1}` : parseInt(time.hourStart) - 1
		});
		if (parseInt(time.hourStart) === 0) {
			setTime({ ...time, hourStart: '23' });
		}
	};

	const hoursEndUp = () => {
		setTime({
			...time,
			hourEnd: parseInt(time.hourEnd) < 9 ? `0${parseInt(time.hourEnd) + 1}` : parseInt(time.hourEnd) + 1
		});
		if (parseInt(time.hourEnd) === 23) {
			setTime({ ...time, hourEnd: '00' });
		}
	};

	const hoursEndDown = () => {
		setTime({
			...time,
			hourEnd: parseInt(time.hourEnd) < 11 ? `0${parseInt(time.hourEnd) - 1}` : parseInt(time.hourEnd) - 1
		});
		if (parseInt(time.hourEnd) === 0) {
			setTime({ ...time, hourEnd: '23' });
		}
	};

	const minutesStartUp = () => {
		setTime({ ...time, minutesStart: parseInt(time.minutesStart) + 15 });

		if (parseInt(time.minutesStart) === 45) {
			setTime({ ...time, minutesStart: '00' });
		}
	};

	const minutesStartDown = () => {
		setTime({
			...time,
			minutesStart: parseInt(time.minutesStart) - 15
		});

		if (parseInt(time.minutesStart) === 0) {
			setTime({ ...time, minutesStart: '45' });
		}

		if (parseInt(time.minutesStart) === 15) {
			setTime({ ...time, minutesStart: '00' });
		}
	};

	const minutesEndUp = () => {
		setTime({ ...time, minutesEnd: parseInt(time.minutesEnd) + 15 });

		if (parseInt(time.minutesEnd) === 45) {
			setTime({ ...time, minutesEnd: '00' });
		}
	};

	const minutesEndDown = () => {
		setTime({
			...time,
			minutesEnd: parseInt(time.minutesEnd) - 15
		});

		if (parseInt(time.minutesEnd) === 0) {
			setTime({ ...time, minutesEnd: '45' });
		}

		if (parseInt(time.minutesEnd) === 15) {
			setTime({ ...time, minutesEnd: '00' });
		}
	};

	return {
		time,
		setTime,
		totalPay,
		setTotalPay,
		totalHours,
		setTotalHours,
		hoursStartUp,
		hoursStartDown,
		hoursEndUp,
		hoursEndDown,
		minutesStartUp,
		minutesStartDown,
		minutesEndUp,
		minutesEndDown
	};
};

export default useTime;
