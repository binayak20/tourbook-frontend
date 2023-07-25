import { Typography } from '@/components/atoms';
import { DownloadOutlined } from '@ant-design/icons';
import { Button, Card, Col, DatePicker, Divider, Row } from 'antd';
import moment from 'moment';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
// import { FormattedMessage } from 'react-intl';
// import { DatePicker } from 'antd';
// import { useDispatch } from 'react-redux';
// import { reportsUrl } from 'api/endpoints';
// import { useDispatch } from 'react-redux';
// import { downloadPayemntReportRequest } from './reducer';
// import { downloadTourDepartureReportRequest } from './reducer';
// import { Link } from 'react-router-dom';
// import { PRIVATE_ROUTE } from 'router';

// const { RangePicker } = DatePicker;

// function ReportDownloadForm() {
// 	//   {
// 	//   title,
// 	//   subTitle = 'Select a Time Range for the report',
// 	//   onDownload,
// 	//   additionalField,
// 	//   disableDownload,
// 	// }
// 	// const [dateRange, setDateRange] = useState([]);
// 	return (
// 		<div>Test</div>
// 		// <Wrapper className='pt-1'>
// 		// 	<SectionHeader title={title} />
// 		// 	<Row className='p-3' gutter={10}>
// 		// 		<Col className='mb-2' span={24}>
// 		// 			<Paragraph color='grey'>
// 		// 				<FormattedMessage id={subTitle} />
// 		// 			</Paragraph>
// 		// 		</Col>
// 		// 		<Col className='mb-2'>
// 		// 			<RangePicker value={dateRange} onChange={setDateRange} size='large' />
// 		// 		</Col>
// 		// 		<Col className='mb-2'>{additionalField}</Col>
// 		// 		<Col span={24}>
// 		// 			<Button
// 		// 				type='ghost'
// 		// 				icon={<DownloadOutlined />}
// 		// 				target='_blank'
// 		// 				onClick={() =>
// 		// 					onDownload(dateRange[0]?.format('YYYY-MM-DD'), dateRange[1]?.format('YYYY-MM-DD'))
// 		// 				}
// 		// 				disabled={disableDownload || !(dateRange && dateRange[0] && dateRange[1])}
// 		// 			>
// 		// 				<span>Download</span>
// 		// 			</Button>
// 		// 		</Col>
// 		// 	</Row>
// 		// </Wrapper>
// 	);
// }

// ReportDownloadForm.propTypes = {
// 	title: PropTypes.string,
// 	subTitle: PropTypes.string,
// 	onDownload: PropTypes.func,
// 	additionalField: PropTypes.node,
// 	disableDownload: PropTypes.bool,
// };
type moment = moment.Moment;

export type ReportDownloadFormProps = {
	title: string;
	subTitle: string;
	onDownload(a: string, b: string): void;
	additionalField?: any;
	disableDownload?: boolean;
};

// export default ReportDownloadForm;
export const ReportDownloadForm: FC<ReportDownloadFormProps> = ({
	title,
	subTitle = 'Select a Time Range for the report',
	onDownload,
	additionalField,
	disableDownload,
}) => {
	const { t } = useTranslation();
	//const [dateRange, setDateRange] = useState([]);
	const [dateRange, setDateRange] = useState<(moment.Moment | null)[]>([]);
	//const [dateRange, setDateRange] = useState([new Date(2023, 7, 24), new Date(2023, 7, 25)]);
	//const [value, setValue] = useState([new Date(2023, 7, 24), new Date(2023, 7, 25)]);
	// const percentageTitle = useMemo(
	// 	() => t(`since last ${statsType === 'TODAY' ? 'day' : 'month'}`),
	// 	[statsType, t]
	// );
	// const percentageColor = useMemo(() => (percentage > 0 ? 'success' : 'danger'), [percentage]);
	// const percentageIcon = useMemo(
	// 	() => (percentage > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />),
	// 	[percentage]
	// );

	// const linkTitle = useMemo(() => t(`View ${type.toLowerCase() as Lowercase<Type>}`), [t, type]);
	// const link = useMemo(() => {
	// 	switch (type) {
	// 		case 'TOURS':
	// 			return PRIVATE_ROUTES.TOURS;
	// 		case 'TRANSACTIONS':
	// 			return PRIVATE_ROUTES.TRANSACTIONS;
	// 		default:
	// 			return PRIVATE_ROUTES.BOOKINGS;
	// 	}
	// }, [type]);

	const chnageDate = (dates?: null | (moment | null)[], dateStrings?: string[]) => {
		// setDateRange([moment(dateStrings[0]), moment(dateStrings[1])]);
		if (dates) {
			setDateRange([dates[0], dates[1]]);
			// console.log('From: ', dates[0], ', to: ', dates[1]);
			// console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
		} else {
			console.log('Clear');
		}
	};
	const { RangePicker } = DatePicker;
	//const dateFormat = 'YYYY-MM-DD';

	return (
		<Card style={{ borderRadius: 10 }}>
			<Typography.Title level={4} className='margin-0' type='primary'>
				{
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					t(`${title}`)
				}
			</Typography.Title>
			{/* <Typography.Title level={1}>
				{value}
				{currency && <Typography.Text type='secondary'>{currency}</Typography.Text>}
			</Typography.Title> */}

			<Divider style={{ margin: '1rem 0 0.5rem 0' }} />
			<Row gutter={[16, 16]}>
				<Col span={24}>
					{/* <Paragraph color="grey">
            <FormattedMessage id={subTitle} />
          </Paragraph> */}
				</Col>
				<Col span={24}>
					<RangePicker onChange={chnageDate} size='large' />
				</Col>
				<Col>{additionalField}</Col>
				<Col span={24}>
					<Button
						type='ghost'
						icon={<DownloadOutlined />}
						target='_blank'
						onClick={() =>
							onDownload(
								`${moment(dateRange[0])?.format('YYYY-MM-DD')}`,
								`${moment(dateRange[1])?.format('YYYY-MM-DD')}`
							)
						}
						disabled={disableDownload || !(dateRange && dateRange[0] && dateRange[1])}
					>
						<span>Download</span>
					</Button>
				</Col>
			</Row>

			{/* <Typography.Paragraph type='secondary'>
				<Typography.Text type={percentageColor}>
					{percentageIcon}
					{percentage}%
				</Typography.Text>{' '}
				{percentageTitle}
			</Typography.Paragraph> */}
			{/* <Link to={link}>{linkTitle}</Link> */}
		</Card>
	);
};
