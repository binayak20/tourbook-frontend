import { MenuItem } from '@/components/layouts/InnerLayout/types';
import { lazy } from 'react';

export const STATIONS_SETTINGS_ROUTES = {
	STATIONS: 'all',
	STATION_TYPES: 'station_types',
};

export const stationSettingsRoutes = [
	{
		path: STATIONS_SETTINGS_ROUTES.STATIONS,
		Component: lazy(() => import('./Stations')),
	},
	{
		path: STATIONS_SETTINGS_ROUTES.STATION_TYPES,
		Component: lazy(() => import('./StationTypes')),
	},
];

export const MENU_ITEMS: MenuItem[] = [
	{
		name: 'All stations',
		path: STATIONS_SETTINGS_ROUTES.STATIONS,
	},
	{
		name: 'Station types',
		path: STATIONS_SETTINGS_ROUTES.STATION_TYPES,
	},
];
