import { StatusColumn } from '@/components/StatusColumn';
import config from '@/config';
import { settingsAPI } from '@/libs/api';
import { Category } from '@/libs/api/@types/settings';
import { PRIVATE_ROUTES } from '@/routes/paths';
import { getPaginatedParams } from '@/utils/helpers';
import { Button, Col, Empty, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useCallback, useMemo, useState } from 'react';
import { useAccessContext } from 'react-access-boundary';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SettingsCategoryCreate } from './SettingsCategoryCreate';
import { SettingsCategoryUpdate } from './SettingsCategoryUpdate';
// import { HeaderDropdown } from './test';
import { useDropdownParam } from '@/libs/hooks/useHeaderDropdownParam';
import { HeaderDropdown } from '../../../components/TourAdminHeaderDropdown';

export const SettingsCategories = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const activeItem = useMemo(() => searchParams.get('status') || 'active', [searchParams]);
	//console.log(activeItem);
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
				// parentCategories?.find((category: Category) => category.id === record.parent)?.name || '–',
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

	return (
		<div style={{ display: 'flex', height: '100%', flexDirection: 'column', gap: '1rem' }}>
			<Row align='middle' justify='space-between'>
				<Col span={12}>
					{/* Componet for header dropdown */}
					<HeaderDropdown
						count={categoriesList?.count}
						activeItem={activeItem ?? ''}
						sideItem='Category'
					/>
				</Col>
				<Col>
					{isAllowedTo('ADD_CATEGORY') && (
						<Button type='primary' size='large' onClick={() => setCreateModal(true)}>
							{t('Create Category')}
						</Button>
					)}
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
			</div>
		</div>
	);
};
