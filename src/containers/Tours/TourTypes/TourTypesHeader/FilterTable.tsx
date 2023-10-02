/* eslint-disable @typescript-eslint/no-explicit-any */
import SearchComponent, { Field } from '@/components/SearchComponent';
import { useTranslation } from 'react-i18next';

export const FilterTable = () => {
	const { t } = useTranslation();

	const searchFields: Field[] = [
		{
			type: 'input',
			name: 'name',
			param: 'name',
			defaultValue: undefined,
			placeholder: t('Search by name'),
		},
	];

	return <SearchComponent fields={searchFields} />;
};
