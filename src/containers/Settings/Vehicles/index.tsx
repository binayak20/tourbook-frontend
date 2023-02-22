import { Typography } from '@/components/atoms';
import { StatusColumn } from '@/components/StatusColumn';
import config from '@/config';
import { vehiclesAPI } from '@/libs/api';
import { Vehicle } from '@/libs/api/@types';
import { DEFAULT_LIST_PARAMS } from '@/utils/constants';
import { getPaginatedParams } from '@/utils/helpers';
import { Button, Col, Empty, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useCallback, useMemo, useState } from 'react';
import { useAccessContext } from 'react-access-boundary';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { VehiclesModal } from './VehiclesModal';

export const SettingsVehicles = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const { current, pageSize } = useMemo(() => {
		return {
			current: parseInt(searchParams.get('page') || '1'),
			pageSize: parseInt(searchParams.get('limit') || `${config.itemsPerPage}`),
		};
	}, [searchParams]);
	const [isModalVisible, setModalVisible] = useState(false);
	const [updateData, setUpdateData] = useState<Vehicle>();
	const queryClient = useQueryClient();
	const { isAllowedTo } = useAccessContext();

	const { isLoading, data } = useQuery(['vehicles', current, pageSize], () =>
		vehiclesAPI.list({ page: current, limit: pageSize })
	);

	const { data: vehicleTypes } = useQuery('vehicleTypes', () =>
		vehiclesAPI.types(DEFAULT_LIST_PARAMS)
	);

	const handlePageChange = useCallback(
		(page: number, size: number) => {
			const params = getPaginatedParams(searchParams, page, size);
			navigate({ search: params.toString() });
		},
		[navigate, searchParams]
	);

	const columns: ColumnsType<API.Vehicle> = [
		{
			title: t('Name'),
			dataIndex: 'name',
			render: (value, record) =>
				isAllowedTo('CHANGE_VEHICLE') ? (
					<Button
						size='large'
						type='link'
						onClick={() => {
							setModalVisible(true);
							setUpdateData(record);
						}}
					>
						{value}
					</Button>
				) : (
					value
				),
		},
		{
			title: t('Type'),
			dataIndex: 'vehicle_type',
			render: (value) =>
				vehicleTypes?.results.find((vehicleType) => vehicleType.id === value)?.name,
		},
		{
			title: t('Capacity'),
			dataIndex: 'capacity',
		},
		{
			title: t('Status'),
			dataIndex: 'is_active',
			width: '120px',
			render: (_, record) => {
				return (
					<StatusColumn
						status={record?.is_active}
						id={record.id}
						endpoint={'vehicles'}
						onSuccessFn={() => {
							queryClient.invalidateQueries('vehicles');
							queryClient.invalidateQueries('vehicleTypes');
						}}
						isDisabled={!isAllowedTo('CHANGE_VEHICLE')}
					/>
				);
			},
		},
	];

	return (
		<div style={{ display: 'flex', height: '100%', flexDirection: 'column', gap: '1rem' }}>
			<Row align='middle' justify='space-between'>
				<Col span={6}>
					<Typography.Title noMargin level={4} type='primary'>
						{t('All vehicles')} ({data?.count || 0})
					</Typography.Title>
				</Col>
				<Col span={12} style={{ textAlign: 'right' }}>
					{isAllowedTo('ADD_VEHICLE') && (
						<Button type='primary' size='large' onClick={() => setModalVisible(true)}>
							{t('Create Vehicle')}
						</Button>
					)}
					<VehiclesModal
						data={updateData}
						isVisible={isModalVisible}
						onHide={() => {
							setModalVisible(false);
							setUpdateData(undefined);
						}}
					/>
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
							description={
								<span>
									{t('No results found')}
								</span>
							}
						/>
					),
				}}
					rowKey='id'
					loading={isLoading}
					columns={columns}
					dataSource={data?.results || []}
					pagination={{
						pageSize: pageSize,
						current: current,
						total: data?.count || 0,
						onChange: handlePageChange,
						showSizeChanger: true,
					}}
				/>
			</div>
		</div>
	);
};
