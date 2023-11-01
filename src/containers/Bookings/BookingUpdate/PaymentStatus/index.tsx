import { Typography } from '@/components/atoms';
import { useBookingContext } from '@/components/providers/BookingProvider';
import config from '@/config';
import { bookingsAPI } from '@/libs/api';
import { Card, Col, Divider, message, Progress, Row } from 'antd';
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import { DeadlinePicker } from './DeadlinePicker';
import { convertToCurrency } from '@/utils/helpers';

enum FieldsType {
	PAYMENTS_DEADLINE = 'PAYMENTS_DEADLINE',
	SECOND_PAYMENT_DEADLINE = 'SECOND_PAYMENT_DEADLINE',
	RESIDUE_DEADLINE = 'RESIDUE_DEADLINE',
}

const initialDeallines = {
	payment: new Date(),
	second_payment: new Date(),
	residue: new Date(),
};

type PaymentStatusProps = {
	isLoading: boolean;
};

export const PaymentStatus: React.FC<PaymentStatusProps> = ({ isLoading }) => {
	const {
		bookingInfo: {
			id,
			first_payment_deadline,
			second_payment_deadline,
			residue_payment_deadline,
			second_payment_percent,
			currency,
		},
		calculatedPrice: { due, paid_percentage },
		isDisabled,
	} = useBookingContext();

	const { t } = useTranslation();
	const [deallines, setDeallines] = useState(initialDeallines);
	const queryClient = useQueryClient();

	useEffect(() => {
		setDeallines({
			payment: first_payment_deadline || initialDeallines.payment,
			second_payment: second_payment_deadline || initialDeallines.second_payment,
			residue: residue_payment_deadline || initialDeallines.residue,
		});
	}, [first_payment_deadline, residue_payment_deadline, second_payment_deadline]);

	const { mutate } = useMutation(
		(payload: API.BookingPaymentDeadlinePayload) => bookingsAPI.updatePaymentDeadline(id!, payload),
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

			const payload = {
				first_payment_deadline: moment(
					field === FieldsType.PAYMENTS_DEADLINE ? value : deallines.payment
				).format(config.dateFormat),
				second_payment_deadline: moment(
					field === FieldsType.SECOND_PAYMENT_DEADLINE ? value : deallines.second_payment
				).format(config.dateFormat),
				residue_payment_deadline: moment(
					field === FieldsType.RESIDUE_DEADLINE ? value : deallines.residue
				).format(config.dateFormat),
			};

			mutate(payload);
		},
		[deallines.payment, deallines.second_payment, deallines.residue, mutate]
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
					<Progress type='circle' percent={paid_percentage} />
				</Col>
				<Col span={24} className='margin-3-top' style={{ textAlign: 'center' }}>
					<Typography.Title level={5} type='primary'>
						{t('Due')}: {convertToCurrency(due, currency?.currency_code)}
					</Typography.Title>
				</Col>
			</Row>

			<Divider />
			<DeadlinePicker
				label={t('First payments deadline')}
				value={deallines?.payment}
				onChange={(value) => handleChange(FieldsType.PAYMENTS_DEADLINE, value)}
				disabled={isDisabled}
				loading={isLoading}
				reminderType='first_payment'
			/>

			{second_payment_percent > 0 && (
				<>
					<Divider />
					<DeadlinePicker
						label={t('Second payments deadline')}
						value={deallines?.second_payment}
						onChange={(value) => handleChange(FieldsType.SECOND_PAYMENT_DEADLINE, value)}
						disabled={isDisabled}
						loading={isLoading}
						reminderType='second_payment'
					/>
				</>
			)}

			<Divider />
			<DeadlinePicker
				label={t('Residue deadline')}
				value={deallines?.residue}
				onChange={(value) => handleChange(FieldsType.RESIDUE_DEADLINE, value)}
				disabled={isDisabled}
				loading={isLoading}
				reminderType='residue_payment'
			/>
		</Card>
	);
};
