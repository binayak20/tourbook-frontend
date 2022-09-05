import { Button, ButtonProps } from '@/components/atoms';
import { Alert, Col, Form, Row } from 'antd';
import { FC, Fragment, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormHeader } from './FormHeader';
import { PassengerForm } from './PassengerForm';
import { Passengers } from './Passengers';

type PassengerDetailsProps = {
	backBtnProps?: ButtonProps;
};

export type FormValues = {
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

export const PassengerDetails: FC<PassengerDetailsProps> = (props) => {
	const { backBtnProps } = props;
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const [isFormVisible, setFormVisible] = useState(true);
	const [passengers, setPassengers] = useState<FormValues[]>([]);
	const [isPrimary, setPrimary] = useState(false);

	// Form submit store passenger data to state
	// If form is invisible, show form when submit
	const handleSubmit = useCallback(
		(values: FormValues) => {
			if (!isFormVisible && !values?.first_name) {
				setFormVisible(true);
				form.resetFields();
				return;
			}

			setPassengers((prev) => {
				const passengers = [...prev];
				const isFirstPassenger = passengers.length === 0;

				if (isPrimary || isFirstPassenger) {
					passengers.forEach((passenger) => {
						passenger.is_primary = false;
					});
					return [{ ...values, is_primary: true }, ...passengers];
				}

				return [...passengers, values];
			});
			setPrimary(false);
			form.resetFields();
		},
		[form, isFormVisible, isPrimary]
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

	const handlePrimary = useCallback(() => {
		setPrimary((prev) => !prev);
	}, []);

	const handleRemove = useCallback(() => {
		setFormVisible(false);
		setPrimary(false);
	}, []);

	return (
		<Form form={form} size='large' layout='vertical' onFinish={handleSubmit}>
			<Alert
				showIcon
				type='warning'
				style={{ marginBottom: 24 }}
				message={t('Primary passenger listed here will be responsible for the booking details')}
			/>

			<Passengers data={passengers} updateData={setPassengers} />

			{isFormVisible && (
				<Fragment>
					<FormHeader
						title={`${t('Passenger')} - ${passengers.length + 1}`}
						isPrimary={isPrimary}
						primaryBtnProps={{ onClick: handlePrimary }}
						removeBtnProps={{
							isVisble: passengers.length > 0,
							onClick: handleRemove,
						}}
					/>
					<PassengerForm />
				</Fragment>
			)}

			<Row gutter={16} justify='center'>
				<Col>
					<Button type='default' htmlType='button' style={{ minWidth: 120 }} {...backBtnProps}>
						{t('Back')}
					</Button>
				</Col>
				<Col>
					<Button type='cancel' htmlType='submit' style={{ minWidth: 120 }}>
						{isFormVisible ? t('Save and add another') : t('Add another')}
					</Button>
				</Col>
				<Col>
					<Button
						type='primary'
						htmlType='button'
						style={{ minWidth: 120 }}
						onClick={handleSaveAndNext}
					>
						{isFormVisible ? t('Save') : t('Next')}
					</Button>
				</Col>
			</Row>
		</Form>
	);
};
