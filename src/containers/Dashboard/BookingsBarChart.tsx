import { Typography } from '@/components/atoms';
import { useStoreSelector } from '@/store';
import { Card, Col, Row, Select } from 'antd';
import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';

export type BarChart = {
	title: string;
	bookings: number;
};

export type BookingsBarChartProps = {
	data: BarChart[];
};

export const BookingsBarChart: FC<BookingsBarChartProps> = ({ data }) => {
	const { t } = useTranslation();
	const { primaryColor } = useStoreSelector((state) => state.app);
	const [selected, setSelected] = useState(6);

	const options = useMemo(() => {
		return [
			{ label: t('Last 6 months'), value: 6 },
			{ label: t('Last 3 months'), value: 3 },
		];
	}, [t]);

	return (
		<Card style={{ borderRadius: 10 }}>
			<Row gutter={12} justify='space-between' style={{ marginBottom: 30 }}>
				<Col>
					<Typography.Title level={4} type='primary' className='margin-0'>
						{t('Monthly Bookings')}
					</Typography.Title>
				</Col>
				<Col>
					<Select options={options} value={selected} onChange={(value) => setSelected(value)} />
				</Col>
			</Row>

			<ResponsiveContainer width='100%' height={400}>
				<BarChart
					width={500}
					height={300}
					data={data.slice(-selected)}
					margin={{
						top: 5,
						right: 30,
						left: 20,
						bottom: 5,
					}}
				>
					<CartesianGrid strokeDasharray='3 3' />
					<XAxis dataKey='title' />
					<YAxis />
					<Tooltip />
					<Legend />
					<Bar dataKey='bookings' fill={primaryColor} />
				</BarChart>
			</ResponsiveContainer>
		</Card>
	);
};
