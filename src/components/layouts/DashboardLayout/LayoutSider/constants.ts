import { ReactComponent as DashboardIcon } from '@/assets/images/sidebar/dashboard.svg';
import { ReactComponent as SettingsIcon } from '@/assets/images/sidebar/settings.svg';
import { routeNavigate } from '@/routes';

export type MenuItem = {
	name: string;
	path: string;
	ItemIcon?: React.FC<React.SVGProps<SVGSVGElement>>;
	childrens?: MenuItem[];
};

export const MENU_ITEMS: MenuItem[] = [
	{
		name: 'Dashboard',
		ItemIcon: DashboardIcon,
		path: routeNavigate('dashboard'),
	},
	{
		name: 'Users',
		ItemIcon: SettingsIcon,
		path: routeNavigate('dashboard/users'),
		childrens: [
			{
				name: 'All users',
				path: routeNavigate('dashboard/users'),
			},
			{
				name: 'Create user',
				path: routeNavigate('dashboard/users/create'),
			},
			{
				name: 'Roles',
				path: routeNavigate('dashboard/users/roles'),
			},
		],
	},
	{
		name: 'Settings',
		ItemIcon: SettingsIcon,
		path: '/dashboard/settings',
		childrens: [
			{
				name: 'Profile',
				path: routeNavigate('dashboard/settings/profile'),
			},
			{
				name: 'Change password',
				path: routeNavigate('dashboard/settings/change-password'),
			},
		],
	},
];
