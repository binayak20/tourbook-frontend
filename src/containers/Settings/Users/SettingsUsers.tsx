import { Typography } from '@/components/atoms';
import { StatusColumn } from '@/components/StatusColumn';
import config from '@/config';
import { usersAPI } from '@/libs/api';
import { PRIVATE_ROUTES } from '@/routes/paths';
import { readableText } from '@/utils/helpers';
import { Button, Col, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SettingsUserCreate } from './SettingsUserCreate';
import { SettingsUserUpdate } from './SettingsUserUpdate';

export const SettingsUsers: React.FC = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const [updateId, setUpdateId] = useState<number>();
	const [isCreateModal, setCreateModal] = useState(false);
	const [isUpdateModal, setUpdateModal] = useState(false);

	const currentPage = useMemo(() => parseInt(searchParams.get('page') || '1'), [searchParams]);

	const { data, isLoading } = useQuery(['settings-user', currentPage], () =>
		usersAPI.users(currentPage)
	);

	const usersList = useMemo(() => {
		if (data?.results) return data?.results;
		return [];
	}, [data]);

	const handlePageChange = useCallback(
		(page: number) => {
			navigate(page > 1 ? `?page=${page}` : '');
		},
		[navigate]
	);

	const columns: ColumnsType<API.User> = [
		{
			title: t('Name'),
			dataIndex: 'first_name',
			width: 250,
			ellipsis: true,
			render: (_, record) => {
				const fullName = `${record.first_name} ${record.last_name}`;

				return (
					<Button
						type='link'
						onClick={() => {
							setUpdateId(record.id);
							setUpdateModal(true);
						}}
					>
						{fullName}
					</Button>
				);
			},
		},
		{ title: t('Email'), width: 200, ellipsis: true, dataIndex: 'email' },
		{
			title: t('Role'),
			dataIndex: 'groups_details',
			width: 200,
			ellipsis: true,
			render: (groups_details: API.User['groups_details']) => {
				return groups_details.map(({ name }) => readableText(name)).join(', ');
			},
		},
		{
			title: t('Last Login'),
			dataIndex: 'last_login',
			width: 200,
			ellipsis: true,
			render: (last_login) => {
				if (last_login) {
					return moment(new Date(last_login), 'YYYYMMDD').fromNow();
				}

				return '-';
			},
		},
		{
			title: t('Status'),
			dataIndex: 'status',
			width: 150,
			render: (_, record) => {
				return (
					<StatusColumn status={record?.is_active} id={record.id} endpoint={PRIVATE_ROUTES.USERS} />
				);
			},
		},
	];
	return (
		<div style={{ display: 'flex', height: '100%', flexDirection: 'column', gap: '1rem' }}>
			<Row align='middle' justify='space-between'>
				<Col span={12}>
					<Typography.Title level={4} type='primary' className='margin-0'>
						{t('Users')}
					</Typography.Title>
				</Col>
				<Col>
					<Button type='primary' size='large' onClick={() => setCreateModal(true)}>
						{t('Create User')}
					</Button>
					<SettingsUserCreate isVisible={isCreateModal} setVisible={setCreateModal} />
					{updateId && (
						<SettingsUserUpdate
							clearId={() => setUpdateId(undefined)}
							id={updateId}
							isVisible={isUpdateModal}
							setVisible={setUpdateModal}
						/>
					)}
				</Col>
			</Row>
			<div
				style={{
					maxWidth: '100%',
					minHeight: '1px',
				}}
			>
				<Table
					dataSource={usersList}
					columns={columns}
					rowKey='id'
					pagination={{
						pageSize: config.itemsPerPage,
						current: currentPage,
						total: data?.count,
						onChange: handlePageChange,
					}}
					scroll={{ y: '100%' }}
					loading={isLoading}
				/>
			</div>
		</div>
	);
};
