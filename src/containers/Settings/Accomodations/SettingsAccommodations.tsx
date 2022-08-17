import { Typography } from '@/components/atoms';
import { StatusColumn } from '@/components/StatusColumn';
import { settingsAPI } from '@/libs/api';
import { Accommodation } from '@/libs/api/@types/settings';
import { PRIVATE_ROUTES } from '@/routes/paths';
import { Button, Col, Pagination, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { SettingsAccommodationCreate } from './SettingsAccommodationCreate';
import { SettingsAccommodationUpdate } from './SettingsAccommodationUpdate';

export const SettingsAccommodations: React.FC = () => {
	const { t } = useTranslation();
	const [isCreateModal, setCreateModal] = useState(false);
	const [isUpdateModal, setUpdateModal] = useState(false);
	const [updateId, setUpdateId] = useState<number>();
	const { data, isLoading } = useQuery('settings-accomodations', () =>
		settingsAPI.accommodations()
	);
	const accommodationsList = useMemo(() => {
		if (data?.results) return data?.results;
		return [];
	}, [data]);

	const columns: ColumnsType<Accommodation> = [
		{
			title: t('Name'),
			dataIndex: 'name',
			width: 250,
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
			title: t('Address'),
			dataIndex: 'address',
			ellipsis: true,
			width: 250,
		},
		{
			title: t('Description'),
			dataIndex: 'description',
			ellipsis: true,
			width: 200,
		},
		{
			title: t('Website'),
			dataIndex: 'website_url',
			ellipsis: true,
			width: 200,
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
						endpoint={PRIVATE_ROUTES.ACCOMMODATIONS}
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
						{t('Accommodations')}
					</Typography.Title>
				</Col>
				<Col>
					<Button type='primary' size='large' onClick={() => setCreateModal(true)}>
						{t('Create Accommodation')}
					</Button>
					<SettingsAccommodationCreate isVisible={isCreateModal} setVisible={setCreateModal} />
					{updateId && (
						<SettingsAccommodationUpdate
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
					dataSource={accommodationsList}
					columns={columns}
					rowKey='id'
					pagination={false}
					scroll={{ y: '100%' }}
					loading={isLoading}
				/>
			</div>
			<Row align='middle' justify='end'>
				<Col>
					<Pagination />
				</Col>
			</Row>
		</div>
	);
};
