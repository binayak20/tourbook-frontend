import { Col, Row, Tabs } from 'antd';
import { useTabs } from '../hooks/useTabsBasicTour';

export const TourBasicTabs = () => {
	const { items, activeKey, handleActiveKeyChange } = useTabs();

	return (
		<Row>
			<Col span={24}>
				<Tabs
					{...{
						items,
						activeKey,
						onChange: handleActiveKeyChange,
					}}
					destroyInactiveTabPane={true}
				/>
			</Col>
		</Row>
	);
};
