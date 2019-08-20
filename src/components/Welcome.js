import React, { useEffect } from 'react';

const Welcome = () => {
	useEffect(() => {
		document.title = 'Welcome to EMS Tech. Ltd.';
	}, []);

	return (
		<div className="welcome-container">
			<h1 className="welcome-title">Welcome to EMS Technologies Ltd.</h1>
			<p className="welcome-text">Please use the links on the left to navigate.</p>
		</div>
	);
};

export default Welcome;
