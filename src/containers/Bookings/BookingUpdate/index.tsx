import { Typography } from '@/components/atoms';
import config from '@/config';
import { bookingsAPI } from '@/libs/api';
import { Button, Card, Col, Row, Tabs } from 'antd';
import moment from 'moment';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';
import { Payments } from '../BookingCreate/Payments';
import { PassengerDetails, PassengerItem } from './PassengerDetails';
import { PaymentStatus } from './PaymentStatus';
import { TourBasics } from './TourBasics';

type TabPaneType = 'TOUR' | 'PASSENGER' | 'PAYMENTS';

export const BookingUpdate = () => {
	const [activeTab, setActiveTab] = useState<TabPaneType>('TOUR');
	const { t } = useTranslation();
	const { id } = useParams() as unknown as { id: number };
	const queryClient = useQueryClient();

	const { data } = useQuery('booking', () => bookingsAPI.get(id));

	// Get booking calculation
	const { mutate: mutateCalculation, data: calculation } = useMutation(
		(payload: API.BookingCostPayload) => bookingsAPI.calculateCost(payload)
	);

	// Update booking details
	const { mutate: mutateBookingUpdate, isLoading: isBookingUpdateLoading } = useMutation(
		(payload: API.BookingUpdatePayload) => bookingsAPI.update(id, payload),
		{
			onSuccess: () => {
				queryClient.invalidateQueries('booking');
				setActiveTab('PASSENGER');
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
		}
	);

	const { mutate: mutateCreatePassenger } = useMutation(
		(payload: API.BookingPassengerCreatePayload) => bookingsAPI.createPassenger(id, payload),
		{
			onSuccess: () => {
				queryClient.invalidateQueries('booking');
			},
		}
	);

	const handleBookingPassengers = useCallback(
		(values?: PassengerItem) => {
			console.log(values);

			if (!values) {
				setActiveTab('PAYMENTS');
				return;
			}

			if (values?.id) {
				mutateUpdatePassenger({
					passengerID: values.id,
					payload: {
						...values,
						booking: id,
						date_of_birth: moment(values.date_of_birth).format(config.dateFormat),
					},
				});
			} else {
				mutateCreatePassenger({
					...values,
					booking: id,
					date_of_birth: moment(values.date_of_birth).format(config.dateFormat),
				});
			}
		},
		[mutateCreatePassenger, mutateUpdatePassenger, id]
	);

	return (
		<Row gutter={16}>
			<Col span={24} className='margin-4-bottom'>
				<Row align='middle' justify='space-between'>
					<Col span={12}>
						<Typography.Title level={4} type='primary' className='margin-0'>
							{data?.reference || ''}
						</Typography.Title>
					</Col>
					<Col>
						<Button danger size='large' type='default'>
							{t('Cancel booking')}
						</Button>
					</Col>
				</Row>
			</Col>

			<Col xl={6} xxl={4}>
				<PaymentStatus
					totalPaid={data?.total_payment || 0}
					totalPayable={data?.grand_total || 0}
					paymentsDeadline={data?.first_payment_deadline}
					residueDeadline={data?.residue_payment_deadline}
				/>
			</Col>
			<Col xl={18} xxl={20}>
				<Card>
					<Tabs
						activeKey={activeTab}
						onChange={(key) => setActiveTab(key as TabPaneType)}
						style={{ marginTop: -12 }}
					>
						<Tabs.TabPane tab={t('Tour Basics')} key='TOUR'>
							<TourBasics
								totalPrice={calculation?.sub_total || 0}
								onFieldsChange={mutateCalculation}
								initialValues={data}
								isLoading={isBookingUpdateLoading}
								onFinish={mutateBookingUpdate}
							/>
						</Tabs.TabPane>

						<Tabs.TabPane tab={t('Passenger Details')} key='PASSENGER'>
							<PassengerDetails
								values={data?.passengers || []}
								totalPassengers={data?.number_of_passenger || 0}
								backBtnProps={{
									onClick: () => setActiveTab('TOUR'),
								}}
								onFinish={handleBookingPassengers}
							/>
						</Tabs.TabPane>

						<Tabs.TabPane tab={t('Payments')} key='PAYMENTS'>
							<Payments
								data={calculation}
								backBtnProps={{
									onClick: () => setActiveTab('PASSENGER'),
								}}
							/>
						</Tabs.TabPane>
					</Tabs>
				</Card>
			</Col>
		</Row>
	);
};
