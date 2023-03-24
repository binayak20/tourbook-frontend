import { Typography } from '@/components/atoms';
import { PRIVATE_ROUTES } from '@/routes/paths';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { Card, Divider } from 'antd';
import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

type StatsType = 'TODAY' | 'MONTH';
type Type = 'BOOKINGS' | 'TOURS' | 'TRANSACTIONS';

export type StatisticsCardProps = {
	title: string;
	value: number;
	percentage: number;
	currency?: string;
	statsType?: StatsType;
	type?: Type;
};

export const StatisticsCard: FC<StatisticsCardProps> = ({
	title,
	value,
	percentage,
	currency,
	statsType = 'TODAY',
	type = 'BOOKINGS',
}) => {
	const { t } = useTranslation();
	const percentageTitle = useMemo(
		() => t(`since last ${statsType === 'TODAY' ? 'day' : 'month'}`),
		[statsType, t]
	);
	const percentageColor = useMemo(() => (percentage > 0 ? 'success' : 'danger'), [percentage]);
	const percentageIcon = useMemo(
		() => (percentage > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />),
		[percentage]
	);

	const linkTitle = useMemo(() => t(`View ${type.toLowerCase() as Lowercase<Type>}`), [t, type]);
	const link = useMemo(() => {
		switch (type) {
			case 'TOURS':
				return PRIVATE_ROUTES.TOURS;
			case 'TRANSACTIONS':
				return PRIVATE_ROUTES.TRANSACTIONS;
			default:
				return PRIVATE_ROUTES.BOOKINGS;
		}
	}, [type]);

	return (
		<Card style={{ borderRadius: 10 }}>
			<Typography.Title level={4} type='primary' className='margin-0'>
				{
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					t(`${title}`)
				}
			</Typography.Title>
			<Typography.Title level={1} type='primary'>
				{value}
				{currency && <Typography.Text type='secondary'>{currency}</Typography.Text>}
			</Typography.Title>

			<Divider />

			<Typography.Paragraph type='secondary'>
				<Typography.Text type={percentageColor}>
					{percentageIcon}
					{percentage}%
				</Typography.Text>{' '}
				{percentageTitle}
			</Typography.Paragraph>
			<Link to={link}>{linkTitle}</Link>
		</Card>
	);
};
