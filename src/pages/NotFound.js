import React, { useEffect } from 'react';

const NotFound = () => {
	useEffect(() => {
		document.title = 'Page Not Found';
	}, []);

	return (
		<div className="not-found__container">
			<h1 className="not-found__text">The Page You're Looking For Does Not Exist!</h1>
		</div>
	);
};

export default NotFound;
