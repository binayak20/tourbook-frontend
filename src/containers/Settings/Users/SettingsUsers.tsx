import { DataTableWrapper } from '@/components/atoms/DataTable/DataTableWrapper';
import config from '@/config';
import { usersAPI } from '@/libs/api';
import { generateStatusOptions, getPaginatedParams, readableText } from '@/utils/helpers';
import { Button, Empty, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import { useCallback, useMemo, useState } from 'react';
import { useAccessContext } from 'react-access-boundary';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SettingsUserCreate } from './SettingsUserCreate';
import { SettingsUserUpdate } from './SettingsUserUpdate';
import { StatusColumn } from './StatusColumn';
import { UserFilters } from './UserFilters';

export const SettingsUsers: React.FC = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const [updateId, setUpdateId] = useState<number>();
	const [isCreateModal, setCreateModal] = useState(false);
	const [isUpdateModal, setUpdateModal] = useState(false);
	const { isAllowedTo } = useAccessContext();
	const activeItem = useMemo(() => searchParams.get('status') || 'active', [searchParams]);

	const { current, pageSize } = useMemo(() => {
		return {
			current: parseInt(searchParams.get('page') || '1'),
			pageSize: parseInt(searchParams.get('limit') || `${config.itemsPerPage}`),
		};
	}, [searchParams]);

	const userParams: API.UsersPragmas = useMemo(() => {
		const status = searchParams.get('status') || 'active';
		return {
			page: current,
			limit: pageSize,
			email: searchParams.get('email') || '',
			name: searchParams.get('name') || '',
			is_passenger: searchParams.get('is_passenger') || 'false',
			is_active:
				status === 'active'
					? ('true' as unknown as string)
					: status === 'inactive'
					? ('false' as unknown as string)
					: undefined,
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
			width: 160,
			align: 'center',
			title: t('Status'),
			dataIndex: 'is_active',
			key: 'is_active',
			render: (is_active, { id }) => (
				<StatusColumn
					status={is_active ? 'Active' : 'Inactive'}
					id={id}
					isDisabled={!isAllowedTo('CHANGE_USER')}
				/>
			),
		},
	];

	return (
		<>
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
			<DataTableWrapper
				menuOptions={generateStatusOptions('Users')}
				activeItem={activeItem}
				count={data?.count}
				createButton={
					isAllowedTo('ADD_USER') && (
						<Button type='primary' size='large' onClick={() => setCreateModal(true)}>
							{t('Create User')}
						</Button>
					)
				}
				filterBar={<UserFilters />}
			>
				<Table
					locale={{
						emptyText: (
							<Empty
								image={Empty.PRESENTED_IMAGE_SIMPLE}
								description={<span>{t('No results found')}</span>}
							/>
						),
					}}
					dataSource={usersList}
					columns={columns}
					rowKey='id'
					pagination={{
						locale: { items_per_page: `/\t${t('page')}` },
						pageSize: pageSize,
						current: current,
						total: data?.count,
						onChange: handlePageChange,
						showSizeChanger: true,
					}}
					scroll={{ y: '100%' }}
					loading={isLoading}
				/>
			</DataTableWrapper>
		</>
	);
};
