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
	const [activeTab, setActiveTab] = useState<TabPaneType>('PAYMENTS');
	const [enabledTabs] = useState<TabPaneType[]>(['TOUR', 'PASSENGER', 'PAYMENTS']);

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
							<TourBasics />
						</Tabs.TabPane>

						<Tabs.TabPane
							tab={t('Passenger Details')}
							key='PASSENGER'
							disabled={!enabledTabs.includes('PASSENGER')}
						>
							<PassengerDetails
								backBtnProps={{
									disabled: !enabledTabs.includes('TOUR'),
									onClick: () => setActiveTab('TOUR'),
								}}
							/>
						</Tabs.TabPane>

						<Tabs.TabPane
							tab={t('Payments')}
							key='PAYMENTS'
							disabled={!enabledTabs.includes('PAYMENTS')}
						>
							<Payments
								backBtnProps={{
									disabled: !enabledTabs.includes('PASSENGER'),
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
