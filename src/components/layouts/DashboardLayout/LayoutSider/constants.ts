import { ReactComponent as BookingsIcon } from '@/assets/images/sidebar/bookings.svg';
import { ReactComponent as DashboardIcon } from '@/assets/images/sidebar/dashboard.svg';
import { ReactComponent as EconomyIcon } from '@/assets/images/sidebar/economy.svg';
import { ReactComponent as SettingsIcon } from '@/assets/images/sidebar/settings.svg';
import { ReactComponent as SysAdminIcon } from '@/assets/images/sidebar/sysadmin.svg';
import { ReactComponent as TicketsIcon } from '@/assets/images/sidebar/tickets.svg';
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
		name: 'System administration',
		ItemIcon: SysAdminIcon,
		path: `${PRIVATE_ROUTES.CONFIGURATION}`,
		permission: 'VIEW_CONFIGURATION',
		end: true,
	},
	{
		name: 'Dashboard',
		ItemIcon: DashboardIcon,
		path: PRIVATE_ROUTES.DASHBOARD,
		end: true,
	},
	{
		name: 'Tours administration',
		ItemIcon: ToursIcon,
		path: PRIVATE_ROUTES.TOURS_ADMINISTRATION,
		childrens: [
			{
				name: 'Tour types',
				path: PRIVATE_ROUTES.TOURS_TYPES,
				permission: 'VIEW_TOURTYPE',
			},
			{
				name: 'All Tours',
				path: PRIVATE_ROUTES.TOURS,
				permission: 'VIEW_TOUR',
			},
			{
				name: 'Tour categories',
				path: `${PRIVATE_ROUTES.TOURS}/${PRIVATE_ROUTES.CATEGORIES}`,
				permission: 'VIEW_CATEGORY',
			},
			{
				name: 'Destinations',
				path: `${PRIVATE_ROUTES.TOURS}/${PRIVATE_ROUTES.LOCATIONS}`,
				permission: [
					'ADD_LOCATION',
					'CHANGE_LOCATION',
					'VIEW_LOCATION',
					'VIEW_COUNTRY',
					'VIEW_TERRITORY',
				],
			},
			{
				name: 'Accommodations',
				path: `${PRIVATE_ROUTES.TOURS}/${PRIVATE_ROUTES.ACCOMMODATIONS}`,
				permission: 'VIEW_ACCOMMODATION',
			},
			{
				name: 'Stations',
				path: `${PRIVATE_ROUTES.TOURS}/${PRIVATE_ROUTES.STATIONS}`,
				permission: ['VIEW_STATION', 'VIEW_STATIONTYPE'],
			},
			{
				name: 'Vehicles',
				path: `${PRIVATE_ROUTES.TOURS}/${PRIVATE_ROUTES.VEHICLES}`,
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
				name: 'Supplements',
				path: `${PRIVATE_ROUTES.TOURS}/${PRIVATE_ROUTES.SUPPLEMENTS}`,
				permission: 'VIEW_SUPPLEMENT',
				end: true,
			},
			{
				name: 'Supplement categories',
				path: `${PRIVATE_ROUTES.TOURS}/${PRIVATE_ROUTES.SUPPLEMENTS_CATEGORIES}`,
				permission: 'VIEW_SUPPLEMENTCATEGORY',
			},
			{
				name: 'Travel information',
				path: `${PRIVATE_ROUTES.TOURS}/${PRIVATE_ROUTES.TRAVEL_INFORMATION}`,
				permission: ['VIEW_TRAVELINFORMATIONTYPE', 'VIEW_TRAVELINFORMATIONTYPE'],
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
		name: 'Economy',
		ItemIcon: EconomyIcon,
		path: `${PRIVATE_ROUTES.ECONOMY}`,
		childrens: [
			{
				name: 'Accounting configure',
				path: `${PRIVATE_ROUTES.ECONOMY}/${PRIVATE_ROUTES.ACCOUNTING_CONFIGURE}`,
				permission: 'VIEW_ACCOUNTINGSERVICEPROVIDERCONFIGURATION',
			},
			{
				name: 'Currencies',
				path: `${PRIVATE_ROUTES.ECONOMY}/${PRIVATE_ROUTES.CURRENCIES}`,
				permission: [
					'VIEW_CURRENCY',
					'ADD_CURRENCYCONVERSION',
					'CHANGE_CURRENCYCONVERSION',
					'VIEW_CURRENCYCONVERSION',
				],
			},
		],
	},
	{
		name: 'Ticket management',
		ItemIcon: TicketsIcon,
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
				name: 'Email Configure',
				path: `${PRIVATE_ROUTES.SETTINGS}/${PRIVATE_ROUTES.EMAIL_CONFIGURE}`,
				permission: 'VIEW_EMAILPROVIDERCONFIGURATION',
			},
			{
				name: 'Payment Configure',
				path: `${PRIVATE_ROUTES.SETTINGS}/${PRIVATE_ROUTES.PAYMENT_CONFIGURE}`,
				permission: 'VIEW_PAYMENTMETHODCONFIGURATION',
			},
		],
	},
];
