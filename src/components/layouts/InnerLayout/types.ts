import { translationKeys } from '@/config/translate/i18next';

export type MenuItem = {
	name: translationKeys;
	path: string;
	childrens?: MenuItem[];
	permission?: string | string[];
};
