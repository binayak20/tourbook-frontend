import { Typography } from '@/components/atoms';
import { routeNavigate } from '@/routes/utils';
import { Col, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { StatusColumn } from './StatusColumn';

export type DataType = {
	key: React.Key;
	name: string;
	email: string;
	role: 'Super Admin' | 'Sales' | 'Customer';
	last_login: string;
	status: 'Active' | 'Inactive';
};

const dataSource: DataType[] = [
	{
		key: '1',
		name: 'More Sailing',
		email: 'gustav.segling@gmail.com',
		role: 'Super Admin',
		last_login: 'a year ago',
		status: 'Active',
	},
	{
		key: '2',
		name: 'Mehedi Sharif',
		email: 'mehedi@strativ.se',
		role: 'Customer',
		last_login: '2 months ago',
		status: 'Inactive',
	},
];

export const Users = () => {
	const { t } = useTranslation();

	const columns: ColumnsType<DataType> = [
		{
			title: t('Name'),
			dataIndex: 'name',
			key: 'name',
			render: (text, record) =>
				record.role === 'Super Admin' ? (
					<Link to={routeNavigate('USERS_UPDATE', `${record.key}`)}>{text}</Link>
				) : (
					text
				),
		},
		{ title: t('Email'), dataIndex: 'email', key: 'email' },
		{ title: t('Role'), dataIndex: 'role', key: 'role' },
		{ title: t('Last login'), dataIndex: 'last_login', key: 'last_login' },
		{
			title: t('Status'),
			key: 'status',
			render: (_, record) => <StatusColumn {...record} />,
		},
	];

	return (
		<Row>
			<Col span={24} className='margin-4-bottom'>
				<Row align='middle'>
					<Col span={12}>
						<Typography.Title level={4} type='primary' className='margin-0'>
							{t('Users')}
						</Typography.Title>
					</Col>
					<Col span={12} style={{ textAlign: 'right' }}>
						<Link className='ant-btn ant-btn-primary ant-btn-lg' to={routeNavigate('USERS_CREATE')}>
							{t('Create user')}
						</Link>
					</Col>
				</Row>
			</Col>

			<Col span={24}>
				<Table dataSource={dataSource} columns={columns} />
			</Col>
		</Row>
	);
};
