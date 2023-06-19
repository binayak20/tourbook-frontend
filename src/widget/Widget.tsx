import { ConfigProvider } from 'antd';
import { FC } from 'react';
import { WidgetProvider } from './libs/WidgetContext';
import Screens from './screens';

interface IWidgetProps {
	primaryColor?: string;
	currency?: {
		locale: string;
		value: string;
	};
}

const Widget: FC<IWidgetProps> = ({ primaryColor }) => {
	ConfigProvider.config({ theme: { primaryColor } });

	return (
		<ConfigProvider>
			<WidgetProvider>
				<Screens />
			</WidgetProvider>
		</ConfigProvider>
	);
};

export default Widget;
