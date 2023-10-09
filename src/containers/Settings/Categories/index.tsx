import { StatusColumn } from '@/components/StatusColumn';
import { DataTableWrapper } from '@/components/atoms/DataTable/DataTableWrapper';
import config from '@/config';
import { settingsAPI } from '@/libs/api';
import { Category } from '@/libs/api/@types/settings';
import { useDropdownParam } from '@/libs/hooks/useHeaderDropdownParam';
import { PRIVATE_ROUTES } from '@/routes/paths';
import { getPaginatedParams } from '@/utils/helpers';
import { Button, Empty, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useCallback, useMemo, useState } from 'react';
import { useAccessContext } from 'react-access-boundary';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SettingsCategoryCreate } from './SettingsCategoryCreate';
import { SettingsCategoryUpdate } from './SettingsCategoryUpdate';

export const SettingsCategories = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const activeItem = useMemo(() => searchParams.get('status') || 'active', [searchParams]);
	const [updateId, setUpdateId] = useState<number>();
	const [isCreateModal, setCreateModal] = useState(false);
	const [isUpdateModal, setUpdateModal] = useState(false);
	const queryClient = useQueryClient();
	const { current, pageSize } = useMemo(() => {
		return {
			current: parseInt(searchParams.get('page') || '1'),
			pageSize: parseInt(searchParams.get('limit') || `${config.itemsPerPage}`),
		};
	}, [searchParams]);
	const { isAllowedTo } = useAccessContext();

	//Seetings param hook for same header dropdown
	const categoryParam = useDropdownParam(searchParams, current, pageSize);

	const { data: categoriesList, isLoading } = useQuery(['categories', categoryParam], () =>
		settingsAPI.categories(categoryParam)
	);

	const handlePageChange = useCallback(
		(page: number, size: number) => {
			const params = getPaginatedParams(searchParams, page, size);
			navigate({ search: params.toString() });
		},
		[navigate, searchParams]
	);

	const columns: ColumnsType<Category> = [
		{
			title: t('Name'),
			dataIndex: 'name',
			width: 200,
			ellipsis: true,
			render: (text, record) =>
				isAllowedTo('CHANGE_CATEGORY') ? (
					<Button
						size='large'
						type='link'
						onClick={() => {
							setUpdateId(record.id);
							setUpdateModal(true);
						}}
					>
						{text}
					</Button>
				) : (
					text
				),
		},
		{
			title: t('Parent'),
			dataIndex: 'parent',
			width: 200,
			ellipsis: true,
			render: (_, record) => {
				return record?.parent?.name || '-';
			},
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
						isDisabled={!isAllowedTo('CHANGE_CATEGORY')}
					/>
				);
			},
		},
	];

	const menuOptions = [
		{
			key: 'active',
			label: t('Active category'),
		},
		{
			key: 'inactive',
			label: t('Inactive category'),
			queryKey: 'status',
		},
		{
			key: 'all',
			label: t('All category'),
			queryKey: 'status',
		},
	];

	return (
		<>
			<SettingsCategoryCreate isVisible={isCreateModal} setVisible={setCreateModal} />
			{updateId && (
				<SettingsCategoryUpdate
					clearId={() => setUpdateId(undefined)}
					id={updateId}
					isVisible={isUpdateModal}
					setVisible={setUpdateModal}
				/>
			)}

			<DataTableWrapper
				menuOptions={menuOptions}
				count={categoriesList?.count}
				activeItem={activeItem}
				createButton={
					isAllowedTo('ADD_CATEGORY') && (
						<Button type='primary' size='large' onClick={() => setCreateModal(true)}>
							{t('Create Category')}
						</Button>
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
					dataSource={categoriesList?.results}
					columns={columns}
					rowKey='id'
					pagination={{
						locale: { items_per_page: `/\t${t('page')}` },
						pageSize: pageSize,
						current: current,
						total: categoriesList?.count,
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
