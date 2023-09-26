import { Typography } from '@/components/atoms';
import { Row } from 'antd';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

type SheduledEmailHeaderProps = {
	count?: number;
};

export const SheduledEmailHeader: FC<SheduledEmailHeaderProps> = ({ count }) => {
	const { t } = useTranslation();

	return (
		<>
			<Row align='middle' justify='space-between'>
				<Typography.Title level={4} type='primary' className='margin-0'>
					{t('Scheduled emails')} ({count || 0})
				</Typography.Title>
			</Row>
		</>
	);
};
