import { MenuItem } from '@/components/layouts/InnerLayout/types';
import { lazy } from 'react';

export const LOCATIONS_SETTINGS_ROUTES = {
	PICKUPLOCATIONS: 'pickup-locations',
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
	{
		path: LOCATIONS_SETTINGS_ROUTES.PICKUPLOCATIONS,
		Component: lazy(() => import('./PickupLocations')),
	},
];

export const MENU_ITEMS: MenuItem[] = [
	{
		name: 'Pickup locations',
		path: LOCATIONS_SETTINGS_ROUTES.PICKUPLOCATIONS,
		permission: 'VIEW_PICKUPLOCATION',
	},
	{
		name: 'Locations',
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
