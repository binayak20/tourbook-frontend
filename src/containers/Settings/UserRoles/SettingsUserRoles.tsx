import { Typography } from '@/components/atoms';
import { settingsAPI } from '@/libs/api';
import { UserRole } from '@/libs/api/@types/settings';
import { readableText } from '@/utils/helpers';
import { Col, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from 'react-query';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

export const SettingsUserRoles: React.FC = () => {
	const { t } = useTranslation();
	const queryClient = useQueryClient();

	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const currentPage = useMemo(() => parseInt(searchParams.get('page') || '1'), [searchParams]);

	const { isLoading, data } = useQuery(['settings-user-roles', currentPage], () =>
		settingsAPI.userRoles(currentPage)
	);

	const handlePageChange = useCallback(
		(page: number) => {
			navigate(page > 1 ? `?page=${page}` : '');
		},
		[navigate]
	);

	useEffect(() => {
		queryClient.prefetchQuery(['settings-user-roles', currentPage], () =>
			settingsAPI.userRoles(currentPage)
		);
	}, [queryClient, currentPage]);

	const rolesList = useMemo(() => {
		return data?.length ? data : [];
	}, [data]);

	const columns: ColumnsType<UserRole> = [
		{
			title: t('Name'),
			dataIndex: 'name',
			width: 200,
			ellipsis: true,
			render: (text, record) => {
				return <Link to={`${record.id}`}>{readableText(text)}</Link>;
			},
		},
		{ title: t('Permissions'), dataIndex: 'total_permission', width: 200, ellipsis: true },
		{ title: t('Assigned Users'), dataIndex: 'total_user', width: 200, ellipsis: true },
	];

	return (
		<div style={{ display: 'flex', height: '100%', flexDirection: 'column', gap: '1rem' }}>
			<Row align='middle' justify='space-between'>
				<Col>
					<Typography.Title level={4} type='primary' className='margin-0'>
						{t('User Roles')}
					</Typography.Title>
				</Col>
				<Col>
					<Link className='ant-btn ant-btn-primary ant-btn-lg' to='create'>
						{t('Create role')}
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
					dataSource={rolesList}
					columns={columns}
					rowKey='id'
					pagination={{
						current: currentPage,
						total: data?.length || 0,
						onChange: handlePageChange,
					}}
					scroll={{ y: '100%' }}
					loading={isLoading}
				/>
			</div>
		</div>
	);
};
