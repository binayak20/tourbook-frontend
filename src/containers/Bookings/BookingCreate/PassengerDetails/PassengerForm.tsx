import { Switch } from '@/components/atoms';
import { GENDER_OPTIONS, NAME_INITIALS } from '@/utils/constants';
import { Col, DatePicker, Form, Input, Row, Select } from 'antd';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

type PassengerFormProps = {
	isEmailRequired?: boolean;
	checkEmailExists?: (email: string) => boolean;
};

export const PassengerForm: FC<PassengerFormProps> = ({
	isEmailRequired = true,
	checkEmailExists,
}) => {
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
							<Form.Item name='name_title' noStyle>
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
					rules={[
						{
							required: isEmailRequired,
							message: t('Email address is required!'),
						},
						{
							type: 'email',
							message: t('Please enter a valid email address!'),
						},
						{
							validator(_, value, callback) {
								if (checkEmailExists?.(value)) {
									callback(t('This email is already added!'));
								} else {
									callback();
								}
							},
						},
					]}
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
					<DatePicker
						style={{ width: '100%' }}
						showToday={false}
						placeholder='YYYY-MM-DD'
						disabledDate={(d) => !d || d.isAfter(new Date())}
					/>
				</Form.Item>
			</Col>
			<Col xl={12} xxl={8}>
				<Form.Item label={t('Gender')} name='gender'>
					<Select placeholder={t('Choose an option')} options={GENDER_OPTIONS} />
				</Form.Item>
			</Col>
			<Col xl={12} xxl={8}>
				<Form.Item label={t('Telephone number')} name='telephone'>
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
					name='allergy'
					valuePropName='checked'
				>
					<Switch custom checkedChildren={t('Yes')} unCheckedChildren={t('No')} />
				</Form.Item>
			</Col>
			<Col xl={12} xxl={8}>
				<Form.Item label={t('Note')} name='additional_info'>
					<Input.TextArea rows={4} />
				</Form.Item>
			</Col>
		</Row>
	);
};
