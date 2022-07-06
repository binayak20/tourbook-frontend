import { StatusColumn } from '@/components/StatusColumn';
import { settingsAPI } from '@/libs/api';
import { PRIVATE_ROUTES } from '@/routes/paths';
import { Col, Pagination, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';

import { Link } from 'react-router-dom';

export const SettingsLocations = () => {
	const { t } = useTranslation();
	const { data, isLoading } = useQuery('settings-locations', () => settingsAPI.locations());
	const { data: territories } = useQuery('settings-locations-territory', () =>
		settingsAPI.territories()
	);
	const territoryList = useMemo(() => territories?.results, [territories]);
	const locationList = useMemo(() => {
		if (data?.results) return data?.results;
		return [];
	}, [data]);

	const columns: ColumnsType<API.Location> = [
		{
			title: t('Name'),
			dataIndex: 'name',
			render: (text, record) => <Link to={`${record.id}`}>{text}</Link>,
		},
		{
			title: t('Territory'),
			dataIndex: 'parent',
			render: (_, record) =>
				territoryList?.find((territory: API.Territory) => territory.id === record.territory)?.name,
		},
		{
			title: t('Status'),
			dataIndex: 'status',
			width: 200,
			render: (_, record) => {
				return (
					<StatusColumn
						status={record?.is_active}
						id={record.id}
						endpoint={PRIVATE_ROUTES.LOCATIONS}
					/>
				);
			},
		},
	];
	return (
		<div style={{ display: 'flex', height: '100%', flexDirection: 'column', gap: '1rem' }}>
			<Row align='middle' justify='end'>
				<Col>
					<Link className='ant-btn ant-btn-primary ant-btn-lg' to={`${PRIVATE_ROUTES.CREATE}`}>
						{t('Create Location')}
					</Link>
				</Col>
			</Row>
			<div
				style={{
					maxWidth: '100%',
					minHeight: '1px',
				}}
			>
				<Table
					dataSource={locationList}
					columns={columns}
					rowKey='id'
					pagination={false}
					scroll={{ y: '100%' }}
					loading={isLoading}
				/>
			</div>
			<Row align='middle' justify='end'>
				<Col>
					<Pagination />
				</Col>
			</Row>
		</div>
	);
};
