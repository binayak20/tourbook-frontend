import { Typography } from '@/components/atoms';
import { Button, ButtonProps, Col, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

type PaymentsProps = {
	backBtnProps?: ButtonProps;
	finishBtnProps?: ButtonProps;
	data?: API.BookingCostResponse;
};

export const Payments: FC<PaymentsProps> = (props) => {
	const { backBtnProps, finishBtnProps, data } = props;
	const { t } = useTranslation();

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
		},
		{
			align: 'right',
			title: t('Total Price'),
			dataIndex: 'total_price',
		},
	];

	return (
		<Row>
			<Col span={24}>
				<Table
					dataSource={data?.cost_preview_rows || []}
					columns={columns}
					rowKey='id'
					pagination={false}
					scroll={{ y: '100%' }}
					summary={() => (
						<Table.Summary.Row>
							<Table.Summary.Cell colSpan={3} index={0} align='right'>
								<Typography.Title level={5} type='primary' className='margin-0'>
									{t('Total')}
								</Typography.Title>
							</Table.Summary.Cell>
							<Table.Summary.Cell index={1} align='right'>
								<Typography.Title level={5} type='primary' className='margin-0'>
									{data?.sub_total || 0}
								</Typography.Title>
							</Table.Summary.Cell>
						</Table.Summary.Row>
					)}
				/>
			</Col>

			<Col span={24} style={{ marginTop: 30 }}>
				<Row gutter={16} justify='center'>
					<Col>
						<Button type='default' size='large' style={{ minWidth: 120 }} {...backBtnProps}>
							{t('Back')}
						</Button>
					</Col>
					<Col>
						<Button type='primary' size='large' style={{ minWidth: 120 }} {...finishBtnProps}>
							{t('Create')}
						</Button>
					</Col>
				</Row>
			</Col>
		</Row>
	);
};
