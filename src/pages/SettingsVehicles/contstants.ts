import { MenuItem } from '@/components/layouts/InnerLayout/types';
import { lazy } from 'react';

export const VEHICLES_SETTINGS_ROUTES = {
	VEHICLES: 'all',
	VEIHICLE_TYPES: 'vechicle_types',
};

export const vehiclesSettingsRoutes = [
	{
		path: VEHICLES_SETTINGS_ROUTES.VEHICLES,
		Component: lazy(() => import('./Vehicles')),
	},
	{
		path: VEHICLES_SETTINGS_ROUTES.VEIHICLE_TYPES,
		Component: lazy(() => import('./VehicleTypes')),
	},
];

export const MENU_ITEMS: MenuItem[] = [
	{
		name: 'All vehicles',
		path: VEHICLES_SETTINGS_ROUTES.VEHICLES,
		permission: 'VIEW_VEHICLE',
	},
	{
		name: 'Vehicle types',
		path: VEHICLES_SETTINGS_ROUTES.VEIHICLE_TYPES,
		permission: 'VIEW_VEHICLETYPE',
	},
];
