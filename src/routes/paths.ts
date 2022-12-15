export const PUBLIC_ROUTES = {
	SIGNIN: '/',
	FORGOT_PASSWORD: 'forgot-password',
	RESET_PASSWORD: 'password-reset/:id/:token',
};

export const PRIVATE_ROUTES = {
	DASHBOARD: '',
	CREATE: 'create',
	PARAM_ID: ':id',
	TOURS: 'tours',
	TOURS_CREATE: 'tours/create',
	TOURS_UPDATE: 'tours/edit/:id',
	TOURS_TYPES: 'tours/types',
	TOURS_TYPES_CREATE: 'tours/types/create',
	TOURS_TYPES_UPDATE: 'tours/types/edit/:id',
	SUPPLEMENTS: 'supplements',
	SUPPLEMENTS_CATEGORIES: 'supplements/categories',
	BOOKINGS: 'bookings',
	BOOKINGS_CREATE: 'bookings/create',
	BOOKINGS_UPDATE: 'bookings/edit/:id',
	TRANSACTIONS: 'transactions',
	USERS: 'users',
	SETTINGS: 'settings',
	CURRENCIES: 'currencies',
	USER_ROLES: 'user-roles',
	CATEGORIES: 'categories',
	LOCATIONS: 'locations',
	TERRITORRIES: 'territorries',
	SUPPLIERS: 'suppliers',
	SETTINGS_PROFILE: 'settings/profile',
	CONFIGURATION: 'configuration',
	ACCOMMODATIONS: 'accommodations',
	PROFILE: 'profile',
	STATIONS: 'stations',
	EMAIL_CONFIGURE: 'email-configure',
	PAYMENT_CONFIGURE: 'payment-configure',
	VEHICLES: 'vehicles',
	VEHICLES_TYPE: 'vehicles-types',
	ACCOUNTING_CONFIGURE: 'accounting-configure',
	ACCOUNTING_CONFIGURE_CREATE: 'accounting-configure/create',
	ACCOUNTING_CONFIGURE_UPDATE: 'accounting-configure/edit/:id',
	ACCOUNTING_CONFIGURE_FORTNOX_COST_CENTERS: 'accounting-configure/fortnox-cost-centers',
	ACCOUNTING_CONFIGURE_FORTNOX_PROJECTS: 'accounting-configure/fortnox-projects',
};
