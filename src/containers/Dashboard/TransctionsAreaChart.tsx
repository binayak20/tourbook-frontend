import { Typography } from '@/components/atoms';
import { useStoreSelector } from '@/store';
import { Card, Col, Row } from 'antd';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
	Area,
	AreaChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';

export type AreaChart = {
	title: string;
	amount: number;
};

export type TransctionsAreaChartProps = {
	data: AreaChart[];
};

export const TransctionsAreaChart: FC<TransctionsAreaChartProps> = ({ data }) => {
	const { t } = useTranslation();
	const { primaryColor } = useStoreSelector((state) => state.app);

	return (
		<Card style={{ borderRadius: 10 }}>
			<Row style={{ marginBottom: 30 }}>
				<Col>
					<Typography.Title level={4} type='primary' className='margin-0'>
						{t('Last 30 Days Transactions')}
					</Typography.Title>
				</Col>
			</Row>

			<ResponsiveContainer width='100%' height={400}>
				<AreaChart
					width={500}
					height={400}
					data={data}
					margin={{
						top: 10,
						right: 30,
						left: 0,
						bottom: 0,
					}}
				>
					<CartesianGrid strokeDasharray='3 3' />
					<XAxis dataKey='title' />
					<YAxis />
					<Tooltip />
					<Area type='monotone' dataKey='amount' stroke={primaryColor} fill={primaryColor} />
				</AreaChart>
			</ResponsiveContainer>
		</Card>
	);
};
