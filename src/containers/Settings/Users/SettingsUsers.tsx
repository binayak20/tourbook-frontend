import { Typography } from '@/components/atoms';
import { StatusColumn } from '@/components/StatusColumn';
import config from '@/config';
import { usersAPI } from '@/libs/api';
import { PRIVATE_ROUTES } from '@/routes/paths';
import { getPaginatedParams, readableText } from '@/utils/helpers';
import { Button, Col, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import { useCallback, useMemo, useState } from 'react';
import { useAccessContext } from 'react-access-boundary';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FilterTable } from './FilterTable';
import { SettingsUserCreate } from './SettingsUserCreate';
import { SettingsUserUpdate } from './SettingsUserUpdate';

export const SettingsUsers: React.FC = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const [updateId, setUpdateId] = useState<number>();
	const [isCreateModal, setCreateModal] = useState(false);
	const [isUpdateModal, setUpdateModal] = useState(false);
	const { isAllowedTo } = useAccessContext();

	const { current, pageSize } = useMemo(() => {
		return {
			current: parseInt(searchParams.get('page') || '1'),
			pageSize: parseInt(searchParams.get('limit') || `${config.itemsPerPage}`),
		};
	}, [searchParams]);

	const userParams: API.UsersPragmas = useMemo(() => {
		return {
			page: current,
			limit: pageSize,
			email: searchParams.get('email') || '',
			name: searchParams.get('name') || '',
			is_passenger: searchParams.get('is_passenger') || '',
		};
	}, [current, searchParams, pageSize]);

	const { data, isLoading, refetch } = useQuery(['settings-users', userParams], () =>
		usersAPI.users(userParams)
	);

	const usersList = useMemo(() => {
		if (data?.results) return data?.results;
		return [];
	}, [data]);

	const handlePageChange = useCallback(
		(page: number, size: number) => {
			const params = getPaginatedParams(searchParams, page, size);
			navigate({ search: params.toString() });
		},
		[navigate, searchParams]
	);

	const columns: ColumnsType<API.User> = [
		{
			title: t('Name'),
			dataIndex: 'first_name',
			width: 250,
			ellipsis: true,
			render: (_, record) => {
				const fullName = `${record.first_name} ${record.last_name}`;

				return isAllowedTo('CHANGE_USER') ? (
					<Button
						size='large'
						type='link'
						onClick={() => {
							setUpdateId(record.id);
							setUpdateModal(true);
						}}
					>
						{fullName}
					</Button>
				) : (
					fullName
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
					<StatusColumn
						status={record?.is_active}
						id={record.id}
						endpoint={PRIVATE_ROUTES.USERS}
						isDisabled={!isAllowedTo('CHANGE_USER')}
					/>
				);
			},
		},
	];

	return (
		<div style={{ display: 'flex', height: '100%', flexDirection: 'column', gap: '1rem' }}>
			<Row align='middle' justify='space-between'>
				<Col span={12}>
					<Typography.Title level={4} type='primary' className='margin-0'>
						{t('Users')} ({data?.count || 0})
					</Typography.Title>
				</Col>
				<Col>
					{isAllowedTo('ADD_USER') && (
						<Button type='primary' size='large' onClick={() => setCreateModal(true)}>
							{t('Create User')}
						</Button>
					)}
					<SettingsUserCreate
						isVisible={isCreateModal}
						setVisible={setCreateModal}
						onSuccess={refetch}
					/>
					{updateId && (
						<SettingsUserUpdate
							clearId={() => setUpdateId(undefined)}
							id={updateId}
							isVisible={isUpdateModal}
							setVisible={setUpdateModal}
							onSuccess={refetch}
						/>
					)}
				</Col>
			</Row>

			<FilterTable />

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
						pageSize: pageSize,
						current: current,
						total: data?.count,
						onChange: handlePageChange,
						showSizeChanger: true,
					}}
					scroll={{ y: '100%' }}
					loading={isLoading}
				/>
			</div>
		</div>
	);
};
