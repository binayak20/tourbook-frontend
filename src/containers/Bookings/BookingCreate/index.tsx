import { Typography } from '@/components/atoms';
import { Card, Col, Row, Tabs } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PassengerDetails } from './PassengerDetails';
import { Payments } from './Payments';
import { TourBasics } from './TourBasics';

type TabPaneType = 'TOUR' | 'PASSENGER' | 'PAYMENTS';

export const BookingCreate = () => {
	const { t } = useTranslation();
	const [activeTab] = useState<TabPaneType>('TOUR');

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
					<Tabs activeKey={activeTab} style={{ marginTop: -12 }}>
						<Tabs.TabPane tab={t('Tour Basics')} key='TOUR' disabled={activeTab !== 'TOUR'}>
							<TourBasics />
						</Tabs.TabPane>
						<Tabs.TabPane
							tab={t('Passenger Details')}
							key='PASSENGER'
							disabled={activeTab !== 'PASSENGER'}
						>
							<PassengerDetails />
						</Tabs.TabPane>
						<Tabs.TabPane tab={t('Payments')} key='PAYMENTS' disabled={activeTab !== 'PAYMENTS'}>
							<Payments />
						</Tabs.TabPane>
					</Tabs>
				</Card>
			</Col>
		</Row>
	);
};
