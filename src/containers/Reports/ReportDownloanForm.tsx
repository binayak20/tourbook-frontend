// import { FormattedMessage } from 'react-intl';
// import { DatePicker } from 'antd';
// import { useDispatch } from 'react-redux';
// import { reportsUrl } from 'api/endpoints';
// import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
// import { downloadPayemntReportRequest } from './reducer';
// import { downloadTourDepartureReportRequest } from './reducer';
// import { Link } from 'react-router-dom';
// import { PRIVATE_ROUTE } from 'router';

// const { RangePicker } = DatePicker;

function ReportDownloadForm() {
	//   {
	//   title,
	//   subTitle = 'Select a Time Range for the report',
	//   onDownload,
	//   additionalField,
	//   disableDownload,
	// }
	// const [dateRange, setDateRange] = useState([]);
	return (
		<div>Test</div>
		// <Wrapper className='pt-1'>
		// 	<SectionHeader title={title} />
		// 	<Row className='p-3' gutter={10}>
		// 		<Col className='mb-2' span={24}>
		// 			<Paragraph color='grey'>
		// 				<FormattedMessage id={subTitle} />
		// 			</Paragraph>
		// 		</Col>
		// 		<Col className='mb-2'>
		// 			<RangePicker value={dateRange} onChange={setDateRange} size='large' />
		// 		</Col>
		// 		<Col className='mb-2'>{additionalField}</Col>
		// 		<Col span={24}>
		// 			<Button
		// 				type='ghost'
		// 				icon={<DownloadOutlined />}
		// 				target='_blank'
		// 				onClick={() =>
		// 					onDownload(dateRange[0]?.format('YYYY-MM-DD'), dateRange[1]?.format('YYYY-MM-DD'))
		// 				}
		// 				disabled={disableDownload || !(dateRange && dateRange[0] && dateRange[1])}
		// 			>
		// 				<span>Download</span>
		// 			</Button>
		// 		</Col>
		// 	</Row>
		// </Wrapper>
	);
}

ReportDownloadForm.propTypes = {
	title: PropTypes.string,
	subTitle: PropTypes.string,
	onDownload: PropTypes.func,
	additionalField: PropTypes.node,
	disableDownload: PropTypes.bool,
};

export default ReportDownloadForm;
