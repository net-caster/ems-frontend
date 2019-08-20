import React, { useEffect } from 'react';

import Month from './Month';
import MonthsModal from './MonthsModal';

const MonthCalendar = () => {
	useEffect(() => {
		document.title = 'Dashboard | Calendar';
	}, []);

	return (
		<div className="month-container">
			<Month />
			<MonthsModal />
		</div>
	);
};

export default MonthCalendar;
