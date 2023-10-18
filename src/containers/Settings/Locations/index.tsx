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
import { SettingsLocationsCreate } from './SettingsLocationsCreate';
import { SettingsLocationsUpdate } from './SettingsLocationsUpdate';

export const SettingsLocations = () => {
	const { t } = useTranslation();
	const [updateId, setUpdateId] = useState<number>();
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
	const { isAllowedTo } = useAccessContext();

	const handlePageChange = useCallback(
		(page: number, size: number) => {
			const params = getPaginatedParams(searchParams, page, size);
			navigate({ search: params.toString() });
		},
		[navigate, searchParams]
	);
	const locationParam = useDropdownParam(searchParams, current, pageSize);
	const { data: locations, isLoading: locationsLoading } = useQuery(
		['locations', locationParam],
		() => locationsAPI.list(locationParam)
	);

	const columns: ColumnsType<API.LocationType> = [
		{
			title: t('Name'),
			dataIndex: 'name',
			width: 220,
			ellipsis: true,
			render: (text, record) =>
				isAllowedTo('CHANGE_LOCATION') ? (
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
			title: t('Country'),
			dataIndex: 'country',
			width: 180,
			ellipsis: true,
			render: (value) => value?.name,
		},
		{
			title: t('Territory'),
			dataIndex: 'country',
			width: 150,
			ellipsis: true,
			render: (value) => value?.territory?.name,
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
						endpoint={PRIVATE_ROUTES.LOCATIONS}
						isDisabled={!isAllowedTo('CHANGE_LOCATION')}
					/>
				);
			},
		},
	];

	return (
		<>
			<SettingsLocationsCreate isVisible={isCreateModal} setVisible={setCreateModal} />
			{updateId && (
				<SettingsLocationsUpdate
					clearId={() => setUpdateId(undefined)}
					id={updateId}
					isVisible={isUpdateModal}
					setVisible={setUpdateModal}
				/>
			)}
			<DataTableWrapper
				createButton={
					isAllowedTo('ADD_LOCATION') && (
						<Button type='primary' size='large' onClick={() => setCreateModal(true)}>
							{t('Create Location')}
						</Button>
					)
				}
				activeItem={activeItem}
				count={locations?.count}
				menuOptions={generateStatusOptions('Locations')}
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
					dataSource={locations?.results}
					columns={columns}
					rowKey='id'
					scroll={{ y: '100%' }}
					loading={locationsLoading}
					pagination={{
						locale: { items_per_page: `/\t${t('page')}` },
						pageSize: pageSize,
						current: current,
						total: locations?.count || 0,
						onChange: handlePageChange,
						showSizeChanger: true,
					}}
				/>
			</DataTableWrapper>
		</>
	);
};
