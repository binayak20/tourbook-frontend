import i18next from 'i18next';
import I18NextHttpBackend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';
import config from '../config';
import { IWidgetCofig } from '../types';
import { TWidgetState } from './WidgetContext';

export const resolveConfig = (config: IWidgetCofig) => {
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
				loadPath: `${adminURL}/widget/locales/{{lng}}/translationWidget.json`,
			},
		});
};

export const getQueryParams = (state: Partial<TWidgetState>, pagination?: boolean) => {
	type TWidgetStateKeys = (keyof TWidgetState)[];
	const filters: TWidgetStateKeys = [
		'category',
		'departure_date',
		'remaining_capacity',
		'country',
		'location',
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

export const destructDestination = (destination?: string | null) => {
	if (!destination) return {};
	const [countryId, locationId] = destination.split('-');
	return {
		countryId: countryId ? Number(countryId) : undefined,
		locationId: locationId ? Number(locationId) : undefined,
	};
};

export const getStateFromQueryParams = (searchParams: URLSearchParams) => {
	return {
		widget_screen: searchParams.get('widget_screen') as TWidgetState['widget_screen'],
		category: Number(searchParams.get('category')) || null,
		location: Number(searchParams.get('location')) || null,
		country: Number(searchParams.get('country')) || null,
		destination: searchParams.get('destination') || null,
		departure_date: searchParams.get('departure_date') || null,
		remaining_capacity: searchParams.get('remaining_capacity') || '1',
		selected_tour: searchParams.get('selected_tour') || null,
		page: Number(searchParams.get('page')) || 1,
		limit: Number(searchParams.get('limit')) || config.ITEMS_PER_PAGE,
	};
};

export const transformString = (str: string) =>
	str.replace(/_/g, ' ').replace(/\b\w/g, (match) => match.toUpperCase());

export const setSearchParams = (state: TWidgetState, url: URL) => {
	const { searchParams } = url;
	Object.keys(state).forEach((key) => {
		const stateKey = key as keyof typeof state;
		if (state[stateKey] !== undefined && state[stateKey] !== null && state[stateKey] !== '')
			searchParams.set(stateKey, state[stateKey] as string);
		else searchParams.delete(stateKey);
	});
};

export const isPerPerson = (suppement: API.Tour['supplements'][number]) => {
	const unitParts = suppement.unit_type?.split('_');
	return unitParts?.includes('person');
};

export const getSupplementMultiplier = (
	suppement?: API.Tour['supplements'][number],
	tourDetails?: API.Tour
) => {
	let multiplier = 1;
	const unitParts = suppement?.unit_type?.split('_');
	const multiplerMap: { [key: string]: number } = {
		week: (tourDetails?.duration || 7) / 7,
		day: tourDetails?.duration || 1,
		night: tourDetails?.duration || 1,
	};
	Object.keys(multiplerMap).forEach((key) => {
		if (unitParts?.includes(key)) multiplier = multiplerMap[key];
	});
	return multiplier;
};
