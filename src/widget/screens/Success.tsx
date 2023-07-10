import { Col, Result, Row } from 'antd';
import { useTranslation } from 'react-i18next';

const Success = () => {
	const { t } = useTranslation('translationWidget');
	return (
		<Row justify='center' align='middle' style={{ width: '100%', height: '100%' }}>
			<Col>
				<Result
					status='success'
					title={t('Your booking has been successfully submitted!')}
					subTitle='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
				/>
			</Col>
		</Row>
	);
};

export default Success;
