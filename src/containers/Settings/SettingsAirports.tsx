import { settingsAPI } from '@/libs/api';
import { useEffect } from 'react';
import { useMutation } from 'react-query';

export const SettingsAirports = () => {
	const { mutate: getSettings } = useMutation(() => settingsAPI.airports(), {
		onSuccess: ({ success, data }) => {
			if (success && data) {
				console.log(data);
			}
		},
	});
	useEffect(() => {
		getSettings();
	}, [getSettings]);
	return <div>Airports</div>;
};
