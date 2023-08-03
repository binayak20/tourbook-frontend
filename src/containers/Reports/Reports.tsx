import { Typography } from '@/components/atoms';
import { reportsAPI } from '@/libs/api';
import { ReportDateRangePayload, ReportYearPayload } from '@/libs/api/@types';
import { Col, Row, Select, message } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { ReportDownloadFormYear } from './ReportDownloadFormYear';
import { ReportDownloadForm } from './ReportDownloanForm';

export const Reports = () => {
	const { t } = useTranslation();
	const [dateRangeType, setDateRangeType] = useState();
	const [paymentType, setPaymentType] = useState();
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
	const paymentTypeField = (
		<Select
			placeholder={t('Payment type')}
			size='large'
			style={{ width: '100%' }}
			onChange={setPaymentType}
			value={paymentType}
		>
			<Select.Option value='first_payment'>{t('First payment')}</Select.Option>
			<Select.Option value='residue_payment'>{t('Residue payment')} </Select.Option>
		</Select>
	);

	const { mutate: handleDownloadSalesReport, isLoading: loadingSalesReport } = useMutation(
		(payload: ReportDateRangePayload) => reportsAPI.salesReportDownload(payload, dateRangeType),
		{
			onSuccess: (data: Blob, payload) => {
				const filename = `${dateRangeType}-(${payload?.from_date}_to_${payload?.to_date}).xlsx`;
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

	const downloadSalesReport = (from_date: string, to_date: string) => {
		handleDownloadSalesReport({ from_date, to_date });
	};

	const { mutate: handleDownloadPaymentReport, isLoading: loadingPaymentReport } = useMutation(
		(payload: ReportDateRangePayload) => reportsAPI.paymentReportDownload(payload, paymentType),
		{
			onSuccess: (data: Blob, payload) => {
				const filename = `payment-report-${paymentType}-(${payload?.from_date}_to_${payload?.to_date}).xlsx`;
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

	const downloadPaymentReport = (from_date: string, to_date: string) => {
		handleDownloadPaymentReport({ from_date, to_date });
	};

	const { mutate: handleDownloadTransactionReport, isLoading: loadingTransactionReport } =
		useMutation(
			(payload: ReportDateRangePayload) => reportsAPI.transactionReportDownload(payload),
			{
				onSuccess: (data: Blob, payload) => {
					const filename = `transaction-report-(${payload?.from_date}_to_${payload?.to_date}).xlsx`;
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

	const downloadTransactionReport = (from_date: string, to_date: string) => {
		handleDownloadTransactionReport({ from_date, to_date });
	};

	const { mutate: handleDownloadRemainingBookReport, isLoading: loadingRemainingReport } =
		useMutation(
			(payload: ReportYearPayload) => reportsAPI.bookingsRemainingPaymentReportDownload(payload),
			{
				onSuccess: (data: Blob, payload) => {
					const filename = `booking-remaining-payment-report-(${payload?.year}).pdf`;
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

	const downloadRemainingReport = (year: string) => {
		handleDownloadRemainingBookReport({ year });
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
			<Row gutter={[16, 16]}>
				<Col xxl={{ span: 8 }} xl={{ span: 12 }}>
					<ReportDownloadForm
						title={t('Sales Report')}
						subTitle={t('Select a date range for the report')}
						onDownload={downloadSalesReport}
						additionalField={periodField}
						dateRangeType={dateRangeType}
						isLoading={loadingSalesReport}
					/>
				</Col>
				<Col xxl={{ span: 8 }} xl={{ span: 12 }}>
					<ReportDownloadForm
						title={t('Payment Deadline Report')}
						subTitle={t('Select a date range for the report')}
						onDownload={downloadPaymentReport}
						additionalField={paymentTypeField}
						dateRangeType={paymentType}
						isLoading={loadingPaymentReport}
					/>
				</Col>
				<Col xxl={{ span: 8 }} xl={{ span: 12 }}>
					<ReportDownloadForm
						title={t('Transaction Report')}
						subTitle={t('Select a date range for the report')}
						onDownload={downloadTransactionReport}
						dateRangeType=''
						isLoading={loadingTransactionReport}
					/>
				</Col>
				<Col xxl={{ span: 8 }} xl={{ span: 12 }}>
					<ReportDownloadFormYear
						title={t('Remaining Booking Payment')}
						subTitle={t('Select a year for the report')}
						onDownload={downloadRemainingReport}
						isLoading={loadingRemainingReport}
					/>
				</Col>
			</Row>
		</div>
	);
};
