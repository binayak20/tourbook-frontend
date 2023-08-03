import { Typography } from '@/components/atoms';
import { DownloadOutlined } from '@ant-design/icons';

import { Button, Card, Col, DatePicker, Divider, Row } from 'antd';
import moment from 'moment';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

type moment = moment.Moment;
const { RangePicker } = DatePicker;

export type ReportDownloadFormProps = {
	title: string;
	subTitle: string;
	onDownload(a: string, b: string): void;
	additionalField?: any;
	disableDownload?: boolean;
	dateRangeType?: string;
};

export const ReportDownloadForm: FC<ReportDownloadFormProps> = ({
	title,
	subTitle = 'Select a Date Range for the report',
	onDownload,
	additionalField,
	disableDownload,
	dateRangeType,
}) => {
	const { t } = useTranslation();
	const [dateRange, setDateRange] = useState<(moment.Moment | null)[]>([]);

	const changeDate = (dates?: null | (moment | null)[], dateStrings?: string[]) => {
		console.log(dateStrings);
		if (dates) {
			setDateRange([dates[0], dates[1]]);
		} else {
			console.log('Clear');
		}
	};
	console.log(!(dateRange && dateRange[0] && dateRange[1]));
	console.log(disableDownload);
	console.log(!dateRangeType);
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
						type='ghost'
						icon={<DownloadOutlined />}
						target='_blank'
						onClick={() =>
							onDownload(
								`${moment(dateRange[0])?.format('YYYY-MM-DD')}`,
								`${moment(dateRange[1])?.format('YYYY-MM-DD')}`
							)
						}
						disabled={
							(!dateRangeType && dateRangeType !== '') ||
							disableDownload ||
							!(dateRange && dateRange[0] && dateRange[1])
						}
					>
						<span>{t('Download')}</span>
					</Button>
				</Col>
			</Row>
		</Card>
	);
};
