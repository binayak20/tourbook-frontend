import { StatusColumn } from '@/components/StatusColumn';
import { HeaderDropdown } from '@/components/TourAdminHeaderDropdown';
import config from '@/config';
import { locationsAPI } from '@/libs/api';
import { useDropdownParam } from '@/libs/hooks/useHeaderDropdownParam';
import { PRIVATE_ROUTES } from '@/routes/paths';
import { getPaginatedParams } from '@/utils/helpers';
import { Button, Col, Empty, Row, Table } from 'antd';
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
		<div style={{ display: 'flex', height: '100%', flexDirection: 'column', gap: '1rem' }}>
			<Row align='middle' justify='space-between'>
				<Col span={12}>
					<HeaderDropdown
						count={pickupLocations?.count}
						activeItem={activeItem ?? ''}
						sideItem='pickup locations'
					/>
				</Col>
				<Col>
					{isAllowedTo('ADD_PICKUPLOCATION') && (
						<Button type='primary' size='large' onClick={() => setCreateModal(true)}>
							{t('Create pickup location')}
						</Button>
					)}
					<SettingsPickupLocationCreate isVisible={isCreateModal} setVisible={setCreateModal} />
					{updateData && (
						<SettingsPickupLocationUpdate
							clearId={() => setUpdateData(undefined)}
							updateData={updateData}
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
					dataSource={pickupLocations?.results}
					columns={columns}
					rowKey='id'
					scroll={{ x: 1200, y: '100%' }}
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
			</div>
		</div>
	);
};
