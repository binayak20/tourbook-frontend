import { lazy } from 'react';
import { PRIVATE_ROUTES } from './paths';

export const privateRoutes = [
	{
		path: PRIVATE_ROUTES.DASHBOARD,
		Component: lazy(() => import('@/pages/Dashboard')),
	},
	{
		path: PRIVATE_ROUTES.TOUR_TYPES_CREATE,
		Component: lazy(() => import('@/pages/TourTypesCreate')),
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
];
