import { settingsAPI } from '@/libs/api';
import { useQuery } from 'react-query';

const useConfigurations = () =>
	useQuery('settings-configurations-public', () => settingsAPI.configurations(), {
		staleTime: Infinity,
		cacheTime: 0,
	});

export default useConfigurations;
