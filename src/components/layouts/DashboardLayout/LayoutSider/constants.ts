import { ReactComponent as BookingsIcon } from '@/assets/images/sidebar/bookings.svg';
import { ReactComponent as DashboardIcon } from '@/assets/images/sidebar/dashboard.svg';
import { ReactComponent as SettingsIcon } from '@/assets/images/sidebar/settings.svg';
import { ReactComponent as SupplementsIcon } from '@/assets/images/sidebar/supplements.svg';
import { ReactComponent as ToursIcon } from '@/assets/images/sidebar/tours.svg';
import { ReactComponent as TransactionIcon } from '@/assets/images/sidebar/transactions.svg';
import { translationKeys } from '@/config/translate/i18next';
import { PRIVATE_ROUTES } from '@/routes/paths';

export type MenuItem = {
	name: translationKeys;
	path: string;
	end?: boolean;
	ItemIcon?: React.FC<React.SVGProps<SVGSVGElement>>;
	childrens?: MenuItem[];
	permission?: string | string[];
	beta?: boolean;
};

export const MENU_ITEMS: MenuItem[] = [
	{
		name: 'Dashboard',
		ItemIcon: DashboardIcon,
		path: PRIVATE_ROUTES.DASHBOARD,
		end: true,
	},
	{
		name: 'Tours',
		ItemIcon: ToursIcon,
		path: PRIVATE_ROUTES.TOURS,
		childrens: [
			{
				name: 'All Tours',
				path: PRIVATE_ROUTES.TOURS,
				permission: 'VIEW_TOUR',
				end: true,
			},
			{
				name: 'Tour types',
				path: PRIVATE_ROUTES.TOURS_TYPES,
				permission: 'VIEW_TOURTYPE',
			},
		],
	},
	{
		name: 'Supplements',
		ItemIcon: SupplementsIcon,
		path: PRIVATE_ROUTES.SUPPLEMENTS,
		childrens: [
			{
				name: 'All Supplements',
				path: PRIVATE_ROUTES.SUPPLEMENTS,
				permission: 'VIEW_SUPPLEMENT',
				end: true,
			},
			{
				name: 'Categories',
				path: PRIVATE_ROUTES.SUPPLEMENTS_CATEGORIES,
				permission: 'VIEW_SUPPLEMENTCATEGORY',
			},
		],
	},
	{
		name: 'Bookings',
		ItemIcon: BookingsIcon,
		path: PRIVATE_ROUTES.BOOKINGS,
		permission: 'VIEW_BOOKING',
	},
	{
		name: 'Transactions',
		ItemIcon: TransactionIcon,
		path: PRIVATE_ROUTES.TRANSACTIONS,
		permission: 'VIEW_TRANSACTION',
	},
	{
		name: 'Ticket management',
		ItemIcon: TransactionIcon,
		path: PRIVATE_ROUTES.TICKET_TYPES,
		childrens: [
			{
				name: 'Ticket types',
				path: PRIVATE_ROUTES.TICKET_TYPES,
				permission: 'VIEW_TICKETTYPE',
				end: true,
			},
		],
	},
	{
		name: 'Settings',
		ItemIcon: SettingsIcon,
		path: PRIVATE_ROUTES.SETTINGS,
		childrens: [
			{
				name: 'Configuration',
				path: `${PRIVATE_ROUTES.SETTINGS}/${PRIVATE_ROUTES.CONFIGURATION}`,
				permission: 'VIEW_CONFIGURATION',
			},
			{
				name: 'Users',
				path: `${PRIVATE_ROUTES.SETTINGS}/${PRIVATE_ROUTES.USERS}`,
				permission: 'VIEW_USER',
			},
			{
				name: 'User Roles',
				path: `${PRIVATE_ROUTES.SETTINGS}/${PRIVATE_ROUTES.USER_ROLES}`,
				permission: 'VIEW_GROUP',
			},
			{
				name: 'Categories',
				path: `${PRIVATE_ROUTES.SETTINGS}/${PRIVATE_ROUTES.CATEGORIES}`,
				permission: 'VIEW_CATEGORY',
			},
			{
				name: 'Locations',
				path: `${PRIVATE_ROUTES.SETTINGS}/${PRIVATE_ROUTES.LOCATIONS}`,
				permission: [
					'ADD_LOCATION',
					'CHANGE_LOCATION',
					'VIEW_LOCATION',
					'VIEW_COUNTRY',
					'VIEW_TERRITORY',
				],
			},
			{
				name: 'Currencies',
				path: `${PRIVATE_ROUTES.SETTINGS}/${PRIVATE_ROUTES.CURRENCIES}`,
				permission: [
					'VIEW_CURRENCY',
					'ADD_CURRENCYCONVERSION',
					'CHANGE_CURRENCYCONVERSION',
					'VIEW_CURRENCYCONVERSION',
				],
			},
			{
				name: 'Accommodations',
				path: `${PRIVATE_ROUTES.SETTINGS}/${PRIVATE_ROUTES.ACCOMMODATIONS}`,
				permission: 'VIEW_ACCOMMODATION',
			},
			{
				name: 'Stations',
				path: `${PRIVATE_ROUTES.SETTINGS}/${PRIVATE_ROUTES.STATIONS}`,
				permission: ['VIEW_STATION', 'VIEW_STATIONTYPE'],
			},
			{
				name: 'Email Configure',
				path: `${PRIVATE_ROUTES.SETTINGS}/${PRIVATE_ROUTES.EMAIL_CONFIGURE}`,
				permission: 'VIEW_EMAILPROVIDERCONFIGURATION',
			},
			{
				name: 'Payment Configure',
				path: `${PRIVATE_ROUTES.SETTINGS}/${PRIVATE_ROUTES.PAYMENT_CONFIGURE}`,
				permission: 'VIEW_PAYMENTMETHODCONFIGURATION',
			},
			{
				name: 'Accounting configure',
				path: `${PRIVATE_ROUTES.SETTINGS}/${PRIVATE_ROUTES.ACCOUNTING_CONFIGURE}`,
				permission: 'VIEW_ACCOUNTINGSERVICEPROVIDERCONFIGURATION',
			},
			{
				name: 'Vehicles',
				path: `${PRIVATE_ROUTES.SETTINGS}/${PRIVATE_ROUTES.VEHICLES}`,
				permission: [
					'ADD_VEHICLE',
					'CHANGE_VEHICLE',
					'VIEW_VEHICLE',
					'ADD_VEHICLETYPE',
					'CHANGE_VEHICLETYPE',
					'VIEW_VEHICLETYPE',
				],
			},
			{
				name: 'Travel information',
				path: `${PRIVATE_ROUTES.SETTINGS}/${PRIVATE_ROUTES.TRAVEL_INFORMATION}`,
				permission: ['VIEW_TRAVELINFORMATIONTYPE', 'VIEW_TRAVELINFORMATIONTYPE'],
			},
		],
	},
];
