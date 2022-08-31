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
