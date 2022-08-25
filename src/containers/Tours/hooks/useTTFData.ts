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
		{ queryKey: ['territories'], queryFn: () => locationsAPI.territories() },
		{ queryKey: ['fortnoxCostCenters'], queryFn: () => fortnoxAPI.costCenters() },
		{ queryKey: ['tourCategories'], queryFn: () => toursAPI.categories() },
		{ queryKey: ['accommodations'], queryFn: () => accommAPI.list() },
		{ queryKey: ['currencies'], queryFn: () => currenciesAPI.list() },
		{ queryKey: ['stationsTypes'], queryFn: () => stationsAPI.types() },
	]);
};
