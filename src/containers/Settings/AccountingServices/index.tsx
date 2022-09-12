import { Typography } from '@/components/atoms';
import { Col, Row } from 'antd';
import { useTranslation } from 'react-i18next';
import { EventWiseAccount } from './EventWiseAccountCard';

export const SettingsAccountingServices: React.FC = () => {
	const { t } = useTranslation();

	return (
		<Row gutter={[16, 16]}>
			<Col span={24} className='margin-4-bottom'>
				<Row align='middle'>
					<Col span={24}>
						<Typography.Title level={4} type='primary' className='margin-0'>
							{t('Accounting Services')}
						</Typography.Title>
					</Col>
				</Row>
			</Col>

			<Col span={24}>
				<EventWiseAccount />
			</Col>
			<Col span={24}>
				<EventWiseAccount isNew={true} />
			</Col>
		</Row>
	);
};
