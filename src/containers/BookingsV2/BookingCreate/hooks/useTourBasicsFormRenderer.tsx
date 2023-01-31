import { Typography } from '@/components/atoms';
import config from '@/config';
import { currenciesAPI, fortnoxAPI, toursAPI } from '@/libs/api';
import { DEFAULT_LIST_PARAMS } from '@/utils/constants';
import moment from 'moment';
import { useMemo } from 'react';
import { useQueries } from 'react-query';

export const useTourBasicsFormRenderer = () => {
	const [
		{ data: tours, isLoading: isToursLoading },
		{ data: currencies, isLoading: isCurrenciesLoading },
		{ data: fortnoxProjects, isLoading: isFortnoxProjectsLoading },
	] = useQueries([
		{
			queryKey: ['tours'],
			queryFn: () =>
				toursAPI.list({ ...DEFAULT_LIST_PARAMS, remaining_capacity: 1, is_active: true }),
		},
		{
			queryKey: ['currencies'],
			queryFn: () => currenciesAPI.list({ ...DEFAULT_LIST_PARAMS, is_active: true }),
		},
		{
			queryKey: ['fortnoxProjects'],
			queryFn: () => fortnoxAPI.projects({ ...DEFAULT_LIST_PARAMS, is_active: true }),
		},
	]);

	const tourOptions = useMemo(
		() =>
			tours?.results.map(({ id, name, departure_date, remaining_capacity, capacity }) => ({
				value: id,
				label: (
					<Typography.Text style={{ fontSize: 15 }}>
						{name} - {moment(departure_date).format(config.dateFormatReadable)} (
						{remaining_capacity}/{capacity})
					</Typography.Text>
				),
			})) || [],
		[tours]
	);

	const currencyOptions = useMemo(
		() =>
			currencies?.results.map(({ id, currency_code }) => ({
				value: id,
				label: currency_code,
			})) || [],
		[currencies]
	);

	const fortnoxProjectOptions = useMemo(
		() =>
			fortnoxProjects?.results.map(({ id, project_number }) => ({
				value: id,
				label: project_number,
			})) || [],
		[fortnoxProjects]
	);

	return {
		tours: tours?.results || [],
		tourOptions,
		currencyOptions,
		fortnoxProjectOptions,
		isToursLoading,
		isCurrenciesLoading,
		isFortnoxProjectsLoading,
	};
};
