import { toursAPI } from '@/libs/api';
import { DEFAULT_LIST_PARAMS } from '@/utils/constants';
import { useQueries } from 'react-query';

export const useTFData = () => {
	return useQueries([
		{ queryKey: ['tourTypes'], queryFn: () => toursAPI.tourTypes(DEFAULT_LIST_PARAMS) },
		{ queryKey: ['tourTags'], queryFn: () => toursAPI.tags(DEFAULT_LIST_PARAMS) },
	]);
};
