import { Typography } from '@/components/atoms';
import config from '@/config';
import { EditOutlined } from '@ant-design/icons';
import {
	Button,
	ButtonProps,
	Card,
	Col,
	DatePicker,
	DatePickerProps,
	Divider,
	Form,
	Progress,
	Row,
} from 'antd';
import moment from 'moment';
import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

type PaymentStatusProps = {
	totalPaid: number;
	totalPayable: number;
	paymentsDeadline?: string;
	residueDeadline?: string;
};

type ConditionalFieldProps = {
	isVisible: boolean;
	readonlyValue: string;
	buttonProps?: ButtonProps;
	datePickerProps?: DatePickerProps;
};

const ConditionalField: FC<ConditionalFieldProps> = ({
	isVisible,
	readonlyValue,
	datePickerProps,
	buttonProps,
}) =>
	isVisible ? (
		<DatePickerField size='large' {...datePickerProps} />
	) : (
		<Row gutter={12} align='middle' justify='space-between'>
			<Col>
				<Typography.Text type='warning'>{readonlyValue}</Typography.Text>
			</Col>
			<Col>
				<Button type='link' size='small' icon={<EditOutlined />} {...buttonProps} />
			</Col>
		</Row>
	);

export const PaymentStatus: FC<PaymentStatusProps> = (props) => {
	const { totalPaid, totalPayable, paymentsDeadline, residueDeadline } = props;
	const { t } = useTranslation();
	const [isPaymentsDeadlineVisible, setPaymentsDeadlineVisible] = useState(false);
	const [isResidueDeadlineVisible, setResidueDeadlineVisible] = useState(false);

	const paidPercentage = useMemo(() => (totalPaid / totalPayable) * 100, [totalPaid, totalPayable]);
	const remaining = useMemo(() => totalPayable - totalPaid, [totalPaid, totalPayable]);

	return (
		<Card
			title={
				<Typography.Title level={5} type='primary' className='margin-0'>
					{t('Payment Status')}
				</Typography.Title>
			}
		>
			<Row justify='center'>
				<Col>
					<Progress type='circle' percent={paidPercentage} />
				</Col>
				<Col span={24} className='margin-3-top' style={{ textAlign: 'center' }}>
					<Typography.Title level={5} type='primary'>
						{t('Due')}: {remaining} SEK
					</Typography.Title>
				</Col>
			</Row>

			<Divider />
			<Form.Item label={t('Payments deadline')}>
				<ConditionalField
					isVisible={isPaymentsDeadlineVisible}
					readonlyValue={moment(paymentsDeadline || new Date()).format(config.dateFormatReadable)}
					datePickerProps={{
						defaultValue: moment(paymentsDeadline || new Date()),
						onChange: () => setPaymentsDeadlineVisible(false),
					}}
					buttonProps={{
						onClick: () => setPaymentsDeadlineVisible(true),
					}}
				/>
			</Form.Item>

			<Divider />
			<Form.Item label={t('Residue deadline')}>
				<ConditionalField
					isVisible={isResidueDeadlineVisible}
					readonlyValue={moment(residueDeadline || new Date()).format(config.dateFormatReadable)}
					datePickerProps={{
						defaultValue: moment(residueDeadline || new Date()),
						onChange: () => setResidueDeadlineVisible(false),
					}}
					buttonProps={{
						onClick: () => setResidueDeadlineVisible(true),
					}}
				/>
			</Form.Item>
		</Card>
	);
};

const DatePickerField = styled(DatePicker)`
	width: 100%;
`;
