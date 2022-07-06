import { StatusColumn } from '@/components/StatusColumn';
import { settingsAPI } from '@/libs/api';
import { PRIVATE_ROUTES } from '@/routes/paths';
import { Col, Pagination, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';

import { Link } from 'react-router-dom';

export const SettingsTerritories = () => {
	const { t } = useTranslation();

	const { data, isLoading } = useQuery('settings-locations-territories', () =>
		settingsAPI.territories()
	);

	const territoryList = useMemo(() => {
		if (data?.results) return data?.results;
		return [];
	}, [data]);

	const columns: ColumnsType<API.Territory> = [
		{
			title: t('Name'),
			dataIndex: 'name',
			render: (text, record) => <Link to={`${record.id}`}>{text}</Link>,
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
						endpoint={PRIVATE_ROUTES.LOCATIONS_TERRITORY}
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
						{t('Create Territory')}
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
					dataSource={territoryList}
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
