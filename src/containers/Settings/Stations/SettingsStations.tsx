import { Typography } from '@/components/atoms';
import config from '@/config';
import { stationsAPI } from '@/libs/api';
import { DEFAULT_LIST_PARAMS } from '@/utils/constants';
import { Col, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const SettingsStations = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const currentPage = useMemo(() => parseInt(searchParams.get('page') || '1'), [searchParams]);

	const { isLoading, data } = useQuery(['stations', currentPage], () =>
		stationsAPI.list({ page: currentPage })
	);

	const { data: stationTypes } = useQuery('station-types', () =>
		stationsAPI.types(DEFAULT_LIST_PARAMS)
	);

	const handlePageChange = useCallback(
		(page: number) => {
			navigate(page > 1 ? `?page=${page}` : '');
		},
		[navigate]
	);

	const columns: ColumnsType<API.Station> = [
		{
			title: t('Name'),
			dataIndex: 'name',
		},
		{
			title: t('Type'),
			dataIndex: 'station_type',
			render: (value) =>
				stationTypes?.results.find((stationType) => stationType.id === value)?.name,
		},
	];

	return (
		<Row>
			<Col span={24} className='margin-4-bottom'>
				<Row align='middle'>
					<Col span={6}>
						<Typography.Title noMargin level={4} type='primary'>
							{t('All stations')}
						</Typography.Title>
					</Col>
				</Row>
			</Col>

			<Col span={24}>
				<Table
					rowKey='id'
					loading={isLoading}
					columns={columns}
					dataSource={data?.results || []}
					pagination={{
						pageSize: config.itemsPerPage,
						current: currentPage,
						total: data?.count || 0,
						onChange: handlePageChange,
					}}
				/>
			</Col>
		</Row>
	);
};
