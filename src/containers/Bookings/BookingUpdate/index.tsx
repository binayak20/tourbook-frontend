import { Typography } from '@/components/atoms';
import { bookingsAPI } from '@/libs/api';
import { Button, Card, Col, Row, Tabs } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { PassengerDetails } from './PassengerDetails';
import { TourBasics } from './TourBasics';

type TabPaneType = 'TOUR' | 'PASSENGER' | 'PAYMENTS';

export const BookingUpdate = () => {
	const [activeTab, setActiveTab] = useState<TabPaneType>('TOUR');
	const { t } = useTranslation();
	const { id } = useParams() as unknown as { id: number };

	const { data } = useQuery('booking', () => bookingsAPI.get(id));

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
				ppp
			</Col>
			<Col xl={18} xxl={20}>
				<Card>
					<Tabs
						activeKey={activeTab}
						onChange={(key) => setActiveTab(key as TabPaneType)}
						style={{ marginTop: -12 }}
					>
						<Tabs.TabPane tab={t('Tour Basics')} key='TOUR'>
							<TourBasics initialValues={data} totalPrice={data?.grand_total || 0} />
						</Tabs.TabPane>

						<Tabs.TabPane tab={t('Passenger Details')} key='PASSENGER'>
							<PassengerDetails
								values={data?.passengers || []}
								totalPassengers={data?.number_of_passenger || 0}
								backBtnProps={{
									onClick: () => setActiveTab('TOUR'),
								}}
							/>
						</Tabs.TabPane>

						<Tabs.TabPane tab={t('Payments')} key='PAYMENTS'>
							{/* <Payments
								backBtnProps={{
									disabled: !enabledTabs.includes('PASSENGER'),
									onClick: () => setActiveTab('PASSENGER'),
								}}
							/> */}
						</Tabs.TabPane>
					</Tabs>
				</Card>
			</Col>
		</Row>
	);
};
