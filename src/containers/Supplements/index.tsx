import { DataTableWrapper } from '@/components/atoms/DataTable/DataTableWrapper';
import config from '@/config';
import { supplementsAPI } from '@/libs/api';
import { generateStatusOptions, getPaginatedParams, readableText } from '@/utils/helpers';
import { Button, Empty, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useCallback, useMemo, useState } from 'react';
import { useAccessContext } from 'react-access-boundary';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SupplementCreateModalMemo } from './SupplementCreateModal';
import { SupplementFilters } from './SupplementFilters';
import { SupplementStatusColumn } from './SupplementStatusColumn';

export const Supplements = () => {
	const { t } = useTranslation();
	const [isModalVisible, setModalVisible] = useState(false);
	const [selectedSupplement, setSelectedSupplement] = useState<API.Supplement>();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const activeItem = useMemo(() => searchParams.get('status') || 'active', [searchParams]);

	const { current, pageSize, name, unit_type, supplement_category } = useMemo(() => {
		return {
			name: searchParams.get('name') || '',
			unit_type: searchParams.get('unit_type') || '',
			supplement_category: searchParams.get('supplement_category') || undefined,
			current: parseInt(searchParams.get('page') || '1'),
			pageSize: parseInt(searchParams.get('limit') || `${config.itemsPerPage}`),
		};
	}, [searchParams]);

	const { isAllowedTo } = useAccessContext();

	const handlePageChange = useCallback(
		(page: number, size: number) => {
			const params = getPaginatedParams(searchParams, page, size);
			navigate({ search: params.toString() });
		},
		[navigate, searchParams]
	);

	const supplimentparams = useMemo(() => {
		const status = searchParams.get('status') || 'active';
		return {
			page: current,
			limit: pageSize,
			name,
			unit_type,
			supplement_category,
			is_active:
				status === 'active'
					? ('true' as unknown as string)
					: status === 'inactive'
					? ('false' as unknown as string)
					: undefined,
		};
	}, [current, pageSize, name, unit_type, supplement_category, searchParams]);

	const { data, isLoading } = useQuery(['supplements', supplimentparams], () =>
		supplementsAPI.list(supplimentparams)
	);

	const columns: ColumnsType<API.Supplement> = [
		{
			title: t('Name'),
			dataIndex: 'name',
			ellipsis: true,
			render: (name, record) =>
				isAllowedTo('CHANGE_SUPPLEMENT') ? (
					<Button
						size='large'
						type='link'
						style={{ padding: 0, height: 'auto' }}
						onClick={() => {
							setModalVisible(true);
							setSelectedSupplement(record);
						}}
					>
						{name}
					</Button>
				) : (
					name
				),
		},
		{
			title: t('Category'),
			dataIndex: 'supplement_category',
			render: (category) => category.name,
		},
		{
			title: t('Unit type'),
			dataIndex: 'unit_type',
			render: (unitType) => readableText(unitType),
		},
		{
			width: '120px',
			align: 'center',
			title: t('Quantity'),
			dataIndex: 'quantity',
		},
		{ width: '120px', align: 'right', title: t('Price'), dataIndex: 'price' },
		{
			width: '120px',
			align: 'center',
			title: t('Status'),
			dataIndex: 'is_active',
			render: (is_active, { id }) => (
				<SupplementStatusColumn id={id} status={is_active ? 'Active' : 'Inactive'} />
			),
		},
	];

	return (
		<>
			<SupplementCreateModalMemo
				open={isModalVisible}
				data={selectedSupplement}
				mode={selectedSupplement ? 'update' : 'create'}
				onCancel={() => {
					setModalVisible(false);
					setSelectedSupplement(undefined);
				}}
			/>
			<DataTableWrapper
				menuOptions={generateStatusOptions('Supplements')}
				activeItem={activeItem}
				filterBar={<SupplementFilters />}
				count={data?.count}
				createButton={
					isAllowedTo('ADD_SUPPLEMENT') && (
						<Button size='large' type='primary' onClick={() => setModalVisible(true)}>
							{t('Create supplement')}
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
					dataSource={data?.results || []}
					columns={columns}
					rowKey='id'
					scroll={{ y: '100%' }}
					loading={isLoading}
					pagination={{
						locale: { items_per_page: `/\t${t('page')}` },
						pageSize: pageSize,
						current: current,
						total: data?.count,
						onChange: handlePageChange,
						showSizeChanger: true,
					}}
				/>
			</DataTableWrapper>
		</>
	);
};
