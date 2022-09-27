import { Typography } from '@/components/atoms';
import { Col, Row, Table } from 'antd';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export const SettingsAccountingConfigure = () => {
	const { t } = useTranslation();

	return (
		<Row>
			<Col span={24} className='margin-4-bottom'>
				<Row align='middle'>
					<Col span={12}>
						<Typography.Title level={4} type='primary' noMargin>
							{t('Accounting configure')}
						</Typography.Title>
					</Col>
					<Col span={12} style={{ textAlign: 'right' }}>
						<Link className='ant-btn ant-btn-primary ant-btn-lg' to='create'>
							{t('Configure new provider')}
						</Link>
					</Col>
				</Row>
			</Col>

			<Col span={24}>
				<Table
				// rowKey='id'
				// loading={isLoading}
				// columns={columns}
				// dataSource={data?.results || []}
				// pagination={{
				// 	pageSize: config.itemsPerPage,
				// 	current: currentPage,
				// 	total: data?.count || 0,
				// 	onChange: handlePageChange,
				// }}
				/>
			</Col>
		</Row>
	);
};
