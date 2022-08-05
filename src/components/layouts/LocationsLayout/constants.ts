import { translationKeys } from '@/config/translate/i18next';
import { LOCATIONS_SETTINGS_ROUTES } from '@/pages/SettingsLocations/contstants';

export type MenuItem = {
	name: translationKeys;
	path: string;
	childrens?: MenuItem[];
	permission?: string | string[];
};

export const MENU_ITEMS: MenuItem[] = [
	{
		name: 'Territories',
		path: LOCATIONS_SETTINGS_ROUTES.TERRITORRIES,
	},
	{
		name: 'Locations',
		path: LOCATIONS_SETTINGS_ROUTES.LOCATIONS,
	},
];
