import { Typography } from '@/components/atoms';
import { DownloadOutlined } from '@ant-design/icons';

import { Button, Card, Col, DatePicker, Divider, Row } from 'antd';
import dayjs from 'dayjs';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

type dayjs = dayjs.Dayjs;
const { RangePicker } = DatePicker;

export type ReportDownloadFormProps = {
	title: string;
	subTitle: string;
	onDownload(a: string, b: string): void;
	additionalField?: any;
	disableDownload?: boolean;
	dateRangeType?: string;
	isLoading: boolean;
};

export const ReportDownloadForm: FC<ReportDownloadFormProps> = ({
	title,
	subTitle = 'Select a Date Range for the report',
	onDownload,
	additionalField,
	disableDownload,
	dateRangeType,
	isLoading,
}) => {
	const { t } = useTranslation();
	const [dateRange, setDateRange] = useState<(dayjs.Dayjs | null)[]>([]);

	const changeDate = (dates?: any) => {
		if (dates) {
			setDateRange([dates[0], dates[1]]);
		}
	};
	return (
		<Card style={{ borderRadius: 10 }}>
			<Typography.Title level={4} type='primary'>
				{title}
			</Typography.Title>

			<Divider style={{ margin: '1rem 0 0.5rem 0' }} />
			<Row gutter={[16, 16]}>
				<Col span={24}>
					<Typography.Paragraph style={{ marginBottom: 0 }} color='grey'>
						{subTitle}
					</Typography.Paragraph>
				</Col>
				<Col span={16}>
					<RangePicker
						format={['YYYY-MM-DD', 'YYYYMMDD', 'YYMMDD', 'YYYY/MM/DD']}
						placeholder={[t('Start date'), t('End date')]}
						style={{ width: '100%' }}
						onChange={changeDate}
						size='large'
					/>
				</Col>
				<Col span={8}>{additionalField}</Col>
				<Col span={24}>
					<Button
						size='large'
						icon={<DownloadOutlined />}
						target='_blank'
						onClick={() =>
							onDownload(
								`${dayjs(dateRange[0])?.format('YYYY-MM-DD')}`,
								`${dayjs(dateRange[1])?.format('YYYY-MM-DD')}`
							)
						}
						disabled={
							(!dateRangeType && dateRangeType !== '') ||
							disableDownload ||
							!(dateRange && dateRange[0] && dateRange[1])
						}
						loading={isLoading}
					>
						<span>{t('Download')}</span>
					</Button>
				</Col>
			</Row>
		</Card>
	);
};
