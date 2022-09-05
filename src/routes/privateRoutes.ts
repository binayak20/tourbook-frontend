import { lazy } from 'react';
import { PRIVATE_ROUTES } from './paths';

export const privateRoutes = [
	{
		path: PRIVATE_ROUTES.DASHBOARD,
		Component: lazy(() => import('@/pages/Dashboard')),
	},
	{
		path: PRIVATE_ROUTES.PROFILE,
		Component: lazy(() => import('@/pages/Profile')),
	},
	{
		path: PRIVATE_ROUTES.TOURS,
		Component: lazy(() => import('@/pages/Tours')),
	},
	{
		path: PRIVATE_ROUTES.TOURS_CREATE,
		Component: lazy(() => import('@/pages/Tours/TourCreate')),
	},
	{
		path: PRIVATE_ROUTES.TOURS_UPDATE,
		Component: lazy(() => import('@/pages/Tours/TourUpdate')),
	},
	{
		path: PRIVATE_ROUTES.TOURS_TYPES,
		Component: lazy(() => import('@/pages/Tours/TourTypes')),
	},
	{
		path: PRIVATE_ROUTES.TOURS_TYPES_CREATE,
		Component: lazy(() => import('@/pages/Tours/TourTypeCreate')),
	},
	{
		path: PRIVATE_ROUTES.TOURS_TYPES_UPDATE,
		Component: lazy(() => import('@/pages/Tours/TourTypeUpdate')),
	},
	{
		path: PRIVATE_ROUTES.SUPPLEMENTS,
		Component: lazy(() => import('@/pages/Supplements')),
	},
	{
		path: PRIVATE_ROUTES.SUPPLEMENTS_CATEGORIES,
		Component: lazy(() => import('@/pages/Supplements/SupplementCategories')),
	},
	{
		path: PRIVATE_ROUTES.BOOKINGS,
		Component: lazy(() => import('@/pages/Bookings')),
	},
	{
		path: PRIVATE_ROUTES.BOOKINGS_CREATE,
		Component: lazy(() => import('@/pages/Bookings/BookingCreate')),
	},
	{
		path: PRIVATE_ROUTES.BOOKINGS_UPDATE,
		Component: lazy(() => import('@/pages/Bookings')),
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
		Component: lazy(() => import('@/pages/SettingsUserRoles')),
	},
	{
		path: `${PRIVATE_ROUTES.SETTINGS}/${PRIVATE_ROUTES.USER_ROLES}/${PRIVATE_ROUTES.CREATE}`,
		Component: lazy(() => import('@/pages/SettingsUserRoleCreate')),
	},
	{
		path: `${PRIVATE_ROUTES.SETTINGS}/${PRIVATE_ROUTES.USER_ROLES}/${PRIVATE_ROUTES.PARAM_ID}`,
		Component: lazy(() => import('@/pages/SettingsUserRoleUpdate')),
	},
	{
		path: `${PRIVATE_ROUTES.SETTINGS}/${PRIVATE_ROUTES.USERS}`,
		Component: lazy(() => import('@/pages/SettingsUsersList')),
	},
	{
		path: `${PRIVATE_ROUTES.SETTINGS}/${PRIVATE_ROUTES.ACCOMMODATIONS}`,
		Component: lazy(() => import('@/pages/SettingsAccommodations')),
	},
	{
		path: `${PRIVATE_ROUTES.SETTINGS}/${PRIVATE_ROUTES.CATEGORIES}`,
		Component: lazy(() => import('@/pages/SettingsCategories')),
	},
	{
		path: `${PRIVATE_ROUTES.SETTINGS}/${PRIVATE_ROUTES.LOCATIONS}/*`,
		Component: lazy(() => import('@/pages/SettingsLocations')),
	},
	{
		path: `${PRIVATE_ROUTES.SETTINGS}/${PRIVATE_ROUTES.CURRENCIES}/*`,
		Component: lazy(() => import('@/pages/SettingsCurrencies')),
	},
	{
		path: `${PRIVATE_ROUTES.SETTINGS}/${PRIVATE_ROUTES.STATIONS}/*`,
		Component: lazy(() => import('@/pages/SettingsStations')),
	},
	{
		path: `${PRIVATE_ROUTES.SETTINGS}/${PRIVATE_ROUTES.EMAIL_CONFIGURE}/*`,
		Component: lazy(() => import('@/pages/SettingsEmailConfigure')),
	},
	{
		path: `${PRIVATE_ROUTES.SETTINGS}/${PRIVATE_ROUTES.PAYMENT_CONFIGURE}/*`,
		Component: lazy(() => import('@/pages/SettingsPaymentConfigure')),
	},
];
