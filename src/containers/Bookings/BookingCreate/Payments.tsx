import { Typography } from '@/components/atoms';
import { Button, Col, Divider, Empty, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Transactions } from './Transactions';
import { PaymentsProps } from './types';

export const Payments: React.FC<PaymentsProps> = ({
	cost_preview_rows,
	currency,
	sub_total,
	backBtnProps,
	finishBtnProps,
}) => {
	const { isVisible: isFinishBtnVisible = true, ...restFinishBtnProps } = finishBtnProps || {};
	const { t } = useTranslation();
	const { id } = useParams();
	const columns: ColumnsType<API.CostPreviewRow> = [
		{
			width: 200,
			ellipsis: true,
			title: t('Name'),
			dataIndex: 'name',
		},
		{
			align: 'center',
			title: t('Quantity'),
			dataIndex: 'quantity',
		},
		{
			align: 'right',
			title: t('Unit Price'),
			dataIndex: 'unit_price',
			render: (value) => {
				const isNegetive = Math.sign(value) === -1;
				return <Typography.Text {...(isNegetive && { type: 'danger' })}>{value}</Typography.Text>;
			},
		},
		{
			align: 'right',
			title: t('Total Price'),
			dataIndex: 'total_price',
			render: (value) => {
				const isNegetive = Math.sign(value) === -1;
				return (
					<Typography.Text
						{...(isNegetive && { type: 'danger' })}
					>{`${value} ${currency?.currency_code}`}</Typography.Text>
				);
			},
		},
	];

	return (
		<Row>
			<Col span={24}>
				<Typography.Title level={4} type='primary'>
					{t('Billing Details')}
				</Typography.Title>
				<Table
					locale={{
						emptyText: (
							<Empty
								image={Empty.PRESENTED_IMAGE_SIMPLE}
								description={<span>{t('No results found')}</span>}
							/>
						),
					}}
					dataSource={cost_preview_rows || []}
					columns={columns}
					rowKey='name'
					pagination={false}
					scroll={{ y: '100%' }}
					footer={() => (
						<Row justify='end'>
							<Col>
								<Typography.Title level={5} type='primary' className='margin-0'>
									{t('Total')}: {parseFloat(sub_total?.toString() || '0').toFixed(2)}{' '}
									{currency?.currency_code}
								</Typography.Title>
							</Col>
						</Row>
					)}
					style={{ height: 'inherit' }}
				/>
			</Col>

			<Col span={24} style={{ marginTop: 30 }}>
				<Row gutter={16} justify='center'>
					<Col>
						<Button type='default' size='large' style={{ minWidth: 120 }} {...backBtnProps}>
							{t('Back')}
						</Button>
					</Col>
					{isFinishBtnVisible && (
						<Col>
							<Button type='primary' size='large' style={{ minWidth: 120 }} {...restFinishBtnProps}>
								{t('Create')}
							</Button>
						</Col>
					)}
				</Row>
			</Col>

			{id && (
				<Fragment>
					<Divider />
					<Col span={24}>
						<Transactions />
					</Col>
				</Fragment>
			)}
		</Row>
	);
};
