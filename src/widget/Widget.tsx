import { ConfigProvider } from 'antd';
import { FC } from 'react';
import { WidgetProvider } from './libs/WidgetContext';
import SearchBar from './screens/SearchBar';
import TourList from './screens/TourList';

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
				<SearchBar />
				<TourList />
			</WidgetProvider>
		</ConfigProvider>
	);
};

export default Widget;
