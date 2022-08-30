import {
	accommAPI,
	currenciesAPI,
	fortnoxAPI,
	locationsAPI,
	stationsAPI,
	toursAPI,
	vehiclesAPI,
} from '@/libs/api';
import { defaultListParams } from '@/utils/constants';
import { useQueries } from 'react-query';

export const useTTFData = () => {
	return useQueries([
		{ queryKey: ['vehicles'], queryFn: () => vehiclesAPI.list(defaultListParams) },
		{ queryKey: ['territories'], queryFn: () => locationsAPI.territories(defaultListParams) },
		{ queryKey: ['fortnoxCostCenters'], queryFn: () => fortnoxAPI.costCenters(defaultListParams) },
		{ queryKey: ['tourCategories'], queryFn: () => toursAPI.categories(defaultListParams) },
		{ queryKey: ['accommodations'], queryFn: () => accommAPI.list(defaultListParams) },
		{ queryKey: ['currencies'], queryFn: () => currenciesAPI.list(defaultListParams) },
		{ queryKey: ['stationsTypes'], queryFn: () => stationsAPI.types(defaultListParams) },
	]);
};
