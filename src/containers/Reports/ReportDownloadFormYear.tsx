import { Typography } from '@/components/atoms';

import { DownloadOutlined } from '@ant-design/icons';
import type { DatePickerProps } from 'antd';
import { Button, Card, Col, DatePicker, Divider, Row } from 'antd';
import moment from 'moment';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

type moment = moment.Moment;

export type ReportDownloadFormProps = {
	title: string;
	subTitle: string;
	onDownload(a: string): void;
	isLoading: boolean;
};

export const ReportDownloadFormYear: FC<ReportDownloadFormProps> = ({
	title,
	subTitle = 'Select a Time Range for the report',
	onDownload,
	isLoading,
}) => {
	console.log('isLoading:', isLoading);
	const { t } = useTranslation();
	const [date, setDate] = useState<moment.Moment | null>();
	const onChange: DatePickerProps['onChange'] = (date) => {
		setDate(date);
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
				<Col span={24}>
					<DatePicker
						placeholder={t('Select year')}
						style={{ width: '100%' }}
						picker='year'
						value={date}
						onChange={onChange}
						size='large'
					/>
				</Col>
				<Col span={24}>
					<Button
						size='large'
						type='ghost'
						icon={<DownloadOutlined />}
						target='_blank'
						onClick={() => onDownload(moment(date).format('YYYY'))}
						disabled={!date}
						loading={isLoading}
					>
						<span>{t('Download')}</span>
					</Button>
				</Col>
			</Row>
		</Card>
	);
};
