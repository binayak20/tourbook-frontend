import { Typography } from '@/components/atoms';
import { Button, Card, Col, Row, Tabs } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type TabPaneType = 'TOUR' | 'PASSENGER' | 'PAYMENTS';

export const BookingUpdate = () => {
	const { t } = useTranslation();
	const [activeTab, setActiveTab] = useState<TabPaneType>('PAYMENTS');
	const [enabledTabs] = useState<TabPaneType[]>(['TOUR', 'PASSENGER', 'PAYMENTS']);

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
							{/* <TourBasics /> */}
						</Tabs.TabPane>

						<Tabs.TabPane
							tab={t('Passenger Details')}
							key='PASSENGER'
							disabled={!enabledTabs.includes('PASSENGER')}
						>
							{/* <PassengerDetails
								backBtnProps={{
									disabled: !enabledTabs.includes('TOUR'),
									onClick: () => setActiveTab('TOUR'),
								}}
							/> */}
						</Tabs.TabPane>

						<Tabs.TabPane
							tab={t('Payments')}
							key='PAYMENTS'
							disabled={!enabledTabs.includes('PAYMENTS')}
						>
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
