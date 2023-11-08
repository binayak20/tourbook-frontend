import { StatusColumn } from '@/components/StatusColumn';
import { DataTableWrapper } from '@/components/atoms/DataTable/DataTableWrapper';
import config from '@/config';
import { stationsAPI } from '@/libs/api';
import { PRIVATE_ROUTES } from '@/routes/paths';
import { generateStatusOptions, getPaginatedParams } from '@/utils/helpers';
import { Button, Empty, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SettingsStationCreate } from './SettingsStationCreate';
import { SettingsStationUpdate } from './SettingsStationUpdate';

export const SettingsStations = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [updateId, setUpdateId] = useState<number>();
	const [updateModal, setUpdateModal] = useState(false);
	const [createModal, setCreateModal] = useState(false);
	const [searchParams] = useSearchParams();
	const activeItem = useMemo(() => searchParams.get('status') || 'active', [searchParams]);
	const { current, pageSize } = useMemo(() => {
		return {
			current: parseInt(searchParams.get('page') || '1'),
			pageSize: parseInt(searchParams.get('limit') || `${config.itemsPerPage}`),
		};
	}, [searchParams]);

	const stationsParams = useMemo(() => {
		const status = searchParams.get('status') || 'active';
		return {
			page: current,
			limit: pageSize,
			is_active:
				status === 'active'
					? ('true' as unknown as string)
					: status === 'inactive'
					? ('false' as unknown as string)
					: undefined,
		};
	}, [current, pageSize, searchParams]);

	const { isLoading, data } = useQuery(['stations', stationsParams], () =>
		stationsAPI.list(stationsParams)
	);

	const handlePageChange = useCallback(
		(page: number, size: number) => {
			const params = getPaginatedParams(searchParams, page, size);
			navigate({ search: params.toString() });
		},
		[navigate, searchParams]
	);

	const columns: ColumnsType<API.Station> = [
		{
			title: t('Name'),
			dataIndex: 'name',
			render: (text, record) => {
				return (
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
				);
			},
		},
		{
			title: t('Type'),
			dataIndex: 'station_type',
			render: (value) => value?.name,
		},
		{
			title: t('Status'),
			dataIndex: 'is_active',
			width: '120px',
			render: (value, record) => (
				<StatusColumn
					status={record?.is_active}
					id={record.id}
					endpoint={PRIVATE_ROUTES.STATIONS}
					successMessage='Station status has been updated'
					onSuccessFn={() => {
						queryClient.invalidateQueries('stations');
					}}
					isDisabled={record?.station_type?.name !== 'Other'}
				/>
			),
		},
	];

	return (
		<>
			<SettingsStationCreate isVisible={createModal} setVisible={setCreateModal} />
			{updateId && (
				<SettingsStationUpdate
					clearId={() => setUpdateId(undefined)}
					id={updateId}
					isVisible={updateModal}
					setVisible={setUpdateModal}
				/>
			)}

			<DataTableWrapper
				activeItem={activeItem}
				menuOptions={generateStatusOptions('Stations')}
				count={data?.count}
				createButton={
					<Button type='primary' size='large' onClick={() => setCreateModal(true)}>
						{t('Create Station')}
					</Button>
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
					scroll={{ y: '100%' }}
					dataSource={data?.results || []}
					pagination={{
						locale: { items_per_page: `/\t${t('page')}` },
						pageSize: pageSize,
						current: current,
						total: data?.count || 0,
						onChange: handlePageChange,
						showSizeChanger: true,
					}}
				/>
			</DataTableWrapper>
		</>
	);
};
