import { Typography } from '@/components/atoms';
import { reportsAPI } from '@/libs/api';
import { Col, Row } from 'antd';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { ReportDownloadForm } from './ReportDownloanForm';

export const Reports = () => {
	const { t } = useTranslation();
	// const cards = useMemo(() => {
	// 	const {
	// 		today_bookings_summary,
	// 		today_departed_tours_summary,
	// 		this_month_transactions_summary,
	// 	} = data || {};

	// 	const list: StatisticsCardProps[] = [];
	// 	if (today_bookings_summary) {
	// 		list.push({
	// 			title: today_bookings_summary.title,
	// 			value: today_bookings_summary.count,
	// 			percentage: today_bookings_summary.percentage_change,
	// 			statsType: 'TODAY',
	// 			type: 'BOOKINGS',
	// 		});
	// 	}
	// 	if (today_departed_tours_summary) {
	// 		list.push({
	// 			title: today_departed_tours_summary.title,
	// 			value: today_departed_tours_summary.count,
	// 			percentage: today_departed_tours_summary.percentage_change,
	// 			statsType: 'TODAY',
	// 			type: 'TOURS',
	// 		});
	// 	}
	// 	if (this_month_transactions_summary) {
	// 		list.push({
	// 			title: this_month_transactions_summary.title,
	// 			value: this_month_transactions_summary.total_amount,
	// 			percentage: this_month_transactions_summary.percentage_change,
	// 			currency: this_month_transactions_summary.currency,
	// 			statsType: 'MONTH',
	// 			type: 'TRANSACTIONS',
	// 		});
	// 	}
	// 	return list;
	// }, [data]);

	// const barChartData = useMemo(() => {
	// 	const { bookings_summary_by_months_range } = data || {};

	// 	return (
	// 		bookings_summary_by_months_range?.map(({ booking_month_year, booking_count }) => ({
	// 			title: booking_month_year,
	// 			bookings: booking_count,
	// 		})) || []
	// 	);
	// }, [data]);

	// const areaChartData = useMemo(() => {
	// 	const { last_thirty_days_transactions } = data || {};

	// 	return (
	// 		last_thirty_days_transactions?.map(({ day, amount }) => ({
	// 			title: day.toString(),
	// 			amount,
	// 		})) || []
	// 	);
	// }, [data]);
	// const downloadSalesReportWrapper = (dates: Date[]) => {
	// 	const [fromDate, toDate] = dates;
	// 	return reportsAPI.salesReportDownload(fromDate, toDate);
	// };
	const { mutate: HandleDownload } = useMutation<
		Blob,
		Error,
		{ fromDate: string; toDate: string },
		unknown
	>((dates: { fromDate: string; toDate: string }) => reportsAPI.salesReportDownload(dates), {
		onSuccess: (data: Blob) => {
			// Your success handling code
			const filename = `Booking-list.xlsx`;
			const link = document.createElement('a');
			link.href = window.URL.createObjectURL(data);
			link.download = filename;
			document.body.append(link);
			link.click();
			link.remove();
		},
		onError: (error: Error) => {
			// Your error handling code
		},
	});
	// const { mutate: HandleDownload } = useMutation<Blob, Error, string, unknown>(
	// 	(fromDate: string, toDate: string) => reportsAPI.salesReportDownload(fromDate, toDate),
	// 	{
	// 		onSuccess: (data: Blob) => {
	// 			const filename = `Booking-list.xlsx`;
	// 			const link = document.createElement('a');
	// 			link.href = window.URL.createObjectURL(data);
	// 			link.download = filename;
	// 			document.body.append(link);
	// 			link.click();
	// 			link.remove();
	// 		},
	// 		onError: (error: Error) => {
	// 			message.error(error.message);
	// 		},
	// 	}
	// );
	const downloadSalesReport = (fromDate: string, toDate: string) => {
		// console.log('fromDate', fromDate);
		// console.log('toDate', toDate);
		//  const fromDateObj = new Date(fromDate);
		//  const toDateObj = new Date(toDate);
		HandleDownload({ fromDate, toDate });
	};

	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
			<Row align='middle' justify='space-between'>
				<Col span={12}>
					<Typography.Title level={4} type='primary' className='margin-0'>
						{t('Reports')}
					</Typography.Title>
				</Col>
			</Row>
			<Row gutter={16}>
				<Col xxl={{ span: 8 }} xl={{ span: 12 }}>
					<ReportDownloadForm
						title='Sales Report'
						subTitle='Select a departure date range for the report'
						onDownload={downloadSalesReport}
					/>
				</Col>
				{/* {cards.map((card, index) => (
					<Col span={12} key={index}>
						<StatisticsCard {...card} />
					</Col>
				))} */}
			</Row>
			{/* <Row gutter={16}>
				<Col span={12}>
					<BookingsBarChart data={barChartData} />
				</Col>
				<Col span={12}>
					<TransctionsAreaChart data={areaChartData} />
				</Col>
			</Row> */}
		</div>
	);
};
