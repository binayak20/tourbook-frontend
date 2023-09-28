import { useTranslation } from 'react-i18next';

import { supplementsAPI } from '@/libs/api';
import { useMemo } from 'react';
import { useQueries } from 'react-query';
import SearchComponent, { Field } from '../../components/SearchComponent';

export const FilterSuppliment = () => {
	const { t } = useTranslation();
	enum unit_type {
		per_booking = 'per_booking',
		per_day = 'per_day',
		per_week = 'per_week',
		per_night = 'per_night',
		per_booking_person = 'per_booking_person',
		per_day_person = 'per_day_person',
		per_week_person = 'per_week_person',
		per_night_person = 'per_night_person',
		all = '',
	}

	const unitOptions = [
		{ value: unit_type.all, label: t('All') },
		{ value: unit_type.per_booking, label: t('Per Booking') },
		{ value: unit_type.per_day, label: t('Per Day') },
		{ value: unit_type.per_week, label: t('Per Week') },
		{ value: unit_type.per_night, label: t('Per Night') },
		{ value: unit_type.per_booking_person, label: t('Per Booking Person') },
		{ value: unit_type.per_day_person, label: t('Per Day Person') },
		{ value: unit_type.per_week_person, label: t('Per Week Person') },
		{ value: unit_type.per_night_person, label: t('Per Night Person') },
	];

	const [{ data: suplimentCategoriesList }] = useQueries([
		{
			queryKey: ['suplimentList'],
			queryFn: () => supplementsAPI.categoriesList(),
		},
	]);

	const supplimentCategoryOptions = useMemo(() => {
		return (suplimentCategoriesList || []).map((category) => {
			return { value: category.id, label: category.name };
		});
	}, [suplimentCategoriesList]);

	const searchFields: Field[] = [
		{ type: 'input', name: 'name', placeholder: t('Search by name') },
		{
			type: 'select',
			name: 'supplement_category',
			placeholder: t('Select category'),
			options: supplimentCategoryOptions,
		},
		{
			type: 'select',
			name: 'unit_type',
			placeholder: t('Select unit type'),
			options: unitOptions,
		},
	];
	return <SearchComponent fields={searchFields} />;
};
