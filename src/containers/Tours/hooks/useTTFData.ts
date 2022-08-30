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

const defaultParams = {
	page: 1,
	limit: config.itemsPerPageMax,
};

export const useTTFData = () => {
	return useQueries([
		{ queryKey: ['vehicles'], queryFn: () => vehiclesAPI.list(defaultParams) },
		{ queryKey: ['territories'], queryFn: () => locationsAPI.territories(defaultParams) },
		{ queryKey: ['fortnoxCostCenters'], queryFn: () => fortnoxAPI.costCenters(defaultParams) },
		{ queryKey: ['tourCategories'], queryFn: () => toursAPI.categories(defaultParams) },
		{ queryKey: ['accommodations'], queryFn: () => accommAPI.list(defaultParams) },
		{ queryKey: ['currencies'], queryFn: () => currenciesAPI.list(defaultParams) },
		{ queryKey: ['stationsTypes'], queryFn: () => stationsAPI.types(defaultParams) },
	]);
};
