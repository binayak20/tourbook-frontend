/* eslint-disable @typescript-eslint/no-explicit-any */
import { locationsAPI } from '@/libs/api';
import { DEFAULT_LIST_PARAMS } from '@/utils/constants';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueries } from 'react-query';

import SearchComponent, { Field } from '../../../components/SearchComponent';

export const FilterTable = () => {
	const { t } = useTranslation();

	const [{ data: locations }] = useQueries([
		{
			queryKey: ['locations'],
			queryFn: () => locationsAPI.list(DEFAULT_LIST_PARAMS),
		},
	]);

	const locationsOptions = useMemo(() => {
		return (locations?.results || []).map(({ id, name }) => {
			return { value: id, label: name };
		});
	}, [locations]);

	const searchFields: Field[] = [
		{
			type: 'input',
			name: 'name',
			param: 'name',
			defaultValue: undefined,
			placeholder: t('Search by name'),
		},
		{
			type: 'select',
			name: 'location',
			param: 'location',
			defaultValue: undefined,
			placeholder: t('Locations'),
			options: locationsOptions,
		},
		{
			type: 'date-range',
			name: 'departure_dates',
			param: ['from_departure_date', 'to_departure_date'],
			defaultValue: undefined,
			placeholder: [t('Departure from'), t('Departure to')],
		},
		{
			type: 'switch',
			name: 'remaining_capacity',
			param: 'remaining_capacity',
			defaultValue: null,
			value: '1',
			placeholder: t('Filter by capacity'),
		},
	];

	return <SearchComponent fields={searchFields} />;
};
