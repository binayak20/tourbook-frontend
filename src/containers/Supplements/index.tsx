import { Typography } from '@/components/atoms';
import config from '@/config';
import { supplementsAPI } from '@/libs/api';
import { getPaginatedParams, readableText } from '@/utils/helpers';
import { Button, Col, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useCallback, useMemo, useState } from 'react';
import { useAccessContext } from 'react-access-boundary';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SupplementCreateModalMemo } from './SupplementCreateModal';
import { SupplementStatusColumn } from './SupplementStatusColumn';

export const Supplements = () => {
	const { t } = useTranslation();
	const [isModalVisible, setModalVisible] = useState(false);
	const [selectedSupplement, setSelectedSupplement] = useState<API.Supplement>();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
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
	const { data, isLoading } = useQuery(['supplements', current, pageSize], () =>
		supplementsAPI.list({ page: current, limit: pageSize })
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
				<Col span={12}>
					<Typography.Title level={4} type='primary' className='margin-0'>
						{t('All Supplements')} ({data?.count || 0})
					</Typography.Title>
				</Col>
				<Col>
					{isAllowedTo('ADD_SUPPLEMENT') && (
						<Button size='large' type='primary' onClick={() => setModalVisible(true)}>
							{t('Create supplement')}
						</Button>
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
					dataSource={data?.results || []}
					columns={columns}
					rowKey='id'
					scroll={{ y: '100%' }}
					loading={isLoading}
					pagination={{
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
