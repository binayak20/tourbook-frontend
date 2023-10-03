import SearchComponent, { Field } from '@/components/SearchComponent';
import { paymentConfigsAPI } from '@/libs/api';
import { DEFAULT_LIST_PARAMS } from '@/utils/constants';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueries } from 'react-query';

export const FilterTransactions = () => {
	const { t } = useTranslation();

	const TRANSACTION_STATUS = [
		{ value: 'success', label: t('Success') },
		{ value: 'pending', label: t('Pending') },
	];

	const [{ data: paymentConfigurations, isLoading }] = useQueries([
		{
			queryKey: ['paymentConfigurations'],
			queryFn: () => paymentConfigsAPI.paymentConfigurations(DEFAULT_LIST_PARAMS),
		},
	]);

	const paymentMethodOptions = useMemo(() => {
		return (paymentConfigurations?.results || []).map((config) => {
			return { value: config.payment_method.id, label: config.payment_method.name };
		});
	}, [paymentConfigurations]);

	const searchFields: Field[] = [
		{
			type: 'input',
			name: 'name',
			param: 'name',
			defaultValue: undefined,
			placeholder: t('Search by customer name'),
		},
		{ type: 'input', name: 'booking_reference', placeholder: t('Search by booking ref') },
		{
			type: 'select',
			name: 'status',
			param: 'status',
			defaultValue: undefined,
			placeholder: t('Status'),
			options: TRANSACTION_STATUS,
		},
		{
			type: 'select',
			name: 'payment_method',
			param: 'payment_method',
			defaultValue: undefined,
			placeholder: t('Payment method'),
			options: paymentMethodOptions,
			isLoading: isLoading,
		},
	];

	return <SearchComponent fields={searchFields} />;
};
