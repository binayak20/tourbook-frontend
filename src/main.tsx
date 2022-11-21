import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import 'antd/dist/antd.less';
import 'antd/dist/antd.variable.min.css';
import 'nprogress/nprogress.css';
import { createRoot } from 'react-dom/client';
import App from './App';
import './assets/styles/less/app.less';
import config from './config';
import './config/translate';

Sentry.init({
	dsn: config.sentryDSN,
	integrations: [new BrowserTracing()],
	tracesSampleRate: 1.0,
	enabled: !config.dev,
	environment: 'production',
});

const element = document.getElementById('root');
const root = createRoot(element as HTMLElement);
root.render(
	// <React.StrictMode>
	<App />
	// </React.StrictMode>
);
