import { Switch, Typography } from '@/components/atoms';
import config from '@/config';
import { locationsAPI } from '@/libs/api';
import { DEFAULT_LIST_PARAMS } from '@/utils/constants';
import { Col, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const SettingsCountries = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const currentPage = useMemo(() => parseInt(searchParams.get('page') || '1'), [searchParams]);

	const { data: territories, isLoading: territoryListLoading } = useQuery('territories', () =>
		locationsAPI.territories(DEFAULT_LIST_PARAMS)
	);

	const { data: countries, isLoading: countryListLoading } = useQuery(
		['countries', currentPage],
		() => locationsAPI.countries({ page: currentPage })
	);

	const handlePageChange = useCallback(
		(page: number) => {
			navigate(page > 1 ? `?page=${page}` : '');
		},
		[navigate]
	);

	const columns: ColumnsType<API.Country> = [
		{
			title: t('Name'),
			dataIndex: 'name',
			ellipsis: true,
		},
		{
			title: t('Territory'),
			dataIndex: 'territory',
			ellipsis: true,
			render: (value: number) =>
				territories?.results?.find((territory) => territory.id === value)?.name,
		},
		{
			title: t('Status'),
			dataIndex: 'is_active',
			width: '120px',
			render: (value) => (
				<Switch
					custom
					checked={value}
					disabled
					checkedChildren={t('On')}
					unCheckedChildren={t('Off')}
				/>
			),
		},
	];
	return (
		<div style={{ display: 'flex', height: '100%', flexDirection: 'column', gap: '1rem' }}>
			<Row align='middle'>
				<Col span={12}>
					<Typography.Title level={4} type='primary' className='margin-0'>
						{t('Countries')}
					</Typography.Title>
				</Col>
			</Row>
			<div
				style={{
					maxWidth: '100%',
					minHeight: '1px',
				}}
			>
				<Table
					dataSource={countries?.results}
					columns={columns}
					rowKey='id'
					scroll={{ y: '100%' }}
					loading={countryListLoading && territoryListLoading}
					pagination={{
						pageSize: config.itemsPerPage,
						total: countries?.count,
						current: currentPage,
						onChange: handlePageChange,
					}}
				/>
			</div>
		</div>
	);
};
