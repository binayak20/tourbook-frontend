import { StatusColumn } from '@/components/StatusColumn';
import { Button } from '@/components/atoms';
import { DataTableWrapper } from '@/components/atoms/DataTable/DataTableWrapper';
import config from '@/config';
import { vehiclesAPI } from '@/libs/api';
import { VehicleType } from '@/libs/api/@types';
import { getPaginatedParams } from '@/utils/helpers';
import { Empty, Table } from 'antd';
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
		<>
			<VehicleTypesModal
				data={updateData}
				isVisible={isModalVisible}
				onHide={() => {
					setModalVisible(false);
					setUpdateData(undefined);
				}}
			/>

			<DataTableWrapper
				title={t('Vehicle types')}
				count={data?.count}
				createButton={
					isAllowedTo('ADD_VEHICLETYPE') && (
						<Button type='primary' size='large' onClick={() => setModalVisible(true)}>
							{t('Create Vehicle Type')}
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
					rowKey='id'
					loading={isLoading}
					columns={columns}
					dataSource={data?.results || []}
					pagination={{
						locale: { items_per_page: `/\t${t('page')}` },
						pageSize: pageSize,
						current: current,
						total: data?.count || 0,
						onChange: handlePageChange,
						showSizeChanger: true,
					}}
					scroll={{ y: '100%' }}
				/>
			</DataTableWrapper>
		</>
	);
};
