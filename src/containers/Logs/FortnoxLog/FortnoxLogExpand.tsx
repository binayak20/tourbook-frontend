import { Typography } from '@/components/atoms';
import { FortnoxLog } from '@/libs/api/@types';
import { Col, Empty, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';

import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

const LabeledText: FC<{ label?: string; text?: string }> = ({ label, text }) => (
	<Row gutter={[4, 4]}>
		<Col span={24}>
			<Typography.Text style={{ fontWeight: 500 }}>{label}</Typography.Text>
		</Col>
		<Col>
			<Typography.Text>{text}</Typography.Text>
		</Col>
	</Row>
);
const FortnoxLogExpand: FC<{ log: FortnoxLog }> = ({ log }) => {
	const parsedResponse = JSON.parse(log?.response);
	const { t } = useTranslation();
	const columns: ColumnsType<{
		Account: number;
		Description: string;
		Credit: number;
		Debit: number;
	}> = [
		{
			title: t('Account'),
			dataIndex: 'Account',
		},
		{
			title: t('Description'),
			dataIndex: 'Description',
		},
		{
			title: t('Credit'),
			dataIndex: 'Credit',
			align: 'right',
		},
		{
			title: t('Debit'),
			dataIndex: 'Debit',
			align: 'right',
		},
	];

	if (log?.is_success)
		return (
			<div>
				<Row gutter={[12, 24]}>
					<Col span={24}>
						<LabeledText label={t('Description')} text={parsedResponse?.Voucher?.Description} />
					</Col>
					<Col span={6}>
						<LabeledText
							label={t('Verification series')}
							text={`${parsedResponse?.Voucher?.VoucherSeries} - ${parsedResponse?.Voucher?.VoucherNumber}`}
						/>
					</Col>
					<Col span={6}>
						<LabeledText
							label={t('Posting date')}
							text={parsedResponse?.Voucher?.TransactionDate}
						/>
					</Col>
					<Col span={6}>
						<LabeledText label={t('Cost center')} text={log?.fortnox_cost_center} />
					</Col>
					<Col span={6}>
						<LabeledText label={t('Project')} text={log?.fortnox_project} />
					</Col>
					<Col span={24}>
						<Table
							key='Account'
							pagination={false}
							size='small'
							columns={columns}
							dataSource={parsedResponse?.Voucher?.VoucherRows}
							summary={(pageData) => {
								const totalCredit = pageData.reduce((acc, row) => acc + row.Credit, 0);
								const totalDebit = pageData.reduce((acc, row) => acc + row.Debit, 0);
								return (
									<>
										<Table.Summary.Row style={{ fontWeight: 600, textAlign: 'right' }}>
											<Table.Summary.Cell index={0} />
											<Table.Summary.Cell index={1}>{t('Amount')}</Table.Summary.Cell>
											<Table.Summary.Cell index={2}>{totalCredit}</Table.Summary.Cell>
											<Table.Summary.Cell index={3}>{totalDebit}</Table.Summary.Cell>
										</Table.Summary.Row>
										<Table.Summary.Row style={{ fontWeight: 600, textAlign: 'right' }}>
											<Table.Summary.Cell index={0} />
											<Table.Summary.Cell index={1}>{t('Difference')}</Table.Summary.Cell>
											<Table.Summary.Cell index={2} />
											<Table.Summary.Cell index={3}>
												{Math.abs(totalDebit - totalCredit)}
											</Table.Summary.Cell>
										</Table.Summary.Row>
									</>
								);
							}}
						/>
					</Col>
				</Row>
			</div>
		);
	else return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
};

export default React.memo(FortnoxLogExpand);
