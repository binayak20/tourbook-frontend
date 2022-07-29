import { settingsAPI } from '@/libs/api';
import { message } from 'antd';
import { useQuery } from 'react-query';

const useConfigurations = () =>
	useQuery('settings-configurations-public', () => settingsAPI.configurations(), {
		staleTime: Infinity,
		cacheTime: 0,
		retryOnMount: false,
		onError: (error: Error) => {
			message.error(error.message);
		},
	});

export default useConfigurations;
