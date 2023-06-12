import i18next from 'i18next';
import I18NextHttpBackend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';
import { WidgetCofig } from '../types';
import { TWidgetState } from './WidgetContext';

export const resolveConfig = (config: WidgetCofig) => {
	if (!config.container) {
		throw new Error('Missing widget container');
	}
	if (!config.adminURL) {
		throw new Error('Missing adminURL');
	}
	if (!config.locale) {
		console.warn('Missing locale, using fallback: sv');
	}
	if (!config.primaryColor) {
		console.warn('No primary color detected');
	}
};

export const initI18n = async (locale: string, adminURL: string) => {
	await i18next
		.use(I18NextHttpBackend)
		.use(initReactI18next)
		.init({
			lng: locale,
			fallbackLng: 'sv',
			debug: false,
			interpolation: {
				escapeValue: false,
			},
			backend: {
				loadPath: `${adminURL}/widget/locales/{{lng}}/{{ns}}.json`,
			},
		});
};

export const getQueryParams = (state: TWidgetState, pagination?: boolean) => {
	type TWidgetStateKeys = (keyof TWidgetState)[];
	const filters: TWidgetStateKeys = [
		'departure_date',
		'remaining_capacity',
		'country',
		...(pagination ? (['page', 'limit'] as TWidgetStateKeys) : []),
	];
	let params = {};
	filters.forEach((filter) => {
		params = { ...params, [filter]: state[filter] };
	});
	return params;
};

export const currencyFormatter = (number: number, locale = 'sv-SE', currency = 'SEK') => {
	const formatter = new Intl.NumberFormat(locale, { style: 'currency', currency: currency });
	return formatter.format(number);
};
