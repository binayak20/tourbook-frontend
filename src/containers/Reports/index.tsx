import { Typography } from '@/components/atoms';
import { reportsAPI } from '@/libs/api';
import { Col, Row, Select, message } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { ReportDownloadForm } from './ReportDownloanForm';

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

	const { mutate: handleDownload } = useMutation(
		(dates: { fromDate: string; toDate: string }) =>
			reportsAPI.salesReportDownload(dates, dateRangeType),
		{
			onSuccess: (data: Blob, dates) => {
				const filename = `${dateRangeType}-(${dates?.fromDate}_to_${dates?.toDate}).xlsx`;
				const link = document.createElement('a');
				link.href = window.URL.createObjectURL(data);
				link.download = filename;
				document.body.append(link);
				link.click();
				link.remove();
			},
			onError: (error: Error) => {
				message.error(error.message);
			},
		}
	);

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
