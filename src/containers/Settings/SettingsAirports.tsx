import { StatusColumn } from '@/components/StatusColumn';
import { settingsAPI } from '@/libs/api';
import { PRIVATE_ROUTES } from '@/routes/paths';
import { routeNavigate } from '@/routes/utils';
import { Col, Pagination, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';

export type DataType = {
	id: number;
	name: string;
	description: string;
	airport_code: string;
	is_active: boolean;
};
export const SettingsAirports: React.FC = () => {
	const { t } = useTranslation();
	const { data } = useQuery('settings-airports', () => settingsAPI.airports());
	const airportsList = useMemo(() => {
		if (data?.data?.results) return data?.data?.results;
		return [];
	}, [data]);

	const columns: ColumnsType<DataType> = [
		{
			title: t('Name'),
			dataIndex: 'name',
			render: (text, record) => (
				<Link to={routeNavigate(['SETTINGS', 'AIRPORTS', 'UPDATE'], `${record.id}`)}>{text}</Link>
			),
		},
		{
			title: t('Description'),
			dataIndex: 'description',
		},
		{
			title: t('Code'),
			dataIndex: 'airport_code',
		},
		{
			title: t('Status'),
			dataIndex: 'status',
			render: (_, record) => {
				return (
					<StatusColumn
						status={record?.is_active}
						id={record.id}
						endpoint={PRIVATE_ROUTES.AIRPORTS}
					/>
				);
			},
		},
	];
	return (
		<div style={{ display: 'flex', height: '100%', flexDirection: 'column', gap: '1rem' }}>
			<Row align='middle' justify='end'>
				<Col>
					<Link
						className='ant-btn ant-btn-primary ant-btn-lg'
						to={routeNavigate(['SETTINGS', 'AIRPORTS', 'CREATE'])}
					>
						{t('Create Airport')}
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
					dataSource={airportsList}
					columns={columns}
					rowKey='id'
					pagination={false}
					scroll={{ y: '100%' }}
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
