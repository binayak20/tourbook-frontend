import { Typography } from '@/components/atoms';
import { StatusColumn } from '@/components/StatusColumn';
import { settingsAPI } from '@/libs/api';
import { Airport } from '@/libs/api/@types/settings';
import { PRIVATE_ROUTES } from '@/routes/paths';
import { Button, Col, Pagination, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { SettingsAirportsCreate } from './SettingsAirportsCreate';
import { SettingsAirportsUpdate } from './SettingsAirportsUpdate';

export const SettingsAirports: React.FC = () => {
	const { t } = useTranslation();
	const [isCreateModal, setCreateModal] = useState(false);
	const [isUpdateModal, setUpdateModal] = useState(false);
	const [updateId, setUpdateId] = useState<number>();

	const { data, isLoading } = useQuery('settings-airports', () => settingsAPI.airports());
	const airportsList = useMemo(() => {
		if (data?.results) return data?.results;
		return [];
	}, [data]);

	const columns: ColumnsType<Airport> = [
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
			title: t('Description'),
			dataIndex: 'description',
			width: 400,
			ellipsis: true,
		},
		{
			title: t('Code'),
			dataIndex: 'airport_code',
			width: 150,
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
						endpoint={PRIVATE_ROUTES.AIRPORTS}
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
						{t('Airports')}
					</Typography.Title>
				</Col>
				<Col>
					<Button type='primary' size='large' onClick={() => setCreateModal(true)}>
						{t('Create Airport')}
					</Button>
					<SettingsAirportsCreate isVisible={isCreateModal} setVisible={setCreateModal} />
					{updateId && (
						<SettingsAirportsUpdate
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
					dataSource={airportsList}
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
