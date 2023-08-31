import { DefaultOptionType } from 'antd/lib/select';

export * from './date.helper';
export * from './url.helper';
export * from './currency.helpers';

/**
 * Generates a rgba/rgb color string from a hex color string
 * @param hex Hex color string
 * @param alpha Alpha value
 * @returns rgba/rgb color string
 * @example
 * hexToRgba('#000000', 0.5) // returns rgba(0, 0, 0, 0.5)
 * hexToRgba('#000000') // returns rgb(0, 0, 0)
 * @example
 */
export const hexToRGB = (hex: string, alpha?: number) => {
	const r = parseInt(hex.slice(1, 3), 16);
	const g = parseInt(hex.slice(3, 5), 16);
	const b = parseInt(hex.slice(5, 7), 16);

	return alpha !== undefined ? `rgba(${r}, ${g}, ${b}, ${alpha})` : `rgb(${r}, ${g}, ${b})`;
};

export const readableText = (text: string) => {
	const textWithoutDash = text.replace(/-|_/g, ' ');
	return textWithoutDash.charAt(0).toUpperCase() + textWithoutDash.slice(1);
};

export const groupBy = <T>(
	array: T[],
	predicate: (value: T, index: number, array: T[]) => string
) =>
	array.reduce((acc, value, index, array) => {
		(acc[predicate(value, index, array)] ||= []).push(value);
		return acc;
	}, {} as { [key: string]: T[] });

export const selectFilterBy = (input: string, option: DefaultOptionType | undefined) => {
	const { children, label } = option as unknown as { children: string; label: string };
	return (children || label).toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

export const getColorForStatus = (status: string) => {
	switch (status) {
		case 'pending':
			return '#FFC107';
		case 'success':
			return '#4CAF50';
		case 'failed':
			return '#F44336';
		case 'booked':
			return '#4CAF50';
		case 'cancelled':
			return '#F44336';
		case 'transferred':
			return '#FFC107';
		default:
			return '#9E9E9E';
	}
};

export const formatCurrency = (amount: number) => {
	const isFractional = amount % 1 !== 0;

	return new Intl.NumberFormat('sv-SE', {
		style: 'currency',
		currency: 'SEK',
		currencyDisplay: 'code',
		maximumFractionDigits: isFractional ? 2 : 0,
	}).format(amount);
};

export const CheckForEmptyHtml = (value: string) => {
	if (value?.replace(/<(.|\n)*?>/g, '').trim().length === 0 && !value?.includes('<img')) {
		return null;
	} else return value;
};
