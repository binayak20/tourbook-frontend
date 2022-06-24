import { settingsAPI } from '@/libs/api';
import { useEffect } from 'react';
import { useQuery } from 'react-query';

export const SettingsAirports: React.FC = () => {
	const { data } = useQuery('settings-airports', () => settingsAPI.airports());
	useEffect(() => {
		console.log(data);
	}, [data]);
	return <div>Airports</div>;
};
