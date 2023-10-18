import { StatusColumn } from '@/components/StatusColumn';
import { DataTableWrapper } from '@/components/atoms/DataTable/DataTableWrapper';
import config from '@/config';
import { locationsAPI } from '@/libs/api';
import { useDropdownParam } from '@/libs/hooks/useHeaderDropdownParam';
import { PRIVATE_ROUTES } from '@/routes/paths';
import { generateStatusOptions, getPaginatedParams } from '@/utils/helpers';
import { Button, Empty, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useCallback, useMemo, useState } from 'react';
import { useAccessContext } from 'react-access-boundary';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SettingsPickupLocationCreate } from './SettingsPickupLocationCreate';
import { SettingsPickupLocationUpdate } from './SettingsPickupLocationUpdate';

export const SettingsPickupLocations = () => {
	const { t } = useTranslation();
	const { isAllowedTo } = useAccessContext();
	const [updateData, setUpdateData] = useState<API.PickupLocation>();
	const [isCreateModal, setCreateModal] = useState(false);
	const [isUpdateModal, setUpdateModal] = useState(false);
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const activeItem = useMemo(() => searchParams.get('status') || 'active', [searchParams]);

	const { current, pageSize } = useMemo(() => {
		return {
			current: parseInt(searchParams.get('page') || '1'),
			pageSize: parseInt(searchParams.get('limit') || `${config.itemsPerPage}`),
		};
	}, [searchParams]);

	const picLocationParam = useDropdownParam(searchParams, current, pageSize);

	const { data: pickupLocations, isLoading: isPickupLocationsLoading } = useQuery(
		['settings-pickup-locations', picLocationParam],
		() => locationsAPI.pickupLocationList(picLocationParam)
	);

	const handlePageChange = useCallback(
		(page: number, size: number) => {
			const params = getPaginatedParams(searchParams, page, size);
			navigate({ search: params.toString() });
		},
		[navigate, searchParams]
	);

	const columns: ColumnsType<API.PickupLocation> = [
		{
			title: t('Name'),
			dataIndex: 'name',
			ellipsis: true,
			render: (text, record) =>
				isAllowedTo('CHANGE_PICKUPLOCATION') ? (
					<Button
						size='large'
						type='link'
						onClick={() => {
							setUpdateData(record);
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
			title: t('Area'),
			dataIndex: '',
			render: (record) => {
				return <span>{record?.pickup_location_area?.name}</span>;
			},
		},
		{
			title: t('Description'),
			dataIndex: 'description',
			ellipsis: true,
		},
		{
			title: t('Status'),
			dataIndex: 'status',
			width: 120,
			render: (_, record) => {
				return (
					<StatusColumn
						status={record?.is_active}
						id={record.id}
						endpoint={PRIVATE_ROUTES.PICKUPLOCATIONS}
						isDisabled={!isAllowedTo('CHANGE_PICKUPLOCATION')}
					/>
				);
			},
		},
	];

	return (
		<>
			<SettingsPickupLocationCreate isVisible={isCreateModal} setVisible={setCreateModal} />
			{updateData && (
				<SettingsPickupLocationUpdate
					clearId={() => setUpdateData(undefined)}
					updateData={updateData}
					isVisible={isUpdateModal}
					setVisible={setUpdateModal}
				/>
			)}
			<DataTableWrapper
				activeItem={activeItem}
				count={pickupLocations?.count}
				menuOptions={generateStatusOptions('Pickup locations')}
				createButton={
					isAllowedTo('ADD_PICKUPLOCATION') && (
						<Button type='primary' size='large' onClick={() => setCreateModal(true)}>
							{t('Create pickup location')}
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
					dataSource={pickupLocations?.results}
					columns={columns}
					rowKey='id'
					scroll={{ y: '100%' }}
					loading={isPickupLocationsLoading}
					pagination={{
						locale: { items_per_page: `/\t${t('page')}` },
						pageSize: pageSize,
						total: pickupLocations?.count,
						current: current,
						onChange: handlePageChange,
						showSizeChanger: true,
					}}
				/>
			</DataTableWrapper>
		</>
	);
};
