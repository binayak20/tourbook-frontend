import { Typography } from '@/components/atoms';
import { Button, Card, Col, Row, Tabs } from 'antd';
import { useTranslation } from 'react-i18next';
import { TourBasics } from './TourBasics';

export const BookingUpdate = () => {
	const { t } = useTranslation();

	return (
		<Row gutter={16}>
			<Col span={24} className='margin-4-bottom'>
				<Row align='middle' justify='space-between'>
					<Col span={12}>
						<Typography.Title level={4} type='primary' className='margin-0'>
							22-0001
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
					<Tabs defaultActiveKey='TOUR' style={{ marginTop: -12 }}>
						<Tabs.TabPane tab={t('Tour Basics')} key='TOUR'>
							<TourBasics />
						</Tabs.TabPane>

						<Tabs.TabPane tab={t('Passenger Details')} key='PASSENGER'>
							{/* <PassengerDetails
								backBtnProps={{
									disabled: !enabledTabs.includes('TOUR'),
									onClick: () => setActiveTab('TOUR'),
								}}
							/> */}
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
