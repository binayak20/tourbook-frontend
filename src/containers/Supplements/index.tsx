import { HeaderDropdown } from '@/components/TourAdminHeaderDropdown';
import config from '@/config';
import { supplementsAPI } from '@/libs/api';
import { getPaginatedParams, readableText } from '@/utils/helpers';
import { Button, Col, Empty, Input, Row, Select, Space, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useCallback, useMemo, useState } from 'react';
import { useAccessContext } from 'react-access-boundary';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SupplementCreateModalMemo } from './SupplementCreateModal';
import { SupplementStatusColumn } from './SupplementStatusColumn';

export const Supplements = () => {
	enum unit_type {
		per_booking = 'per_booking',
		per_day = 'per_day',
		per_week = 'per_week',
		per_booking_person = 'per_booking_person',
		per_day_person = 'per_day_person',
		per_week_person = 'per_week_person',
		all = '',
	}
	const { t } = useTranslation();
	const [isModalVisible, setModalVisible] = useState(false);
	const [selectedSupplement, setSelectedSupplement] = useState<API.Supplement>();
	const navigate = useNavigate();
	const [searchName, setSearchName] = useState('');
	const [selectedUnit, setSelectedUnit] = useState<unit_type>(unit_type.all);
	const [selectedCategory, setSelectedCategory] = useState<number>();
	const [searchParams] = useSearchParams();
	const activeItem = useMemo(() => searchParams.get('status') || 'active', [searchParams]);

	const { Search } = Input;
	const { Option } = Select;

	const unitOptions = [
		{ value: unit_type.all, label: 'All' },
		{ value: unit_type.per_booking, label: 'Per Booking' },
		{ value: unit_type.per_day, label: 'Per Day' },
		{ value: unit_type.per_week, label: 'Per Week' },
		{ value: unit_type.per_booking_person, label: 'Per Booking Person' },
		{ value: unit_type.per_day_person, label: 'Per Day Person' },
		{ value: unit_type.per_week_person, label: 'Per Week Person' },
	];

	const { data: suplimentCategoriesList, isLoading: isSuplimentListLoading } = useQuery(
		['suplimentList'],
		() => supplementsAPI.categoriesList()
	);

	const { current, pageSize } = useMemo(() => {
		return {
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
	const handleUnitChange = (value: unit_type) => {
		setSelectedUnit(value);
	};

	const handleSuplimentChange = (value: number) => {
		setSelectedCategory(value);
	};

	const supplimentparams = useMemo(() => {
		const status = searchParams.get('status') || 'active';
		return {
			page: current,
			limit: pageSize,
			name: searchName,
			unit_type: selectedUnit,
			supplement_category: selectedCategory,
			is_active:
				status === 'active'
					? ('true' as unknown as boolean)
					: status === 'inactive'
					? ('false' as unknown as boolean)
					: undefined,
		};
	}, [current, pageSize, searchName, selectedUnit, selectedCategory, searchParams]);

	//const locationParam = useDropdownParam(searchParams, current, pageSize);
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
		<div style={{ display: 'flex', height: '100%', flexDirection: 'column', gap: '1rem' }}>
			<Row align='middle' justify='space-between'>
				<Col span='auto'>
					<HeaderDropdown count={data?.count} activeItem={activeItem ?? ''} sideItem='vehicles' />
				</Col>

				<Col span='auto'>
					{isAllowedTo('ADD_SUPPLEMENT') && (
						<Button size='large' type='primary' onClick={() => setModalVisible(true)}>
							{t('Create supplement')}
						</Button>
					)}
				</Col>
			</Row>
			<Row>
				<Col span={7}>
					<Space>
						<Search
							size='large'
							addonBefore={t('Name')}
							placeholder={t('Search by name')}
							allowClear
							onSearch={(e) => {
								handlePageChange(1, pageSize);
								setSearchName(e);
							}}
						/>
					</Space>
				</Col>
				<Col span={6}>
					<Space>
						<Select
							disabled={isSuplimentListLoading}
							size='large'
							placeholder={t('Select category')}
							style={{ width: '250px' }}
							id='supliment-category-dropdown'
							value={undefined}
							onChange={handleSuplimentChange}
						>
							<Option key={undefined} value={undefined}>
								All
							</Option>
							{suplimentCategoriesList?.map(({ id, name }) => (
								<Option key={id} value={id}>
									{name}
								</Option>
							))}
						</Select>
					</Space>
				</Col>

				<Col span={6}>
					<Space>
						<Select
							size='large'
							placeholder={t('Select unit type')}
							style={{ width: '250px' }}
							id='unit-type-dropdown'
							value={undefined}
							onChange={handleUnitChange}
						>
							{unitOptions.map(({ value, label }) => (
								<Option key={value} value={value}>
									{label}
								</Option>
							))}
						</Select>
					</Space>
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

				<SupplementCreateModalMemo
					open={isModalVisible}
					data={selectedSupplement}
					mode={selectedSupplement ? 'update' : 'create'}
					onCancel={() => {
						setModalVisible(false);
						setSelectedSupplement(undefined);
					}}
				/>
			</div>
		</div>
	);
};
