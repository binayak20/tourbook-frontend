import { Typography } from '@/components/atoms';
import { StatusColumn } from '@/components/StatusColumn';
import config from '@/config';
import { settingsAPI } from '@/libs/api';
import { Category } from '@/libs/api/@types/settings';
import { PRIVATE_ROUTES } from '@/routes/paths';
import { DEFAULT_LIST_PARAMS } from '@/utils/constants';
import { Button, Col, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SettingsCategoryCreate } from './SettingsCategoryCreate';
import { SettingsCategoryUpdate } from './SettingsCategoryUpdate';

export const SettingsCategories = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const [updateId, setUpdateId] = useState<number>();
	const [isCreateModal, setCreateModal] = useState(false);
	const [isUpdateModal, setUpdateModal] = useState(false);
	const queryClient = useQueryClient();
	const currentPage = useMemo(() => parseInt(searchParams.get('page') || '1'), [searchParams]);

	const { data: parentCategories } = useQuery('parentCategories', () =>
		settingsAPI.parentCategories(DEFAULT_LIST_PARAMS)
	);

	const { data: categoriesList, isLoading } = useQuery(['categories', currentPage], () =>
		settingsAPI.categories(currentPage)
	);

	const handlePageChange = useCallback(
		(page: number) => {
			navigate(page > 1 ? `?page=${page}` : '');
		},
		[navigate]
	);

	const columns: ColumnsType<Category> = [
		{
			title: t('Name'),
			dataIndex: 'name',
			width: 200,
			ellipsis: true,
			render: (text, record) => (
				<Button
					type='link'
					onClick={() => {
						setUpdateId(record.id);
						setUpdateModal(true);
					}}
				>
					{text}
				</Button>
			),
		},
		{
			title: t('Parent'),
			dataIndex: 'parent',
			width: 200,
			ellipsis: true,
			render: (_, record) =>
				parentCategories?.find((category: Category) => category.id === record.parent)?.name || '–',
		},
		{
			title: t('Slug'),
			dataIndex: 'slug',
			width: 200,
			ellipsis: true,
		},
		{
			title: t('Status'),
			dataIndex: 'status',
			width: 100,
			ellipsis: true,
			render: (_, record) => {
				return (
					<StatusColumn
						status={record?.is_active}
						id={record.id}
						endpoint={PRIVATE_ROUTES.CATEGORIES}
						successMessage='Category status has been updated'
						onSuccessFn={() => {
							queryClient.invalidateQueries('parentCategories');
							queryClient.invalidateQueries('categories');
						}}
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
						{t('Categories')}
					</Typography.Title>
				</Col>
				<Col>
					<Button type='primary' size='large' onClick={() => setCreateModal(true)}>
						{t('Create Category')}
					</Button>
					<SettingsCategoryCreate isVisible={isCreateModal} setVisible={setCreateModal} />
					{updateId && (
						<SettingsCategoryUpdate
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
					dataSource={categoriesList?.results}
					columns={columns}
					rowKey='id'
					pagination={{
						pageSize: config.itemsPerPage,
						current: currentPage,
						total: categoriesList?.count,
						onChange: handlePageChange,
					}}
					scroll={{ y: '100%' }}
					loading={isLoading}
				/>
			</div>
		</div>
	);
};