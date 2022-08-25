import { toursAPI } from '@/libs/api';
import { useQueries } from 'react-query';

export const useTFData = () => {
	return useQueries([{ queryKey: ['tourTypes'], queryFn: () => toursAPI.tourTypes() }]);
};
