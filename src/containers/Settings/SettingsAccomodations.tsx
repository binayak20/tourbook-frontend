import { StatusColumn } from '@/components/StatusColumn';
import { settingsAPI } from '@/libs/api';
import { PRIVATE_ROUTES } from '@/routes/paths';
import { Col, Pagination, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';

export const SettingsAccomodations: React.FC = () => {
	const { t } = useTranslation();
	const { data, isLoading } = useQuery('settings-accomodations', () =>
		settingsAPI.accommodations()
	);
	const airportsList = useMemo(() => {
		if (data?.results) return data?.results;
		return [];
	}, [data]);

	const columns: ColumnsType<API.Accomodation> = [
		{
			title: t('Name'),
			dataIndex: 'name',
			render: (text, record) => <Link to={`${record.id}`}>{text}</Link>,
		},
		{
			title: t('Address'),
			dataIndex: 'address',
			ellipsis: true,
		},
		{
			title: t('Description'),
			dataIndex: 'description',
			ellipsis: true,
		},
		{
			title: t('Website'),
			dataIndex: 'website_url',
			ellipsis: true,
		},
		{
			title: t('Status'),
			dataIndex: 'status',
			width: 150,
			render: (_, record) => {
				return (
					<StatusColumn
						status={record?.is_active}
						id={record.id}
						endpoint={PRIVATE_ROUTES.ACCOMODATIONS}
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
						{t('Create Accomodation')}
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
