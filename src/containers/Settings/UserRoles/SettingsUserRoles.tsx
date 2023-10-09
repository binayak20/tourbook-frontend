import { DataTableWrapper } from '@/components/atoms/DataTable/DataTableWrapper';
import { settingsAPI } from '@/libs/api';
import { UserRole } from '@/libs/api/@types/settings';
import { readableText } from '@/utils/helpers';
import { Empty, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useMemo } from 'react';
import { useAccessContext } from 'react-access-boundary';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';

export const SettingsUserRoles: React.FC = () => {
	const { t } = useTranslation();
	const { isAllowedTo } = useAccessContext();

	const { isLoading, data } = useQuery(['settings-user-roles'], () => settingsAPI.userRoles());

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
				return isAllowedTo('CHANGE_GROUP') ? (
					<Link to={`${record.id}`}>{readableText(text)}</Link>
				) : (
					readableText(text)
				);
			},
		},
		{ title: t('Permissions'), dataIndex: 'total_permission', width: 200, ellipsis: true },
		{ title: t('Assigned Users'), dataIndex: 'total_user', width: 200, ellipsis: true },
	];

	return (
		<DataTableWrapper
			title={t('User Roles')}
			count={data?.length}
			createButton={
				isAllowedTo('ADD_GROUP') && (
					<Link className='ant-btn ant-btn-primary ant-btn-lg' to='create'>
						{t('Create role')}
					</Link>
				)
			}
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
				dataSource={rolesList}
				columns={columns}
				rowKey='id'
				pagination={false}
				scroll={{ y: '100%' }}
				loading={isLoading}
			/>
		</DataTableWrapper>
	);
};
