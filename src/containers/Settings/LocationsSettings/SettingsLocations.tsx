import { Typography } from '@/components/atoms';
import { StatusColumn } from '@/components/StatusColumn';
import config from '@/config';
import { settingsAPI } from '@/libs/api';
import { Location, Territory } from '@/libs/api/@types/settings';
import { PRIVATE_ROUTES } from '@/routes/paths';
import { Button, Col, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SettingsLocationsCreate } from './SettingsLocationsCreate';
import { SettingsLocationsUpdate } from './SettingsLocationsUpdate';

export const SettingsLocations = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const [updateId, setUpdateId] = useState<number>();
	const [isCreateModal, setCreateModal] = useState(false);
	const [isUpdateModal, setUpdateModal] = useState(false);
	const currentPage = useMemo(() => parseInt(searchParams.get('page') || '1'), [searchParams]);
	const { data, isLoading } = useQuery(['settings-locations', currentPage], () =>
		settingsAPI.locations(currentPage)
	);
	const { data: territories } = useQuery('settings-locations-territory', () =>
		settingsAPI.territories()
	);
	const territoryList = useMemo(() => territories?.results, [territories]);
	const locationList = useMemo(() => {
		if (data?.results) return data?.results;
		return [];
	}, [data]);

	const handlePageChange = useCallback(
		(page: number) => {
			navigate(page > 1 ? `?page=${page}` : '');
		},
		[navigate]
	);

	const columns: ColumnsType<Location> = [
		{
			title: t('Name'),
			dataIndex: 'name',
			width: 300,
			ellipsis: true,
			render: (text, record) => (
				<Button
					type='link'
					onClick={() => {
						setUpdateId(record.id);
						setUpdateModal(true);
					}}
				>
					{text}
				</Button>
			),
		},
		{
			title: t('Territory'),
			dataIndex: 'parent',
			width: 300,
			ellipsis: true,
			render: (_, record) =>
				territoryList?.find((territory: Territory) => territory.id === record.territory)?.name,
		},
		{
			title: t('Status'),
			dataIndex: 'status',
			width: 150,
			render: (_, record) => {
				return (
					<StatusColumn
						status={record?.is_active}
						id={record.id}
						endpoint={PRIVATE_ROUTES.LOCATIONS}
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
						{t('Locations')}
					</Typography.Title>
				</Col>
				<Col>
					<Button type='primary' size='large' onClick={() => setCreateModal(true)}>
						{t('Create Location')}
					</Button>
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
					dataSource={locationList}
					columns={columns}
					rowKey='id'
					scroll={{ y: '100%' }}
					loading={isLoading}
					pagination={{
						pageSize: config.itemsPerPage,
						current: currentPage,
						total: data?.count,
						onChange: handlePageChange,
					}}
				/>
			</div>
		</div>
	);
};
