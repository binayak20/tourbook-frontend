import { MenuItem } from '@/components/layouts/InnerLayout/types';
import { lazy } from 'react';

export const LOCATIONS_SETTINGS_ROUTES = {
	LOCATIONS: 'all',
	COUNTRIES: 'countries',
	TERRITORRIES: 'terittories',
};

export const locationSettingsRoutes = [
	{
		path: LOCATIONS_SETTINGS_ROUTES.COUNTRIES,
		Component: lazy(() => import('./Countries')),
	},
	{
		path: LOCATIONS_SETTINGS_ROUTES.TERRITORRIES,
		Component: lazy(() => import('./Territorries')),
	},
	{
		path: LOCATIONS_SETTINGS_ROUTES.LOCATIONS,
		Component: lazy(() => import('./Locations')),
	},
];

export const MENU_ITEMS: MenuItem[] = [
	{
		name: 'All Locations',
		path: LOCATIONS_SETTINGS_ROUTES.LOCATIONS,
		permission: 'VIEW_LOCATION',
	},
	{
		name: 'Countries',
		path: LOCATIONS_SETTINGS_ROUTES.COUNTRIES,
		permission: 'VIEW_COUNTRY',
	},
	{
		name: 'Territories',
		path: LOCATIONS_SETTINGS_ROUTES.TERRITORRIES,
		permission: 'VIEW_TERRITORY',
	},
];
