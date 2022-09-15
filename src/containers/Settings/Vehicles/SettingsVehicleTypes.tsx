import { Button, Typography } from '@/components/atoms';
import { StatusColumn } from '@/components/StatusColumn';
import config from '@/config';
import { vehiclesAPI } from '@/libs/api';
import { VehicleType } from '@/libs/api/@types';
import { Col, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useCallback, useMemo, useState } from 'react';
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
	const currentPage = useMemo(() => parseInt(searchParams.get('page') || '1'), [searchParams]);

	const { isLoading, data } = useQuery(['vehicleTypes', currentPage], () =>
		vehiclesAPI.types({ page: currentPage })
	);

	const handlePageChange = useCallback(
		(page: number) => {
			navigate(page > 1 ? `?page=${page}` : '');
		},
		[navigate]
	);

	const columns: ColumnsType<API.VehicleType> = [
		{
			title: t('Name'),
			dataIndex: 'name',
			render: (_, record) => (
				<Button
					type='link'
					onClick={() => {
						setModalVisible(true);
						setUpdateData(record);
					}}
				>
					{record.name}
				</Button>
			),
		},
		{
			title: t('Status'),
			dataIndex: 'status',
			width: 100,
			render: (_, record) => {
				return (
					<StatusColumn status={record?.is_active} id={record.id} endpoint={'vehicle-types'} />
				);
			},
		},
	];

	return (
		<div style={{ display: 'flex', height: '100%', flexDirection: 'column', gap: '1rem' }}>
			<Row align='middle' justify='space-between'>
				<Col span={6}>
					<Typography.Title noMargin level={4} type='primary'>
						{t('Vehicle types')}
					</Typography.Title>
				</Col>
				<Col span={12} style={{ textAlign: 'right' }}>
					<Button type='primary' size='large' onClick={() => setModalVisible(true)}>
						{t('Create new')}
					</Button>
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
					rowKey='id'
					loading={isLoading}
					columns={columns}
					dataSource={data?.results || []}
					pagination={{
						pageSize: config.itemsPerPage,
						current: currentPage,
						total: data?.count || 0,
						onChange: handlePageChange,
					}}
				/>
			</div>
		</div>
	);
};
