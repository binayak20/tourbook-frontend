import { ReactComponent as DashboardIcon } from '@/assets/images/sidebar/dashboard.svg';
import { ReactComponent as ReportsIcon } from '@/assets/images/sidebar/reports.svg';
import { ReactComponent as SettingsIcon } from '@/assets/images/sidebar/settings.svg';
import { ReactComponent as TicketsIcon } from '@/assets/images/sidebar/tickets.svg';
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
		name: 'Tickets',
		ItemIcon: TicketsIcon,
		path: PRIVATE_ROUTES.TICKETS,
		childrens: [
			{
				name: 'Locations',
				path: PRIVATE_ROUTES.TICKETS_LOCATIONS,
			},
			{
				name: 'Suppliers',
				path: PRIVATE_ROUTES.TICKETS_SUPPLIERS,
			},
		],
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
				name: 'Users List',
				path: `${PRIVATE_ROUTES.SETTINGS}/${PRIVATE_ROUTES.USERS_LIST}`,
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
