import { Button, Typography } from '@/components/atoms';
import { StatusColumn } from '@/components/StatusColumn';
import config from '@/config';
import { vehiclesAPI } from '@/libs/api';
import { VehicleType } from '@/libs/api/@types';
import { getPaginatedParams } from '@/utils/helpers';
import { Col, Empty, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useCallback, useMemo, useState } from 'react';
import { useAccessContext } from 'react-access-boundary';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { VehicleTypesModal } from './VehicleTypesModal';

export const SettingsVehicleTypes = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const [isModalVisible, setModalVisible] = useState(false);
	const [updateData, setUpdateData] = useState<VehicleType>();
	const { current, pageSize } = useMemo(() => {
		return {
			current: parseInt(searchParams.get('page') || '1'),
			pageSize: parseInt(searchParams.get('limit') || `${config.itemsPerPage}`),
		};
	}, [searchParams]);
	const { isAllowedTo } = useAccessContext();

	const { isLoading, data } = useQuery(['vehicleTypes', current, pageSize], () =>
		vehiclesAPI.types({ page: current, limit: pageSize })
	);

	const handlePageChange = useCallback(
		(page: number, size: number) => {
			const params = getPaginatedParams(searchParams, page, size);
			navigate({ search: params.toString() });
		},
		[navigate, searchParams]
	);

	const columns: ColumnsType<API.VehicleType> = [
		{
			title: t('Name'),
			dataIndex: 'name',
			render: (_, record) =>
				isAllowedTo('CHANGE_VEHICLETYPE') ? (
					<Button
						size='large'
						type='link'
						onClick={() => {
							setModalVisible(true);
							setUpdateData(record);
						}}
					>
						{record.name}
					</Button>
				) : (
					record.name
				),
		},
		{
			title: t('Status'),
			dataIndex: 'status',
			width: 100,
			render: (_, record) => {
				return (
					<StatusColumn
						status={record?.is_active}
						id={record.id}
						endpoint={'vehicle-types'}
						isDisabled={!isAllowedTo('CHANGE_VEHICLETYPE') || true}
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
						{t('Vehicle types')} ({data?.count || 0})
					</Typography.Title>
				</Col>
				<Col span={12} style={{ textAlign: 'right' }}>
					{isAllowedTo('ADD_VEHICLETYPE') && (
						<Button type='primary' size='large' onClick={() => setModalVisible(true)}>
							{t('Create Vehicle Type')}
						</Button>
					)}
					<VehicleTypesModal
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
