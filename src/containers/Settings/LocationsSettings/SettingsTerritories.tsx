import { Typography } from '@/components/atoms';
import config from '@/config';
import { locationsAPI } from '@/libs/api';
import { Col, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';

export const SettingsTerritories = () => {
	const { t } = useTranslation();

	const { data: territories, isLoading } = useQuery('territories', () =>
		locationsAPI.territories({})
	);

	const columns: ColumnsType<API.Territory> = [
		{
			title: t('Name'),
			dataIndex: 'name',
			ellipsis: true,
		},
	];
	return (
		<div style={{ display: 'flex', height: '100%', flexDirection: 'column', gap: '1rem' }}>
			<Row align='middle'>
				<Col span={12}>
					<Typography.Title level={4} type='primary' className='margin-0'>
						{t('Territories')}
					</Typography.Title>
				</Col>
			</Row>
			<div
				style={{
					maxWidth: '100%',
					minHeight: '1px',
				}}
			>
				<Table
					dataSource={territories?.results}
					columns={columns}
					rowKey='id'
					scroll={{ y: '100%' }}
					loading={isLoading}
					pagination={{
						pageSize: config.itemsPerPage,
						total: territories?.results?.length,
					}}
				/>
			</div>
		</div>
	);
};
