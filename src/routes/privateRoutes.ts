import { lazy } from 'react';
import { PRIVATE_ROUTES } from './paths';

export const privateRoutes = [
	{
		path: PRIVATE_ROUTES.DASHBOARD,
		Component: lazy(() => import('@/pages/Dashboard')),
	},
	{
		path: PRIVATE_ROUTES.TICKETS,
		Component: lazy(() => import('@/pages/Tickets')),
	},
	{
		path: `${PRIVATE_ROUTES.TICKETS}/${PRIVATE_ROUTES.LOCATIONS}`,
		Component: lazy(() => import('@/pages/TicketsLocations')),
	},
	{
		path: `${PRIVATE_ROUTES.TICKETS}/${PRIVATE_ROUTES.SUPPLIERS}`,
		Component: lazy(() => import('@/pages/TicketsSuppliers')),
	},
	{
		path: PRIVATE_ROUTES.REPORTS,
		Component: lazy(() => import('@/pages/Reports')),
	},
	{
		path: PRIVATE_ROUTES.TRANSACTIONS,
		Component: lazy(() => import('@/pages/Transactions')),
	},
	{
		path: `${PRIVATE_ROUTES.SETTINGS}/*`,
		Component: lazy(() => import('@/pages/Settings')),
	},
	{
		path: `${PRIVATE_ROUTES.SETTINGS}/${PRIVATE_ROUTES.CONFIGURATION}`,
		Component: lazy(() => import('@/pages/SettingsConfigurations')),
	},
	{
		path: `${PRIVATE_ROUTES.SETTINGS}/${PRIVATE_ROUTES.USER_ROLES}`,
		Component: lazy(() => import('@/pages/SettingsRoles')),
	},
	{
		path: `${PRIVATE_ROUTES.SETTINGS}/${PRIVATE_ROUTES.USERS}`,
		Component: lazy(() => import('@/pages/SettingsUsersList')),
	},
	{
		path: `${PRIVATE_ROUTES.SETTINGS}/${PRIVATE_ROUTES.AIRPORTS}`,
		Component: lazy(() => import('@/pages/SettingsAirports')),
	},
	{
		path: `${PRIVATE_ROUTES.SETTINGS}/${PRIVATE_ROUTES.ACCOMODATIONS}`,
		Component: lazy(() => import('@/pages/SettingsAccomodations')),
	},
	{
		path: `${PRIVATE_ROUTES.SETTINGS}/${PRIVATE_ROUTES.CATEGORIES}`,
		Component: lazy(() => import('@/pages/SettingsCategories')),
	},
	{
		path: `${PRIVATE_ROUTES.SETTINGS}/${PRIVATE_ROUTES.LOCATIONS_SETTINGS}/*`,
		Component: lazy(() => import('@/pages/SettingsLocations')),
	},
];
