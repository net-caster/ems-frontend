import React, { useState, createContext } from 'react';

export const PageContext = createContext();

export const PageProvider = (props) => {
	const [ pageState, setPageState ] = useState({});

	return <PageContext.Provider value={[ pageState, setPageState ]}>{props.children}</PageContext.Provider>;
};
