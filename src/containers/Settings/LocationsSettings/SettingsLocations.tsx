import { Typography } from '@/components/atoms';
import { StatusColumn } from '@/components/StatusColumn';
import config from '@/config';
import { locationsAPI } from '@/libs/api';
import { PRIVATE_ROUTES } from '@/routes/paths';
import { Button, Col, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { SettingsLocationsCreate } from './SettingsLocationsCreate';
import { SettingsLocationsUpdate } from './SettingsLocationsUpdate';

export const SettingsLocations = () => {
	const { t } = useTranslation();
	const [updateId, setUpdateId] = useState<number>();
	const [isCreateModal, setCreateModal] = useState(false);
	const [isUpdateModal, setUpdateModal] = useState(false);

	const { data: locationsList, isLoading: locationsLoading } = useQuery('locations', () =>
		locationsAPI.list()
	);

	const { data: territoriesList, isLoading: territoriesLoading } = useQuery('territories', () =>
		locationsAPI.territories()
	);

	const { data: countriesList, isLoading: countiresLoading } = useQuery('countries', () =>
		locationsAPI.countries()
	);

	const columns: ColumnsType<API.LocationType> = [
		{
			title: t('Name'),
			dataIndex: 'name',
			width: 220,
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
			title: t('Country'),
			dataIndex: 'country',
			width: 180,
			ellipsis: true,
			render: (value) => countriesList?.find((country) => country.id === value)?.name,
		},
		{
			title: t('Territory'),
			dataIndex: 'territory',
			width: 150,
			ellipsis: true,
			render: (value) => territoriesList?.find((territory) => territory.id === value)?.name,
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
					dataSource={locationsList}
					columns={columns}
					rowKey='id'
					scroll={{ y: '100%' }}
					loading={locationsLoading && territoriesLoading && countiresLoading}
					pagination={{
						pageSize: config.itemsPerPage,
						total: locationsList?.length,
					}}
				/>
			</div>
		</div>
	);
};
