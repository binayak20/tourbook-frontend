import 'nprogress/nprogress.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './assets/styles/less/app.less';
import './config/translate';

const element = document.getElementById('root');
const root = createRoot(element as HTMLElement);
root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
