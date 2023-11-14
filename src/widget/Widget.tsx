import { ConfigProvider } from 'antd';
import { FC } from 'react';
import { WidgetProvider } from './libs/WidgetContext';
import Screens from './screens';
import { IWidgetProps } from './types';

const Widget: FC<IWidgetProps> = ({ primaryColor, redirects, currencyCode, termsURL, locale }) => {
	ConfigProvider.config({ theme: { primaryColor } });

	return (
		<ConfigProvider>
			<WidgetProvider {...{ redirects, locale, currencyCode, termsURL }}>
				<Screens />
			</WidgetProvider>
		</ConfigProvider>
	);
};

export default Widget;
