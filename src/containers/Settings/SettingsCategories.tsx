import { StatusColumn } from '@/components/StatusColumn';
import { settingsAPI } from '@/libs/api';
import { PRIVATE_ROUTES } from '@/routes/paths';
import { Col, Pagination, Row } from 'antd';
import Table, { ColumnsType } from 'antd/lib/table';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';

import { Link } from 'react-router-dom';

export const SettingsCategories = () => {
	const { t } = useTranslation();

	const { data: parentCategories } = useQuery(
		'settings-categories-parent',
		() => settingsAPI.parentCategories(),
		{ initialData: [] }
	);

	const { data, isLoading } = useQuery('settings-categories', () => settingsAPI.categories());

	const categoriesList = useMemo(() => {
		if (data?.results) return data?.results;
		return [];
	}, [data]);

	const columns: ColumnsType<API.Category> = [
		{
			title: t('Name'),
			dataIndex: 'name',
			render: (text, record) => <Link to={`${record.id}`}>{text}</Link>,
		},
		{
			title: t('Parent'),
			dataIndex: 'parent',
			render: (_, record) =>
				parentCategories?.find((category: API.Category) => category.id === record.parent)?.name,
		},
		{
			title: t('Slug'),
			dataIndex: 'slug',
		},
		{
			title: t('Status'),
			dataIndex: 'status',
			render: (_, record) => {
				return (
					<StatusColumn
						status={record?.is_active}
						id={record.id}
						endpoint={PRIVATE_ROUTES.CATEGORIES}
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
						{t('Create Category')}
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
					dataSource={categoriesList}
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
