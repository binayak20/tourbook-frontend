import {
	accommAPI,
	currenciesAPI,
	fortnoxAPI,
	locationsAPI,
	stationsAPI,
	toursAPI,
	vehiclesAPI,
} from '@/libs/api';
import { travelInfoAPI } from '@/libs/api/travelinfoAPI';
import { DEFAULT_LIST_PARAMS } from '@/utils/constants';
import { useQueries } from 'react-query';

export const useTTFData = () => {
	return useQueries([
		{
			queryKey: ['vehicles'],
			queryFn: () => vehiclesAPI.list({ ...DEFAULT_LIST_PARAMS, is_active: true }),
		},
		{
			queryKey: ['territories'],
			queryFn: () => locationsAPI.territories({ ...DEFAULT_LIST_PARAMS, is_active: true }),
		},
		{
			queryKey: ['fortnoxCostCenters'],
			queryFn: () => fortnoxAPI.costCenters(DEFAULT_LIST_PARAMS),
		},
		{
			queryKey: ['tourCategories'],
			queryFn: () => toursAPI.categories({ ...DEFAULT_LIST_PARAMS, is_active: true }),
		},
		{
			queryKey: ['accommodations'],
			queryFn: () => accommAPI.list({ ...DEFAULT_LIST_PARAMS, is_active: true }),
		},
		{ queryKey: ['currencies'], queryFn: () => currenciesAPI.list(DEFAULT_LIST_PARAMS) },
		{
			queryKey: ['fortnoxProjects'],
			queryFn: () => fortnoxAPI.projects(DEFAULT_LIST_PARAMS),
		},
		{
			queryKey: ['travelInfos'],
			queryFn: () => travelInfoAPI.getTravelInfoList({ ...DEFAULT_LIST_PARAMS, is_active: true }),
		},

		{
			queryKey: ['pickup-locations-list'],
			queryFn: () => locationsAPI.list({ ...DEFAULT_LIST_PARAMS, is_active: true }),
		},
		{
			queryKey: ['pickup-locations-list-autofill'],
			queryFn: () => locationsAPI.pickupLocationList({ ...DEFAULT_LIST_PARAMS, is_active: true }),
		},
		{
			queryKey: ['stationsTypes'],
			queryFn: () => stationsAPI.types({ ...DEFAULT_LIST_PARAMS, is_active: true }),
		},
	]);
};
