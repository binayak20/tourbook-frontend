import { Card } from '@/components/atoms';
import { Col, Row, Tabs } from 'antd';
import { useState } from 'react';
import { AdditionalActions } from './AdditionalActions';
import { FormHeader } from './FormHeader';
import { FormSkeleton } from './FormSkeleton';
import { useTabs } from './hooks';
import { PaymentStatus } from './PaymentStatus';

export const BookingUpdate = () => {
	const [isLoading, setLoading] = useState(true);
	const { items, activeKey, handleActiveKeyChange } = useTabs(setLoading);

	return (
		<Row gutter={16}>
			<FormHeader isLoading={isLoading} />

			<Col xl={6} xxl={4}>
				<PaymentStatus isLoading={isLoading} />
				<AdditionalActions isLoading={isLoading} />
			</Col>

			<Col xl={18} xxl={20}>
				<Card skeleton={<FormSkeleton />} loading={isLoading} bodyStyle={{ paddingTop: 0 }}>
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
