export const PUBLIC_ROUTES = {
	SIGNIN: '/',
	FORGOT_PASSWORD: 'forgot-password',
	RESET_PASSWORD: 'password-reset/:id/:token',
};

export const PRIVATE_ROUTES = {
	DASHBOARD: '',
	CREATE: 'create',
	PARAM_ID: ':id',
	TOUR_TYPES: 'tour-types',
	TOUR_TYPES_CREATE: 'tour-types/create',
	USERS: 'users',
	REPORTS: 'reports',
	TRANSACTIONS: 'transactions',
	TICKETS: 'tickets',
	TICKETS_LOCATIONS: 'tickets/locations',
	TICKETS_SUPPLIERS: 'tickets/suppliers',
	SETTINGS: 'settings',
	SETTINGS_CURRENCIES: 'settings/currencies',
	USER_ROLES: 'user-roles',
	CATEGORIES: 'categories',
	AIRPORTS: 'airports',
	LOCATIONS_SETTINGS: 'locations-settings',
	LOCATIONS: 'locations',
	TERRITORRIES: 'territorries',
	SUPPLIERS: 'suppliers',
	SETTINGS_PROFILE: 'settings/profile',
	CONFIGURATION: 'configuration',
	ACCOMODATIONS: 'accomodations',
	PROFILE: 'profile',
};
