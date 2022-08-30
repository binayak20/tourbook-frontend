import config from '@/config';
import { toursAPI } from '@/libs/api';
import { useQueries } from 'react-query';

const defaultParams = {
	page: 1,
	limit: config.itemsPerPageMax,
};

export const useTFData = () => {
	return useQueries([
		{ queryKey: ['tourTypes'], queryFn: () => toursAPI.tourTypes(defaultParams) },
		{ queryKey: ['tourTags'], queryFn: () => toursAPI.tags(defaultParams) },
	]);
};
