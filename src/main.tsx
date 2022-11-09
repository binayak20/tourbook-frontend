import 'antd/dist/antd.less';
import 'antd/dist/antd.variable.min.css';
import 'nprogress/nprogress.css';
import { createRoot } from 'react-dom/client';
import App from './App';
import './assets/styles/less/app.less';
import './config/translate';

const element = document.getElementById('root');
const root = createRoot(element as HTMLElement);
root.render(
	// <React.StrictMode>
	<App />
	// </React.StrictMode>
);
