import config from '@/config';
import {
	accommAPI,
	currenciesAPI,
	fortnoxAPI,
	locationsAPI,
	stationsAPI,
	toursAPI,
	vehiclesAPI,
} from '@/libs/api';
import { useQueries } from 'react-query';

export const useTTFData = () => {
	return useQueries([
		{ queryKey: ['vehicles'], queryFn: () => vehiclesAPI.list() },
		{
			queryKey: ['territories'],
			queryFn: () => locationsAPI.territories({ page: 1, limit: config.maxLimit }),
		},
		{ queryKey: ['fortnoxCostCenters'], queryFn: () => fortnoxAPI.costCenters(1, config.maxLimit) },
		{
			queryKey: ['tourCategories'],
			queryFn: () => toursAPI.categories({ page: 1, limit: config.maxLimit }),
		},
		{ queryKey: ['accommodations'], queryFn: () => accommAPI.list(1, config.maxLimit) },
		{ queryKey: ['currencies'], queryFn: () => currenciesAPI.list() },
		{ queryKey: ['stationsTypes'], queryFn: () => stationsAPI.types() },
	]);
};
