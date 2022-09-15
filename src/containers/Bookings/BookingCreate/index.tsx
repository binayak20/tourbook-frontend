import { Typography } from '@/components/atoms';
import { bookingsAPI } from '@/libs/api';
import { PRIVATE_ROUTES } from '@/routes/paths';
import { Card, Col, message, Row, Tabs } from 'antd';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { PassengerDetails } from './PassengerDetails';
import { Payments } from './Payments';
import { TourBasics } from './TourBasics';

type TabPaneType = 'TOUR' | 'PASSENGER' | 'PAYMENTS';

export const BookingCreate = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState<TabPaneType>('PASSENGER');
	const [enabledTabs, setEnabledTabs] = useState<TabPaneType[]>(['TOUR']);
	const [payload, setPayload] = useState<API.BookingCreatePayload>({} as API.BookingCreatePayload);

	const navigateToList = useCallback(() => {
		navigate(`/dashboard/${PRIVATE_ROUTES.BOOKINGS}`);
	}, [navigate]);

	// Mutate create booking
	const { mutate: mutateCreateBooking } = useMutation(() => bookingsAPI.create(payload), {
		onSuccess: () => {
			message.success(t('Booking created successfully!'));
			navigateToList();
		},
		onError: (error: Error) => {
			message.error(error.message);
		},
	});

	// Get booking calculation
	const { mutate: mutateCalculation, data: calculation } = useMutation(
		(payload: API.BookingCostPayload) => bookingsAPI.calculateCost(payload)
	);

	return (
		<Row>
			<Col span={24} className='margin-4-bottom'>
				<Row align='middle'>
					<Col span={24}>
						<Typography.Title level={4} type='primary' className='margin-0'>
							{t('Create booking')}
						</Typography.Title>
					</Col>
				</Row>
			</Col>

			<Col span={24}>
				<Card>
					<Tabs
						activeKey={activeTab}
						onChange={(key) => setActiveTab(key as TabPaneType)}
						style={{ marginTop: -12 }}
					>
						<Tabs.TabPane
							tab={t('Tour Basics')}
							key='TOUR'
							disabled={!enabledTabs.includes('TOUR')}
						>
							<TourBasics
								totalPrice={calculation?.sub_total || 0}
								onFieldsChange={mutateCalculation}
								onFinish={(values) => {
									setPayload((prev) => ({ ...prev, ...values }));
									setActiveTab('PASSENGER');
									setEnabledTabs((prev) => [...prev, 'PASSENGER']);
								}}
							/>
						</Tabs.TabPane>

						<Tabs.TabPane
							tab={t('Passenger Details')}
							key='PASSENGER'
							disabled={!enabledTabs.includes('PASSENGER')}
						>
							<PassengerDetails
								totalPassengers={payload.number_of_passenger || 5}
								backBtnProps={{
									disabled: !enabledTabs.includes('TOUR'),
									onClick: () => setActiveTab('TOUR'),
								}}
								onFinish={(values) => {
									setPayload((prev) => ({ ...prev, passengers: values }));
									setActiveTab('PAYMENTS');
									setEnabledTabs((prev) => [...prev, 'PAYMENTS']);
								}}
							/>
						</Tabs.TabPane>

						<Tabs.TabPane
							tab={t('Payments')}
							key='PAYMENTS'
							disabled={!enabledTabs.includes('PAYMENTS')}
						>
							<Payments
								data={calculation}
								backBtnProps={{
									disabled: !enabledTabs.includes('PASSENGER'),
									onClick: () => setActiveTab('PASSENGER'),
								}}
								finishBtnProps={{
									onClick: () => mutateCreateBooking(),
								}}
							/>
						</Tabs.TabPane>
					</Tabs>
				</Card>
			</Col>
		</Row>
	);
};
