import { Switch } from '@/components/atoms';
import { GENDER_OPTIONS, NAME_INITIALS } from '@/utils/constants';
import { Col, DatePicker, Form, Input, Row, Select } from 'antd';
import { useTranslation } from 'react-i18next';

export const PassengerForm = () => {
	const { t } = useTranslation();

	return (
		<Row gutter={[16, 16]}>
			<Col xl={12} xxl={8}>
				<Form.Item
					label={t('First name')}
					name='first_name'
					rules={[{ required: true, message: t('First name is required!') }]}
				>
					<Input
						addonBefore={
							<Form.Item name='name_initial' noStyle>
								<Select style={{ width: 70 }} options={NAME_INITIALS} />
							</Form.Item>
						}
					/>
				</Form.Item>
			</Col>
			<Col xl={12} xxl={8}>
				<Form.Item
					label={t('Last name')}
					name='last_name'
					rules={[{ required: true, message: t('Last name is required!') }]}
				>
					<Input />
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
				<Form.Item
					label={t('Date of birth')}
					name='date_of_birth'
					rules={[{ required: true, message: t('Date of birth is required!') }]}
				>
					<DatePicker style={{ width: '100%' }} showToday={false} />
				</Form.Item>
			</Col>
			<Col xl={12} xxl={8}>
				<Form.Item label={t('Gender')} name='gender'>
					<Select placeholder={t('Choose an option')} options={GENDER_OPTIONS} />
				</Form.Item>
			</Col>
			<Col xl={12} xxl={8}>
				<Form.Item label={t('Telephone number')} name='phone_number'>
					<Input type='tel' />
				</Form.Item>
			</Col>
			<Col xl={12} xxl={8}>
				<Form.Item label={t('Passport number')} name='passport_number'>
					<Input />
				</Form.Item>
			</Col>
			<Col xl={12} xxl={8}>
				<Form.Item
					label={t('Does the traveler have food allergies?')}
					name='is_allergy'
					valuePropName='checked'
				>
					<Switch custom checkedChildren={t('Yes')} unCheckedChildren={t('No')} />
				</Form.Item>
			</Col>
			<Col xl={12} xxl={8}>
				<Form.Item label={t('Note')} name='note'>
					<Input.TextArea rows={4} />
				</Form.Item>
			</Col>
		</Row>
	);
};
