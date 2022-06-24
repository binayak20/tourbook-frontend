export const PUBLIC_ROUTES = {
	SIGNIN: '/',
	FORGOT_PASSWORD: 'forgot-password',
};

export const PRIVATE_ROUTES = {
	DASHBOARD: '',
	TOUR_TYPES: 'tour-types',
	TOUR_TYPES_CREATE: 'tour-types/create',
	USERS: 'users',
	USERS_CREATE: 'users/create',
	USERS_UPDATE: 'users/edit/:id',
	REPORTS: 'reports',
	TRANSACTIONS: 'transactions',
	TICKETS: 'tickets',
	TICKETS_LOCATIONS: 'tickets/locations',
	TICKETS_SUPPLIERS: 'tickets/suppliers',
	SETTINGS: 'settings/*',
	SETTINGS_EXACT: 'settings',
	SETTINGS_AIRPORTS: 'settings/airports',
	SETTINGS_PROFILE: 'settings/profile',
	SETTINGS_ROLES: 'settings/roles',
};
