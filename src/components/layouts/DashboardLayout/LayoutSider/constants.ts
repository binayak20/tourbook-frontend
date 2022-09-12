import { ReactComponent as BookingsIcon } from '@/assets/images/sidebar/bookings.svg';
import { ReactComponent as DashboardIcon } from '@/assets/images/sidebar/dashboard.svg';
import { ReactComponent as ReportsIcon } from '@/assets/images/sidebar/reports.svg';
import { ReactComponent as SettingsIcon } from '@/assets/images/sidebar/settings.svg';
import { ReactComponent as SupplementsIcon } from '@/assets/images/sidebar/supplements.svg';
import { ReactComponent as ToursIcon } from '@/assets/images/sidebar/tours.svg';
import { ReactComponent as TransactionsIcon } from '@/assets/images/sidebar/transactions.svg';
import { translationKeys } from '@/config/translate/i18next';
import { PRIVATE_ROUTES } from '@/routes/paths';

export type MenuItem = {
	name: translationKeys;
	path: string;
	end?: boolean;
	ItemIcon?: React.FC<React.SVGProps<SVGSVGElement>>;
	childrens?: MenuItem[];
	permission?: string | string[];
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
				end: true,
			},
			{
				name: 'Tour types',
				path: PRIVATE_ROUTES.TOURS_TYPES,
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
				end: true,
			},
			{
				name: 'Categories',
				path: PRIVATE_ROUTES.SUPPLEMENTS_CATEGORIES,
			},
		],
	},
	{
		name: 'Bookings',
		ItemIcon: BookingsIcon,
		path: PRIVATE_ROUTES.BOOKINGS,
	},
	{
		name: 'Transactions',
		ItemIcon: TransactionsIcon,
		path: PRIVATE_ROUTES.TRANSACTIONS,
	},
	{
		name: 'Reports',
		ItemIcon: ReportsIcon,
		path: PRIVATE_ROUTES.REPORTS,
	},
	{
		name: 'Settings',
		ItemIcon: SettingsIcon,
		path: PRIVATE_ROUTES.SETTINGS,
		childrens: [
			{
				name: 'Configuration',
				path: `${PRIVATE_ROUTES.SETTINGS}/${PRIVATE_ROUTES.CONFIGURATION}`,
			},
			{
				name: 'Users',
				path: `${PRIVATE_ROUTES.SETTINGS}/${PRIVATE_ROUTES.USERS}`,
			},
			{
				name: 'User Roles',
				path: `${PRIVATE_ROUTES.SETTINGS}/${PRIVATE_ROUTES.USER_ROLES}`,
			},
			{
				name: 'Categories',
				path: `${PRIVATE_ROUTES.SETTINGS}/${PRIVATE_ROUTES.CATEGORIES}`,
			},
			{
				name: 'Locations',
				path: `${PRIVATE_ROUTES.SETTINGS}/${PRIVATE_ROUTES.LOCATIONS}`,
			},
			{
				name: 'Currencies',
				path: `${PRIVATE_ROUTES.SETTINGS}/${PRIVATE_ROUTES.CURRENCIES}`,
			},
			{
				name: 'Accommodations',
				path: `${PRIVATE_ROUTES.SETTINGS}/${PRIVATE_ROUTES.ACCOMMODATIONS}`,
			},
			{
				name: 'Stations',
				path: `${PRIVATE_ROUTES.SETTINGS}/${PRIVATE_ROUTES.STATIONS}`,
			},
			{
				name: 'Email Configure',
				path: `${PRIVATE_ROUTES.SETTINGS}/${PRIVATE_ROUTES.EMAIL_CONFIGURE}`,
			},
			{
				name: 'Payment Configure',
				path: `${PRIVATE_ROUTES.SETTINGS}/${PRIVATE_ROUTES.PAYMENT_CONFIGURE}`,
			},
			{
				name: 'Vehicles',
				path: `${PRIVATE_ROUTES.SETTINGS}/${PRIVATE_ROUTES.VEHICLES}`,
			},
		],
	},
];
