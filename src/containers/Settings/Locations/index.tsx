import { Typography } from '@/components/atoms';
import { StatusColumn } from '@/components/StatusColumn';
import config from '@/config';
import { locationsAPI } from '@/libs/api';
import { PRIVATE_ROUTES } from '@/routes/paths';
import { DEFAULT_LIST_PARAMS } from '@/utils/constants';
import { Button, Col, Row, Table } from 'antd';
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
	const currentPage = useMemo(() => parseInt(searchParams.get('page') || '1'), [searchParams]);
	const { isAllowedTo } = useAccessContext();

	const handlePageChange = useCallback(
		(page: number) => {
			navigate(page > 1 ? `?page=${page}` : '');
		},
		[navigate]
	);

	const { data: locations, isLoading: locationsLoading } = useQuery(
		['locations', currentPage],
		() => locationsAPI.list({ page: currentPage })
	);

	const { data: territories, isLoading: territoriesLoading } = useQuery('territories', () =>
		locationsAPI.territories(DEFAULT_LIST_PARAMS)
	);

	const { data: countries, isLoading: countiresLoading } = useQuery('countries', () =>
		locationsAPI.countries(DEFAULT_LIST_PARAMS)
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
			render: (value) => countries?.results?.find((country) => country.id === value)?.name,
		},
		{
			title: t('Territory'),
			dataIndex: 'territory',
			width: 150,
			ellipsis: true,
			render: (value) => territories?.results?.find((territory) => territory.id === value)?.name,
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
		<div style={{ display: 'flex', height: '100%', flexDirection: 'column', gap: '1rem' }}>
			<Row align='middle' justify='space-between'>
				<Col span={12}>
					<Typography.Title level={4} type='primary' className='margin-0'>
						{t('Locations')} ({locations?.count || 0})
					</Typography.Title>
				</Col>
				<Col>
					{isAllowedTo('ADD_LOCATION') && (
						<Button type='primary' size='large' onClick={() => setCreateModal(true)}>
							{t('Create Location')}
						</Button>
					)}
					<SettingsLocationsCreate isVisible={isCreateModal} setVisible={setCreateModal} />
					{updateId && (
						<SettingsLocationsUpdate
							clearId={() => setUpdateId(undefined)}
							id={updateId}
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
					dataSource={locations?.results}
					columns={columns}
					rowKey='id'
					scroll={{ y: '100%' }}
					loading={locationsLoading && territoriesLoading && countiresLoading}
					pagination={{
						pageSize: config.itemsPerPage,
						current: currentPage,
						total: locations?.count || 0,
						onChange: handlePageChange,
					}}
				/>
			</div>
		</div>
	);
};
