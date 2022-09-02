import { Alert, Button, Col, Form, Row } from 'antd';
import { Fragment, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormHeader } from './FormHeader';
import { PassengerForm } from './PassengerForm';

type FormValues = {
	is_child?: boolean;
	name_initial?: string;
	first_name: string;
	last_name: string;
	email: string;
	date_of_birth: string;
	gender?: string;
	phone_number?: string;
	passport_number?: string;
	is_allergy?: boolean;
	note?: string;
	is_primary?: boolean;
};

export const PassengerDetails = () => {
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const [isFormVisible, setFormVisible] = useState(true);
	const [passengers, setPassengers] = useState<FormValues[]>([]);

	// Form submit store passenger data to state
	// If form is invisible, show form when submit
	const handleSubmit = useCallback(
		(values: FormValues) => {
			if (!isFormVisible && !values?.first_name) {
				setFormVisible(true);
				form.resetFields();
				return;
			}

			setPassengers((prev) => [...prev, values]);
			form.resetFields();
		},
		[form, isFormVisible]
	);

	// Call form submit if form is visible
	// If form is invisible, go to next step
	const handleSaveAndNext = useCallback(async () => {
		if (!isFormVisible) {
			return;
		}

		try {
			await form.validateFields();
			form.submit();
			setFormVisible(false);
		} catch (error) {
			return;
		}
	}, [form, isFormVisible]);

	return (
		<Form form={form} size='large' layout='vertical' onFinish={handleSubmit}>
			<Alert
				showIcon
				type='warning'
				style={{ marginBottom: 24 }}
				message={t(
					'First passenger listed here will be the primary passenger and responsible for the booking details'
				)}
			/>

			{isFormVisible && (
				<Fragment>
					<FormHeader title={`${t('Passenger')} - ${passengers.length + 1}`} />
					<PassengerForm />
				</Fragment>
			)}

			<Row gutter={16} justify='center'>
				<Col>
					<Button type='default' htmlType='submit' style={{ minWidth: 200 }}>
						{isFormVisible ? t('Save and add another') : t('Add another')}
					</Button>
				</Col>
				<Col>
					<Button
						type='primary'
						htmlType='button'
						style={{ minWidth: 200 }}
						onClick={handleSaveAndNext}
					>
						{isFormVisible ? t('Save') : t('Next')}
					</Button>
				</Col>
			</Row>
		</Form>
	);
};
