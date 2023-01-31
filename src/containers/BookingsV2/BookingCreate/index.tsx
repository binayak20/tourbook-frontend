import { Card, Typography } from '@/components/atoms';
import { Col, Row, Tabs } from 'antd';
import { useTranslation } from 'react-i18next';
import { useTabs } from './hooks';

export const BookingCreate = () => {
	const { t } = useTranslation();
	const { items, activeKey, handleActiveKeyChange } = useTabs();

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
				<Card bodyStyle={{ paddingTop: 0 }}>
					<Tabs
						{...{
							items,
							activeKey,
							onChange: handleActiveKeyChange,
						}}
					/>
				</Card>
			</Col>
		</Row>
	);
};
