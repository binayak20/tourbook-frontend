import { toursAPI } from '@/libs/api';
import { defaultListParams } from '@/utils/constants';
import { useQueries } from 'react-query';

export const useTFData = () => {
	return useQueries([
		{ queryKey: ['tourTypes'], queryFn: () => toursAPI.tourTypes(defaultListParams) },
		{ queryKey: ['tourTags'], queryFn: () => toursAPI.tags(defaultListParams) },
	]);
};
