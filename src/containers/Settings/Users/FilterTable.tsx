/* eslint-disable @typescript-eslint/no-explicit-any */
import SearchComponent, { Field } from '@/components/SearchComponent';
import { useTranslation } from 'react-i18next';

export const FilterTable = () => {
	const { t } = useTranslation();

	const searchFields: Field[] = [
		{
			type: 'input',
			name: 'email',
			param: 'email',
			defaultValue: undefined,
			placeholder: t('Search by email'),
		},
		{
			type: 'input',
			name: 'name',
			param: 'name',
			defaultValue: undefined,
			placeholder: t('Search by name'),
		},
		{
			type: 'switch',
			name: 'is_passenger',
			param: 'is_passenger',
			defaultValue: null,
			value: true,
			placeholder: t('Passenger'),
		},
	];

	return <SearchComponent fields={searchFields} />;
};
