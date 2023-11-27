import BackButton from '@/components/BackButton';
import { Card } from '@/components/atoms';
import { Col, Row, Tabs } from 'antd';
import { useTabs } from '../hooks/useTabs';

export const TourDetails = () => {
	const { items, activeKey, handleActiveKeyChange } = useTabs();

	return (
		<Row>
			<Col span={24}>
				<BackButton />
				<Card bodyStyle={{ paddingTop: 0 }}>
					<Tabs
						{...{
							items,
							activeKey,
							onChange: handleActiveKeyChange,
						}}
						destroyInactiveTabPane={true}
					/>
				</Card>
			</Col>
		</Row>
	);
};
