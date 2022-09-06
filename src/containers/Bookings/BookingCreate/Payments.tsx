import { Typography } from '@/components/atoms';
import { Button, ButtonProps, Col, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

type PaymentsProps = {
	backBtnProps?: ButtonProps;
	finishBtnProps?: ButtonProps;
};

type DataType = {
	id: number;
	name: string;
	quantity: number;
	price: number;
};

export const Payments: FC<PaymentsProps> = (props) => {
	const { backBtnProps, finishBtnProps } = props;
	const { t } = useTranslation();

	const columns: ColumnsType<DataType> = [
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
			dataIndex: 'price',
		},
		{
			align: 'right',
			title: t('Total Price'),
			dataIndex: 'price',
			render: (price, { quantity }) => price * quantity,
		},
	];

	return (
		<Row>
			<Col span={24}>
				<Table
					dataSource={[{ id: 1, name: 'Tour', quantity: 2, price: 100 }]}
					columns={columns}
					rowKey='id'
					pagination={false}
					scroll={{ y: '100%' }}
					// loading={isLoading}
					summary={() => (
						<Table.Summary.Row>
							<Table.Summary.Cell colSpan={3} index={0} align='right'>
								<Typography.Title level={5} type='primary' className='margin-0'>
									{t('Total')}
								</Typography.Title>
							</Table.Summary.Cell>
							<Table.Summary.Cell index={1} align='right'>
								<Typography.Title level={5} type='primary' className='margin-0'>
									211580
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
							{t('Next')}
						</Button>
					</Col>
				</Row>
			</Col>
		</Row>
	);
};
