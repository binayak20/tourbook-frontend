/* eslint-disable @typescript-eslint/no-explicit-any */
import SearchComponent, { Field } from '@/components/SearchComponent';
import { useTranslation } from 'react-i18next';

export const FilterTable = () => {
	const { t } = useTranslation();

	const searchFields: Field[] = [
		{
			type: 'input',
			name: 'coupon_code',
			param: 'coupon_code',
			defaultValue: undefined,
			placeholder: t('Search by code'),
		},
		{
			type: 'date-range',
			name: 'validity',
			param: ['coupon_valid_form', 'coupon_valid_to'],
			defaultValue: undefined,
			placeholder: [t('Valid from'), t('Valid to')],
		},
	];

	return <SearchComponent fields={searchFields} />;
};
