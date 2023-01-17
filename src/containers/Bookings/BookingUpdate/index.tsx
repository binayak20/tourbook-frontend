import { Typography } from '@/components/atoms';
import config from '@/config';
import { bookingsAPI } from '@/libs/api';
import { PRIVATE_ROUTES } from '@/routes/paths';
import { getColorForStatus } from '@/utils/helpers';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Badge, Button, Card, Col, FormInstance, message, Modal, Row, Tabs } from 'antd';
import moment from 'moment';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { PassengerDetails, PassengerItem } from '../BookingCreate/PassengerDetails';
import { Payments } from '../BookingCreate/Payments';
import { AdditionalActions } from './AdditionalActions';
import { PaymentStatus } from './PaymentStatus';
import { TourBasics } from './TourBasics';

type TabPaneType = 'TOUR' | 'PASSENGER' | 'PAYMENTS';

export const BookingUpdate = () => {
	const [activeTab, setActiveTab] = useState<TabPaneType>('TOUR');
	const [enabledTabs, setEnabledTabs] = useState<TabPaneType[]>(['TOUR']);
	const { t } = useTranslation();
	const { id } = useParams() as unknown as { id: number };
	const queryClient = useQueryClient();
	const tourBasicsFormRef = useRef<FormInstance>(null);
	const navigate = useNavigate();

	const navigateToList = useCallback(() => {
		navigate(`/dashboard/${PRIVATE_ROUTES.BOOKINGS}`);
	}, [navigate]);

	// Get booking calculation
	const { mutate: mutateCalculation, data: calculation } = useMutation(
		(payload: API.BookingCostPayload) => bookingsAPI.calculateCost({ ...payload, booking: id }),
		{
			onSuccess: () => {
				setEnabledTabs(['TOUR', 'PASSENGER', 'PAYMENTS']);
			},
			onError: (error: Error) => {
				message.error(error.message);
			},
		}
	);

	const { data, isLoading: isBookingLoading } = useQuery('booking', () => bookingsAPI.get(id), {
		onSuccess: async (data) => {
			tourBasicsFormRef.current?.setFieldsValue({
				tour: data?.tour.id,
				currency: data?.currency.id,
				number_of_passenger: data?.number_of_passenger,
				is_passenger_took_transfer: data?.is_passenger_took_transfer,
				user_type: 'individual',
				booking_fee_percent: data?.booking_fee_percent,
				duration: [moment(data?.departure_date), moment(data?.return_date)],
				station: data?.station?.id || 'no-transfer',
			});

			mutateCalculation({
				tour: data?.tour.id,
				is_passenger_took_transfer: data?.is_passenger_took_transfer,
				currency: data?.currency.id,
				number_of_passenger: data?.number_of_passenger,
				supplements: data?.supplements || [],
			});

			setEnabledTabs((prev) => [...prev, 'PASSENGER']);
		},
		onError: (error: Error) => {
			message.error(error.message);
		},
	});

	const tourBasicInitialValues = useMemo(() => {
		return {
			tour: data?.tour.id,
			stations: data?.tour?.stations || [],
			capacity: data?.tour.capacity || 0,
			remaining_capacity: data?.tour.remaining_capacity || 0,
			newRemainingCapacity:
				(data?.tour?.remaining_capacity || 0) + (data?.number_of_passenger || 0),
			totalPrice: calculation?.sub_total || 0,
			supplements: data?.supplements || [],
			totalPassengers: data?.passengers?.length || 0,
		};
	}, [data, calculation]);

	const passengerDetailsInitialValues = useMemo(() => {
		const passengers: PassengerItem[] = [];

		const removeEmpty = (obj: object) => {
			return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));
		};

		for (const passenger of data?.passengers || []) {
			const item = removeEmpty(passenger) as PassengerItem;
			item.is_emergency_contact = !!item.emergency_contact_name;

			if (item?.date_of_birth) {
				item.date_of_birth = moment(item.date_of_birth) as unknown as string;
			}

			if (item?.passport_expiry_date) {
				item.passport_expiry_date = moment(item.passport_expiry_date) as unknown as string;
			}

			passengers.push(item);
		}

		return passengers;
	}, [data]);

	// Update booking details
	const { mutate: mutateBookingUpdate, isLoading: isBookingUpdateLoading } = useMutation(
		(payload: API.BookingUpdatePayload) => bookingsAPI.update(id, payload),
		{
			onSuccess: () => {
				queryClient.invalidateQueries('booking');
				setActiveTab('PASSENGER');
			},
			onError: (error: Error) => {
				message.error(error.message);
			},
		}
	);

	// Update passenger details
	const { mutate: mutateUpdatePassenger } = useMutation(
		({
			passengerID,
			payload,
		}: {
			passengerID: number;
			payload: API.BookingPassengerCreatePayload;
		}) => bookingsAPI.updatePassenger(id, passengerID, payload),
		{
			onSuccess: () => {
				queryClient.invalidateQueries('booking');
			},
			onError: (error: Error) => {
				message.error(error.message);
			},
		}
	);

	const { mutate: mutateCreatePassenger } = useMutation(
		(payload: API.BookingPassengerCreatePayload) => bookingsAPI.createPassenger(id, payload),
		{
			onSuccess: () => {
				queryClient.invalidateQueries('booking');
			},
			onError: (error: Error) => {
				message.error(error.message);
			},
		}
	);

	const handleBookingPassengers = useCallback(
		async (values?: (PassengerItem & { id?: number })[]) => {
			if (values) {
				for (const passenger of values) {
					await new Promise((resolve) => {
						if (passenger?.id) {
							mutateUpdatePassenger(
								{
									passengerID: passenger.id,
									payload: {
										...passenger,
										booking: id,
										date_of_birth: moment(passenger.date_of_birth).format(config.dateFormat),
										passport_expiry_date: passenger.passport_expiry_date
											? moment(passenger.passport_expiry_date).format(config.dateFormat)
											: null,
									},
								},
								{ onSettled: resolve }
							);
						} else {
							mutateCreatePassenger(
								{
									...passenger,
									booking: id,
									date_of_birth: moment(passenger.date_of_birth).format(config.dateFormat),
									passport_expiry_date: passenger.passport_expiry_date
										? moment(passenger.passport_expiry_date).format(config.dateFormat)
										: null,
								},
								{ onSettled: resolve }
							);
						}
					});
				}
			}
			setActiveTab('PAYMENTS');
		},
		[mutateUpdatePassenger, id, mutateCreatePassenger]
	);

	const { mutate: mutateCancelBooking } = useMutation(() => bookingsAPI.cancel(id), {
		onSuccess: (data) => {
			message.success(data.detail);
			navigateToList();
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

	const isDisabled = useMemo(() => {
		return ['cancelled', 'transferred'].includes(data?.booking_status || '');
	}, [data]);

	return (
		<Row gutter={16}>
			<Col span={24} className='margin-4-bottom'>
				<Row align='middle' justify='space-between'>
					<Col span={12}>
						<Typography.Title level={4} type='primary' className='margin-0'>
							{data?.reference || ''}{' '}
							{data?.to_transferred_booking?.reference && (
								<Typography.Text type='secondary' style={{ fontSize: 20 }}>
									{t('transferred to')} {data.to_transferred_booking.reference}{' '}
								</Typography.Text>
							)}
							{data?.from_transferred_booking?.reference && (
								<Typography.Text type='secondary' style={{ fontSize: 20 }}>
									{t('transferred from')} {data.from_transferred_booking.reference}{' '}
								</Typography.Text>
							)}
							{data?.booking_status && (
								<Badge
									style={{
										fontSize: 14,
										textTransform: 'capitalize',
										backgroundColor: getColorForStatus(data.booking_status),
									}}
									count={data.booking_status}
								/>
							)}
						</Typography.Title>
					</Col>
					<Col>
						<Button danger size='large' type='default' onClick={confirm} disabled={isDisabled}>
							{t('Cancel booking')}
						</Button>
					</Col>
				</Row>
			</Col>

			<Col xl={6} xxl={4}>
				<PaymentStatus
					bookingID={id}
					due={calculation?.due || 0}
					paidPercentage={calculation?.paid_percentage || 0}
					paymentsDeadline={data?.first_payment_deadline}
					residueDeadline={data?.residue_payment_deadline}
					disabled={isDisabled}
				/>
				<AdditionalActions
					bookingRef={data?.reference || ''}
					transferCapacity={data?.number_of_passenger || 0}
					disabled={isDisabled}
				/>
			</Col>

			<Col xl={18} xxl={20}>
				<Card>
					<Tabs
						activeKey={activeTab}
						onChange={(key) => setActiveTab(key as TabPaneType)}
						style={{ marginTop: -12 }}
						items={[
							{
								key: 'TOUR',
								label: t('Tour Basics'),
								disabled: !enabledTabs.includes('TOUR'),
								children: (
									<TourBasics
										fwdRef={tourBasicsFormRef}
										data={tourBasicInitialValues}
										onFieldsChange={mutateCalculation}
										isBookingLoading={isBookingLoading}
										isLoading={isBookingUpdateLoading}
										onFinish={mutateBookingUpdate}
										disabled={isDisabled}
									/>
								),
							},
							{
								key: 'PASSENGER',
								label: t('Passenger Details'),
								disabled: !enabledTabs.includes('PASSENGER'),
								children: (
									<PassengerDetails
										data={passengerDetailsInitialValues}
										totalPassengers={data?.number_of_passenger || 0}
										backBtnProps={{
											onClick: () => setActiveTab('TOUR'),
										}}
										onFinish={handleBookingPassengers}
										disabled={isDisabled}
									/>
								),
							},
							{
								key: 'PAYMENTS',
								label: t('Payments'),
								disabled: !enabledTabs.includes('PAYMENTS'),
								children: (
									<Payments
										data={calculation}
										backBtnProps={{
											onClick: () => setActiveTab('PASSENGER'),
										}}
										finishBtnProps={{ isVisible: false }}
									/>
								),
							},
						]}
					/>
				</Card>
			</Col>
		</Row>
	);
};
