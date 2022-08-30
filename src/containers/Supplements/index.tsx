import { Typography } from '@/components/atoms';
import { supplementsAPI } from '@/libs/api';
import { Button, Col, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { SupplementCreateModalMemo } from './SupplementCreateModal';

export const Supplements = () => {
	const { t } = useTranslation();
	const [isModalVisible, setModalVisible] = useState(false);
	const [selectedSupplement, setSelectedSupplement] = useState<API.Supplement>();

	const { data, isLoading } = useQuery(['supplements'], () => supplementsAPI.list());

	const columns: ColumnsType<API.Supplement> = [
		{
			title: t('Name'),
			dataIndex: 'name',
			width: 250,
			ellipsis: true,
			render: (name, record) => (
				<Button
					type='link'
					style={{ padding: 0, height: 'auto' }}
					onClick={() => {
						setModalVisible(true);
						setSelectedSupplement(record);
					}}
				>
					{name}
				</Button>
			),
		},
		{
			title: t('Category'),
			dataIndex: 'supplement_category',
			render: (category) => category.name,
		},
		{ title: t('Price'), dataIndex: 'price' },
		{
			title: t('Quantity'),
			dataIndex: 'quantity',
		},
	];

	return (
		<div style={{ display: 'flex', height: '100%', flexDirection: 'column', gap: '1rem' }}>
			<Row align='middle' justify='space-between'>
				<Col span={12}>
					<Typography.Title level={4} type='primary' className='margin-0'>
						{t('All Supplements')}
					</Typography.Title>
				</Col>
				<Col>
					<Button size='large' type='primary' onClick={() => setModalVisible(true)}>
						{t('Create supplement')}
					</Button>
				</Col>
			</Row>
			<div
				style={{
					maxWidth: '100%',
					minHeight: '1px',
				}}
			>
				<Table
					dataSource={data?.results || []}
					columns={columns}
					rowKey='id'
					pagination={false}
					scroll={{ y: '100%' }}
					loading={isLoading}
				/>

				<SupplementCreateModalMemo
					visible={isModalVisible}
					data={selectedSupplement}
					mode={selectedSupplement ? 'update' : 'create'}
					onCancel={() => {
						setModalVisible(false);
						setSelectedSupplement(undefined);
					}}
				/>
			</div>
		</div>
	);
};
