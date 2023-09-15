import { Typography } from '@/components/atoms';
import { Col, Input, Row } from 'antd';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

type SheduledEmailHeaderProps = {
	count?: number;
	searchEmailSetter: (email: string) => void;
	searchEventsetter: (event: string) => void;
};

export const SheduledEmailHeader: FC<SheduledEmailHeaderProps> = ({
	count,
	searchEmailSetter,
	searchEventsetter,
}) => {
	const { t } = useTranslation();

	const { Search } = Input;

	return (
		<>
			<Row align='middle' justify='space-between'>
				<Typography.Title level={4} type='primary' className='margin-0'>
					{t('Scheduled emails')} ({count || 0})
				</Typography.Title>
			</Row>
			<Row gutter={16} align='middle'>
				<Col span={10}>
					<Search
						size='large'
						addonBefore={t('Email')}
						placeholder={t('Search by email')}
						allowClear
						onSearch={(value) => {
							searchEmailSetter(value);
							//console.log('Email Search query:', value);
						}}
					/>
				</Col>
				<Col span={10}>
					<Search
						size='large'
						addonBefore={t('Event')}
						placeholder={t('Search by event')}
						allowClear
						onSearch={(value) => {
							searchEventsetter(value);
							//console.log('Event Search query:', value);
						}}
					/>
				</Col>
			</Row>
		</>
	);
};
