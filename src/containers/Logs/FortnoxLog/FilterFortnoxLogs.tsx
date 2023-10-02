import { fortnoxAPI } from '@/libs/api';
import { DEFAULT_LIST_PARAMS } from '@/utils/constants';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueries } from 'react-query';

import SearchComponent, { Field } from '../../../components/SearchComponent';

export const FilterFortnoxLogs = () => {
	const { t } = useTranslation();

	const [{ data: fortnoxEvents }] = useQueries([
		{
			queryKey: ['fortnox-events'],
			queryFn: () => fortnoxAPI.events(DEFAULT_LIST_PARAMS),
		},
	]);

	const paymentMethodOptions = useMemo(() => {
		return (fortnoxEvents?.results || []).map((event) => {
			return { value: event.name, label: event.name };
		});
	}, [fortnoxEvents]);

	const searchFields: Field[] = [
		{
			type: 'input',
			name: 'booking_reference',
			param: 'booking_reference',
			defaultValue: undefined,
			placeholder: t('Search by booking ref'),
		},
		{
			type: 'input',
			name: 'voucher_number',
			param: 'voucher_number',
			defaultValue: undefined,
			placeholder: t('Search by voucher number'),
		},
		{
			type: 'select',
			name: 'fortnox_event',
			param: 'fortnox_event',
			defaultValue: undefined,
			placeholder: t('Select fortnox event'),
			options: paymentMethodOptions,
		},
	];

	return <SearchComponent fields={searchFields} />;
};
