export const PUBLIC_ROUTES = {
	SIGNIN: '/',
	FORGOT_PASSWORD: 'forgot-password',
	RESET_PASSWORD: 'password-reset/:id/:token',
};

export const PRIVATE_ROUTES = {
	DASHBOARD: '',
	CREATE: 'create',
	PARAM_ID: ':id',
	TOURS: 'tours-administration/tours',
	TOURS_ADMINISTRATION: 'tours-administration',
	ECONOMY: 'economy',
	TICKETS: 'tickets',
	TICKETS_CREATE: 'tickets/create',
	TICKETS_EDIT: 'tickets/edit/:id',
	TICKET_SUPPLIERS: 'ticket-suppliers',
	TICKET_SUPPLIERS_CREATE: 'ticket-suppliers/create',
	TICKET_SUPPLIERS_EDIT: 'ticket-suppliers/edit/:id',
	TICKET_MANAGEMENT: 'ticket-management',
	TICKET_TYPES: 'ticket-types',
	TOURS_CREATE: 'tours-administration/tours/create',
	TOURS_UPDATE: 'tours-administration/tours/edit/:id',
	TOURS_TYPES: 'tours-administration/tour-types',
	TOURS_TYPES_CREATE: 'tours-administration/tour-types/create',
	TOURS_TYPES_UPDATE: 'tours-administration/tour-types/edit/:id',
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
	PICKUPLOCATIONS: 'pickup-locations',
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
	TRAVEL_INFORMATION: 'travel-information',
	COUPONS: 'coupons',
	REPORTS: 'reports',
	LOGS: 'logs',
	EMAIL_LOGS: 'email-logs',
	FORTNOX_LOGS: 'fortnox-logs',
	SCHEDULED_EMAIL: 'scheduled-email',
};
