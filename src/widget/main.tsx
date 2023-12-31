import { publicAPI } from '@/libs/api/publicAPI';

// import 'antd/dist/antd.less';

// import 'antd/dist/antd.variable.min.css';

import 'nprogress/nprogress.css';
import { createRoot } from 'react-dom/client';
import Widget from './Widget';
import InitialSkeleton from './components/InitialSkeleton';
import { getStateFromQueryParams, initI18n, resolveConfig } from './libs/utills';
import { IWidgetCofig } from './types';

const main = async (config: IWidgetCofig) => {
	resolveConfig(config);
	const {
		container,
		locale = 'sv',
		adminURL,
		primaryColor,
		currencyCode = 'SEK',
		redirects,
		termsURL,
	} = config;
	const root = createRoot(container as HTMLElement);
	const { searchParams } = new URL(window.location.href);
	const sates = getStateFromQueryParams(searchParams);
	root.render(<InitialSkeleton type={sates?.widget_screen ?? 'search'} />);
	await initI18n(locale, adminURL);
	const configs = await publicAPI.configuration();
	root.render(
		<Widget
			primaryColor={primaryColor || configs?.color_code}
			currencyCode={currencyCode}
			redirects={redirects}
			termsURL={termsURL}
			locale={locale}
		/>
	);
};

window.Widget = main;
