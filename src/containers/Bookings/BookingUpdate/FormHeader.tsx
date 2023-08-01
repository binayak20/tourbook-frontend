import { Typography } from '@/components/atoms';
import { useBookingContext } from '@/components/providers/BookingProvider';
import { bookingsAPI } from '@/libs/api';
import { PRIVATE_ROUTES } from '@/routes/paths';
import { getColorForStatus } from '@/utils/helpers';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Badge, Button, Col, message, Modal, Row } from 'antd';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';

type FormHeaderProps = {
	isLoading: boolean;
};

export const FormHeader: React.FC<FormHeaderProps> = ({ isLoading }) => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { id } = useParams() as unknown as { id: number };
	const {
		bookingInfo: {
			reference,
			to_transferred_booking,
			from_transferred_booking,
			booking_status,
			is_departed,
		},
		isDisabled,
	} = useBookingContext();

	const { mutate: mutateCancelBooking } = useMutation(() => bookingsAPI.cancel(id), {
		onSuccess: (data) => {
			message.success(data.detail);
			navigate(`/dashboard/${PRIVATE_ROUTES.BOOKINGS}`);
		},
		onError: (error: Error) => {
			message.error(error.message);
		},
	});

	const confirm = () => {
		Modal.confirm({
			title: t('Are you sure?'),
			icon: <ExclamationCircleOutlined />,
			content: t('Do you want to cancel this booking? This action cannot be undone.'),
			okText: t('Yes'),
			cancelText: t('Not now'),
			onOk: () => {
				mutateCancelBooking();
			},
		});
	};

	return (
		<Col span={24} className='margin-4-bottom'>
			<Row align='middle' justify='space-between'>
				<Col span={12}>
					<Typography.Title level={4} type='primary' className='margin-0'>
						{reference || ''}{' '}
						{to_transferred_booking?.reference && (
							<Typography.Text type='secondary' style={{ fontSize: 20 }}>
								{t('transferred to')} {to_transferred_booking.reference}{' '}
							</Typography.Text>
						)}
						{from_transferred_booking?.reference && (
							<Typography.Text type='secondary' style={{ fontSize: 20 }}>
								{t('transferred from')} {from_transferred_booking.reference}{' '}
							</Typography.Text>
						)}
						{booking_status && (
							<Badge
								style={{
									fontSize: 14,
									textTransform: 'capitalize',
									backgroundColor: getColorForStatus(booking_status),
								}}
								count={booking_status}
							/>
						)}
					</Typography.Title>
				</Col>
				<Col>
					<Button
						danger
						size='large'
						type='default'
						onClick={confirm}
						disabled={isDisabled || isLoading || is_departed}
					>
						{t('Cancel booking')}
					</Button>
				</Col>
			</Row>
		</Col>
	);
};
