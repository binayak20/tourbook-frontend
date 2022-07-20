import { StatusColumn } from '@/components/StatusColumn';
import { settingsAPI } from '@/libs/api';
import { Button, Col, Pagination, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';

import { SettingsTerritoriesCreate } from './SettingsTerritoriesCreate';
import { SettingsTerritoriesUpdate } from './SettingsTerritoriesUpdate';

export const SettingsTerritories = () => {
	const { t } = useTranslation();
	const [isCreateModal, setCreateModal] = useState(false);
	const [isUpdateModal, setUpdateModal] = useState(false);
	const [updateId, setUpdateId] = useState<number>();

	const { data, isLoading } = useQuery('settings-locations-territories', () =>
		settingsAPI.territories()
	);

	const territoryList = useMemo(() => {
		if (data?.results) return data?.results;
		return [];
	}, [data]);

	const columns: ColumnsType<API.Territory> = [
		{
			title: t('Name'),
			dataIndex: 'name',
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
			title: t('Status'),
			dataIndex: 'status',
			width: 200,
			render: (_, record) => {
				return (
					<StatusColumn
						status={record?.is_active}
						id={record.id}
						endpoint={'locations-territory'}
					/>
				);
			},
		},
	];
	return (
		<div style={{ display: 'flex', height: '100%', flexDirection: 'column', gap: '1rem' }}>
			<Row align='middle' justify='end'>
				<Col>
					<Button type='primary' size='large' onClick={() => setCreateModal(true)}>
						{t('Create Territory')}
					</Button>
					<SettingsTerritoriesCreate isVisible={isCreateModal} setVisible={setCreateModal} />
					{updateId && (
						<SettingsTerritoriesUpdate
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
					dataSource={territoryList}
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
