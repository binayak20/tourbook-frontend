import config from '@/config';
import dayjs from 'dayjs';

export const LANGUAGE_OPTIONS = {
	en: 'EN',
	sv: 'SV',
};

export const USER_ROLES = [
	{
		id: 1,
		label: 'Super Admin',
		value: 'super_admin',
	},
	{
		id: 2,
		label: 'Sales',
		value: 'sales',
	},
	{
		id: 3,
		label: 'Customer',
		value: 'customer',
	},
];

export const NAME_INITIALS = [
	{ id: 1, label: 'Mr.', value: 'mr' },
	{ id: 2, label: 'Mrs.', value: 'mrs' },
	{ id: 3, label: 'Ms.', value: 'ms' },
];

export const GENDER_OPTIONS = [
	{ id: 1, label: 'Male', value: 'male' },
	{ id: 2, label: 'Female', value: 'female' },
	{ id: 3, label: 'Others', value: 'others' },
];

export const DEFAULT_LIST_PARAMS = {
	page: 1,
	limit: config.itemsPerPageMax,
};

export const BOOKING_USER_TYPES = [
	{ label: 'Individual', value: 'individual' },
	// { label: 'Business', value: 'business' },
];

export const DEFAULT_CURRENCY_ID = 2;

export const DEFAULT_PICKER_VALUE = dayjs('1990-01-01', 'YYYY-MM-DD');

export const TRANSACTION_TYPES = {
	MANUAL_PAYMENT: 'Manual Payment',
	INVOICE_PAYMENT: 'Invoice Payment',
	REFUND_PAYMENT: 'Refund Payment',
};

export const NO_TRANSFER_ID = 1;
