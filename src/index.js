import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, HashRouter } from 'react-router-dom';

import App from './App';
import '@babel/polyfill';

ReactDOM.render(
	<Router history={HashRouter}>
		<App />
	</Router>,
	document.querySelector('.container')
);
