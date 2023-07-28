import { Typography } from '@/components/atoms';
import { reportsAPI } from '@/libs/api';
import { Col, Row, Select } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ReportDownloadForm } from './ReportDownloanForm';

const downloadFile = (data: Blob, filename: string) => {
	const link = document.createElement('a');
	link.href = window.URL.createObjectURL(data);
	link.download = filename;
	document.body.append(link);
	link.click();
	link.remove();
};

export const Reports = () => {
	const { t } = useTranslation();
	const [dateRangeType, setDateRangeType] = useState();
	const periodField = (
		<Select
			placeholder={t('Date type')}
			size='large'
			style={{ width: '100%' }}
			onChange={setDateRangeType}
			value={dateRangeType}
		>
			<Select.Option value='sales-report-on-departure-date'>{t('Departure date')}</Select.Option>
			<Select.Option value='sales-report-on-booking-date'>{t('Booking date')} </Select.Option>
		</Select>
	);

	const handleDownload = async (dates: { fromDate: string; toDate: string }) => {
		const data = await reportsAPI.salesReportDownload(dates, dateRangeType);
		// Create a Blob object from the data
		const blob = new Blob([data], {
			type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
		});
		const filename = `${dateRangeType}-(${dates?.fromDate}/${dates?.toDate}).xls`;
		downloadFile(blob, filename);
	};

	const downloadSalesReport = (fromDate: string, toDate: string) => {
		handleDownload({ fromDate, toDate });
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
						title={t('Sales Report')}
						subTitle={t('Select a date range for the report')}
						onDownload={downloadSalesReport}
						additionalField={periodField}
						dateRangeType={dateRangeType}
					/>
				</Col>
			</Row>
		</div>
	);
};
