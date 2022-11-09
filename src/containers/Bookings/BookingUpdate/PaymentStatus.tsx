import { Typography } from '@/components/atoms';
import config from '@/config';
import { bookingsAPI } from '@/libs/api';
import { EditOutlined } from '@ant-design/icons';
import { Button, Card, Col, DatePicker, Divider, Form, message, Progress, Row } from 'antd';
import moment from 'moment';
import { FC, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import styled from 'styled-components';

type PaymentStatusProps = {
	bookingID?: number;
	due: number;
	paidPercentage: number;
	paymentsDeadline?: string;
	residueDeadline?: string;
	disabled?: boolean;
};

type FieldsType = 'PAYMENTS_DEADLINE' | 'RESIDUE_DEADLINE';

export const PaymentStatus: FC<PaymentStatusProps> = (props) => {
	const { bookingID, due, paidPercentage, paymentsDeadline, residueDeadline, disabled } = props;
	const { t } = useTranslation();
	const [visibleFields, setVisibleFields] = useState<FieldsType[]>([]);
	const [deallines, setDeallines] = useState({
		firstPaymentDeadline: '',
		residuePaymentDeadline: '',
	});
	const queryClient = useQueryClient();

	useEffect(() => {
		setDeallines({
			firstPaymentDeadline: paymentsDeadline || '',
			residuePaymentDeadline: residueDeadline || '',
		});
	}, [paymentsDeadline, residueDeadline]);

	const handleToggleField = useCallback((newField: FieldsType) => {
		setVisibleFields((prev) => {
			if (prev.includes(newField)) {
				return prev.filter((field) => field !== newField);
			}

			return [...prev, newField];
		});
	}, []);

	const { mutate } = useMutation(
		(payload: API.BookingPaymentDeadlinePayload) =>
			bookingsAPI.updatePaymentDeadline(bookingID!, payload),
		{
			onSuccess: () => {
				message.success(t('Payment deadline updated!'));
				queryClient.invalidateQueries('booking');
			},
			onError: (error: Error) => {
				message.error(error.message);
			},
		}
	);

	const handleChange = useCallback(
		(field: FieldsType, value: ReturnType<typeof moment> | null) => {
			if (!value) return;
			setVisibleFields((prev) => prev.filter((field) => field !== field));

			const payload = {
				first_payment_deadline: moment(
					field === 'PAYMENTS_DEADLINE' ? value : deallines.firstPaymentDeadline
				).format(config.dateFormat),
				residue_payment_deadline: moment(
					field === 'RESIDUE_DEADLINE' ? value : deallines.residuePaymentDeadline
				).format(config.dateFormat),
			};

			mutate(payload);
		},
		[deallines.firstPaymentDeadline, deallines.residuePaymentDeadline, mutate]
	);

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
					<Progress type='circle' percent={parseInt(paidPercentage.toString(), 10)} />
				</Col>
				<Col span={24} className='margin-3-top' style={{ textAlign: 'center' }}>
					<Typography.Title level={5} type='primary'>
						{t('Due')}: {parseFloat(due.toString()).toFixed(2)} SEK
					</Typography.Title>
				</Col>
			</Row>

			<Divider />
			<Form.Item label={t('Payments deadline')}>
				{visibleFields.includes('PAYMENTS_DEADLINE') ? (
					<DatePickerField
						size='large'
						value={moment(deallines.firstPaymentDeadline)}
						onChange={(value) => handleChange('PAYMENTS_DEADLINE', value)}
					/>
				) : (
					<Row gutter={12} align='middle' justify='space-between'>
						<Col>
							<Typography.Text type='warning'>{deallines.firstPaymentDeadline}</Typography.Text>
						</Col>
						<Col>
							<Button
								type='link'
								size='small'
								icon={<EditOutlined />}
								onClick={() => handleToggleField('PAYMENTS_DEADLINE')}
								disabled={disabled}
							/>
						</Col>
					</Row>
				)}
			</Form.Item>

			<Divider />

			<Form.Item label={t('Residue deadline')}>
				{visibleFields.includes('RESIDUE_DEADLINE') ? (
					<DatePickerField
						size='large'
						value={moment(deallines.residuePaymentDeadline)}
						onChange={(value) => handleChange('RESIDUE_DEADLINE', value)}
					/>
				) : (
					<Row gutter={12} align='middle' justify='space-between'>
						<Col>
							<Typography.Text type='warning'>{deallines.residuePaymentDeadline}</Typography.Text>
						</Col>
						<Col>
							<Button
								type='link'
								size='small'
								icon={<EditOutlined />}
								onClick={() => handleToggleField('RESIDUE_DEADLINE')}
								disabled={disabled}
							/>
						</Col>
					</Row>
				)}
			</Form.Item>
		</Card>
	);
};

const DatePickerField = styled(DatePicker)`
	width: 100%;
`;
