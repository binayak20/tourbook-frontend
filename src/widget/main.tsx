import { publicAPI } from '@/libs/api/publicAPI';
import 'antd/dist/antd.less';
import 'antd/dist/antd.variable.min.css';
import 'nprogress/nprogress.css';
import { createRoot } from 'react-dom/client';
import '../assets/styles/less/app.less';
import Widget from './Widget';
import InitialSkeleton from './components/InitialSkeleton';
import { initI18n, resolveConfig } from './libs/utills';
import { WidgetCofig } from './types';

const main = async (config: WidgetCofig) => {
	resolveConfig(config);
	const {
		container,
		locale = 'sv',
		adminURL,
		primaryColor,
		currency = {
			value: 'SEK',
			locale: 'sv-SE',
		},
	} = config;
	const root = createRoot(container as HTMLElement);
	root.render(<InitialSkeleton />);
	await initI18n(locale, adminURL);
	const removeConfig = await publicAPI.configuration();
	root.render(
		<Widget primaryColor={removeConfig?.color_code || primaryColor} currency={currency} />
	);
};

window.Widget = main;
