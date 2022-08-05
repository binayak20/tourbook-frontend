import { lazy } from 'react';

export const LOCATIONS_SETTINGS_ROUTES = {
	LOCATIONS: 'locations',
	TERRITORRIES: 'terittories',
};

export const emailSettingsRoutes = [
	{
		path: LOCATIONS_SETTINGS_ROUTES.TERRITORRIES,
		Component: lazy(() => import('./Territorries')),
	},
	{
		path: LOCATIONS_SETTINGS_ROUTES.LOCATIONS,
		Component: lazy(() => import('./Locations')),
	},
];
