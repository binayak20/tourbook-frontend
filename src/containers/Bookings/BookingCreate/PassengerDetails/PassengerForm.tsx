import { genderOptions, nameTitles } from '@/utils/constants';
import { Col, Form, Input, Row, Select } from 'antd';
import { useTranslation } from 'react-i18next';

export const PassengerForm = () => {
	const { t } = useTranslation();

	return (
		<Row gutter={[16, 16]}>
			<Col xl={12} xxl={8}>
				<Form.Item label={t('Title')} name='title'>
					<Select placeholder={t('Choose an option')} options={nameTitles} />
				</Form.Item>
			</Col>
			<Col xl={12} xxl={8}>
				<Form.Item
					label={t('First Name')}
					name='first_name'
					rules={[{ required: true, message: t('First name is required!') }]}
				>
					<Input />
				</Form.Item>
			</Col>
			<Col xl={12} xxl={8}>
				<Form.Item
					label={t('Last Name')}
					name='last_name'
					rules={[{ required: true, message: t('Last name is required!') }]}
				>
					<Input />
				</Form.Item>
			</Col>
			<Col xl={12} xxl={8}>
				<Form.Item label={t('Gender')} name='gender'>
					<Select placeholder={t('Choose an option')} options={genderOptions} />
				</Form.Item>
			</Col>
			<Col xl={12} xxl={8}>
				<Form.Item
					label={t('Email')}
					name='email'
					rules={[{ required: true, message: t('Email address is required!') }]}
				>
					<Input type='email' />
				</Form.Item>
			</Col>
			<Col xl={12} xxl={8}>
				<Form.Item label={t('Telephone Number')} name='phone_number'>
					<Input type='tel' />
				</Form.Item>
			</Col>
		</Row>
	);
};
