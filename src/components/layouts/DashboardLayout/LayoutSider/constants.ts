import { ReactComponent as DashboardIcon } from '@/assets/images/sidebar/dashboard.svg';
import { ReactComponent as ReportsIcon } from '@/assets/images/sidebar/reports.svg';
import { ReactComponent as SettingsIcon } from '@/assets/images/sidebar/settings.svg';
import { ReactComponent as TicketsIcon } from '@/assets/images/sidebar/tickets.svg';
import { ReactComponent as TransactionsIcon } from '@/assets/images/sidebar/transactions.svg';
import { translationKeys } from '@/config/translate/i18next';
import { routeNavigate } from '@/routes/utils';

export type MenuItem = {
	name: translationKeys;
	path: string;
	ItemIcon?: React.FC<React.SVGProps<SVGSVGElement>>;
	childrens?: MenuItem[];
};

export const MENU_ITEMS: MenuItem[] = [
	{
		name: 'Dashboard',
		ItemIcon: DashboardIcon,
		path: routeNavigate('DASHBOARD'),
	},
	// {
	// 	name: 'Users',
	// 	ItemIcon: UserIcon,
	// 	path: routeNavigate('USERS'),
	// 	childrens: [
	// 		{
	// 			name: 'All users',
	// 			path: routeNavigate('USERS'),
	// 		},
	// 		{
	// 			name: 'Create user',
	// 			path: routeNavigate('USERS_CREATE'),
	// 		},
	// 	],
	// },
	{
		name: 'Tickets',
		ItemIcon: TicketsIcon,
		path: routeNavigate('TICKETS'),
		childrens: [
			{
				name: 'Locations',
				path: routeNavigate('TICKETS_LOCATIONS'),
			},
			{
				name: 'Suppliers',
				path: routeNavigate('TICKETS_SUPPLIERS'),
			},
		],
	},
	{
		name: 'Transactions',
		ItemIcon: TransactionsIcon,
		path: routeNavigate('TRANSACTIONS'),
	},
	{
		name: 'Reports',
		ItemIcon: ReportsIcon,
		path: routeNavigate('REPORTS'),
	},
	{
		name: 'Settings',
		ItemIcon: SettingsIcon,
		path: routeNavigate('SETTINGS_EXACT'),
		childrens: [
			{
				name: 'Airports',
				path: routeNavigate('SETTINGS_AIRPORTS'),
			},
			// {
			// 	name: 'Roles',
			// 	path: routeNavigate('SETTINGS_ROLES'),
			// },
		],
	},
];
