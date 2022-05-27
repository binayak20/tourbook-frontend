import { lazy } from 'react';
import { PRIVATE_ROUTES } from './paths';

export const privateRoutes = [
	{
		path: PRIVATE_ROUTES.DASHBOARD,
		Component: lazy(() => import('@/pages/Dashboard')),
	},
	{
		path: PRIVATE_ROUTES.USERS,
		Component: lazy(() => import('@/pages/Users')),
	},
	{
		path: PRIVATE_ROUTES.USERS_CREATE,
		Component: lazy(() => import('@/pages/UsersCreate')),
	},
	{
		path: PRIVATE_ROUTES.USERS_ROLES,
		Component: lazy(() => import('@/pages/Dashboard')),
	},
	{
		path: PRIVATE_ROUTES.SETTINGS,
		Component: lazy(() => import('@/pages/Dashboard')),
	},
	{
		path: PRIVATE_ROUTES.SETTINGS_PROFILE,
		Component: lazy(() => import('@/pages/Dashboard')),
	},
	{
		path: PRIVATE_ROUTES.SETTINGS_CHANGE_PASSWORD,
		Component: lazy(() => import('@/pages/Dashboard')),
	},
];
