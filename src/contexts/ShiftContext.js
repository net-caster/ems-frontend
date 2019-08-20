import React, { useState, createContext } from 'react';

export const ShiftContext = createContext();

export const ShiftProvider = (props) => {
	const [ time, setTime ] = useState({
		hourStart: '09',
		hourEnd: '17',
		minutesStart: '00',
		minutesEnd: '00',
		totalHours: 0
	});

	const getShiftHours = (start, end) => {
		setTime({ ...time, totalHours: parseInt(end) - parseInt(start) });

		if (parseInt(start) > parseInt(end)) {
			setTime({ ...time, totalHours: 24 - parseInt(start) + parseInt(end) });
			if (24 - parseInt(start) + parseInt(end) > 12) {
				setTime({ ...time, totalHours: 0 });
			}
		}
		if (parseInt(end) - parseInt(start) > 12) {
			setTime({ ...time, totalHours: 0 });
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

	return <ShiftContext.Provider value={[]}>{props.children}</ShiftContext.Provider>;
};
