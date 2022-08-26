import { Typography } from '@/components/atoms';
import config from '@/config';
import { locationsAPI } from '@/libs/api';
import { Col, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';

export const SettingsCountries = () => {
	const { t } = useTranslation();

	const { data: territoryList, isLoading: territoryListLoading } = useQuery('territories', () =>
		locationsAPI.territories()
	);

	const { data: countryList, isLoading: countryListLoading } = useQuery('countries', () =>
		locationsAPI.countries()
	);

	const columns: ColumnsType<API.Country> = [
		{
			title: t('Name'),
			dataIndex: 'name',
			ellipsis: true,
		},
		{
			title: t('Territory'),
			dataIndex: 'territory',
			ellipsis: true,
			render: (value: number) => territoryList?.find((territory) => territory.id === value)?.name,
		},
	];
	return (
		<div style={{ display: 'flex', height: '100%', flexDirection: 'column', gap: '1rem' }}>
			<Row align='middle'>
				<Col span={12}>
					<Typography.Title level={4} type='primary' className='margin-0'>
						{t('Countries')}
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
					dataSource={countryList}
					columns={columns}
					rowKey='id'
					scroll={{ y: '100%' }}
					loading={countryListLoading && territoryListLoading}
					pagination={{
						pageSize: config.itemsPerPage,
						total: countryList?.length,
					}}
				/>
			</div>
		</div>
	);
};
