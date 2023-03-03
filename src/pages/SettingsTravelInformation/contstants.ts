import { MenuItem } from '@/components/layouts/InnerLayout/types';
import { lazy } from 'react';

export const INNER_ROUTES = {
	INDEX: 'all',
	TRAVEL_INFORMATION_TYPES: 'travel-information-types',
	CREATE_TRAVEL_INFORMATION: 'create-travel-information',
};

export const innerRoutes = [
	{
		path: INNER_ROUTES.INDEX,
		Component: lazy(() => import('./TravelInformation')),
	},
	{
		path: INNER_ROUTES.TRAVEL_INFORMATION_TYPES,
		Component: lazy(() => import('./TravelInformationType')),
	},
];

export const MENU_ITEMS: MenuItem[] = [
	{
		name: 'All travel information',
		path: INNER_ROUTES.INDEX,
		permission: 'VIEW_TRAVELINFORMATION',
	},
	{
		name: 'Travel information types',
		path: INNER_ROUTES.TRAVEL_INFORMATION_TYPES,
		permission: 'VIEW_TRAVELINFORMATIONTYPE',
	},
];
