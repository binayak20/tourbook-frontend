import { ReactComponent as BookingsIcon } from '@/assets/images/sidebar/bookings.svg';
import { ReactComponent as DashboardIcon } from '@/assets/images/sidebar/dashboard.svg';
import { ReactComponent as ReportsIcon } from '@/assets/images/sidebar/reports.svg';
import { ReactComponent as SettingsIcon } from '@/assets/images/sidebar/settings.svg';
import { ReactComponent as TourTypesIcon } from '@/assets/images/sidebar/tour-type.svg';
import { ReactComponent as ToursIcon } from '@/assets/images/sidebar/tours.svg';
import { ReactComponent as TransactionsIcon } from '@/assets/images/sidebar/transactions.svg';
import { translationKeys } from '@/config/translate/i18next';
import { PRIVATE_ROUTES } from '@/routes/paths';

export type MenuItem = {
	name: translationKeys;
	path: string;
	ItemIcon?: React.FC<React.SVGProps<SVGSVGElement>>;
	childrens?: MenuItem[];
	permission?: string | string[];
};

export const MENU_ITEMS: MenuItem[] = [
	{
		name: 'Dashboard',
		ItemIcon: DashboardIcon,
		path: PRIVATE_ROUTES.DASHBOARD,
	},
	{
		name: 'Tour types',
		ItemIcon: TourTypesIcon,
		path: '/tour-types',
		childrens: [
			{
				name: 'Boats',
				path: '/tour-types/boats',
			},
			{
				name: 'Supplements',
				path: '/tour-types/supplements',
			},
			{
				name: 'Coupons',
				path: '/tour-types/coupons',
			},
		],
	},
	{
		name: 'Tours',
		ItemIcon: ToursIcon,
		path: '/tours',
	},
	{
		name: 'Bookings',
		ItemIcon: BookingsIcon,
		path: '/bookings',
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
				path: `${PRIVATE_ROUTES.SETTINGS}/${PRIVATE_ROUTES.LOCATIONS_SETTINGS}`,
			},
			{
				name: 'Currencies',
				path: PRIVATE_ROUTES.SETTINGS_CURRENCIES,
			},
			{
				name: 'Accomodations',
				path: `${PRIVATE_ROUTES.SETTINGS}/${PRIVATE_ROUTES.ACCOMODATIONS}`,
			},
			{
				name: 'Airports',
				path: `${PRIVATE_ROUTES.SETTINGS}/${PRIVATE_ROUTES.AIRPORTS}`,
			},
		],
	},
];
