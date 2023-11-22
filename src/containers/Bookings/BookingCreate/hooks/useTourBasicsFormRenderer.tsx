import { Typography } from '@/components/atoms';
import config from '@/config';
import { fortnoxAPI, toursAPI } from '@/libs/api';
import { DEFAULT_LIST_PARAMS } from '@/utils/constants';
import { Col, Row } from 'antd';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { useQueries } from 'react-query';

export const useTourBasicsFormRenderer = (currency_code?: string) => {
	const [
		{ data: tours, isLoading: isToursLoading, refetch: refetchTours },
		{ data: fortnoxProjects, isLoading: isFortnoxProjectsLoading },
	] = useQueries([
		{
			queryKey: ['tours', currency_code],
			queryFn: () =>
				currency_code
					? toursAPI.listMc({
							...DEFAULT_LIST_PARAMS,
							remaining_capacity: 1,
							is_active: true,
							currency_code,
					  })
					: undefined,
		},
		{
			queryKey: ['fortnoxProjects'],
			queryFn: () => fortnoxAPI.projects({ ...DEFAULT_LIST_PARAMS, is_active: true }),
		},
	]);

	const tourOptions = useMemo(
		() =>
			isToursLoading
				? []
				: tours?.results.map(({ id, name, departure_date, remaining_capacity, capacity }) => ({
						value: id,
						label: (
							<Typography.Text style={{ fontSize: 15 }}>
								{name} - {dayjs(departure_date).format(config.dateFormatReadable)} (
								{remaining_capacity}/{capacity})
							</Typography.Text>
						),
				  })) || [],
		[tours, isToursLoading]
	);

	const fortnoxProjectOptions = useMemo(
		() =>
			fortnoxProjects?.results.map(({ id, project_number, description }) => ({
				value: id,
				label: (
					<Row>
						<Col span={12}>{description}</Col>
						<Col span={12}>{project_number}</Col>
					</Row>
				),
			})) || [],
		[fortnoxProjects]
	);

	return {
		tours: tours?.results || [],
		tourOptions,
		fortnoxProjectOptions,
		isToursLoading,
		isFortnoxProjectsLoading,
		refetchTours,
	};
};
