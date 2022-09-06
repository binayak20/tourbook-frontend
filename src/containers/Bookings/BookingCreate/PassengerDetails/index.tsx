import { Button, ButtonProps } from '@/components/atoms';
import config from '@/config';
import { Alert, Col, Form, Row } from 'antd';
import moment from 'moment';
import { FC, Fragment, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormHeader } from './FormHeader';
import { PassengerForm } from './PassengerForm';
import { Passengers } from './Passengers';

export type PassengerItem = API.BookingCreatePayload['passengers'][number];

type PassengerDetailsProps = {
	backBtnProps?: ButtonProps;
	onFinish?: (values: PassengerItem[]) => void;
};

export const PassengerDetails: FC<PassengerDetailsProps> = (props) => {
	const { backBtnProps, onFinish } = props;
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const [isFormVisible, setFormVisible] = useState(true);
	const [passengers, setPassengers] = useState<PassengerItem[]>([]);
	const [isPrimary, setPrimary] = useState(false);

	// Form submit store passenger data to state
	// If form is invisible, show form when submit
	const handleSubmit = useCallback(
		(values: PassengerItem) => {
			if (!isFormVisible && !values?.first_name) {
				setFormVisible(true);
				form.resetFields();
				return;
			}

			setPassengers((prev) => {
				const passengers = [...prev];
				const isFirstPassenger = passengers.length === 0;

				const newPassenger = {
					...values,
					is_primary: isFirstPassenger || isPrimary,
					serial_id: passengers.length + 1,
					date_of_birth: moment(values.date_of_birth).format(config.dateFormat),
				};

				if (isPrimary || isFirstPassenger) {
					passengers.forEach((passenger) => {
						passenger.is_primary = false;
					});

					return [newPassenger, ...passengers];
				}

				return [...passengers, newPassenger];
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
			onFinish?.(passengers);
		}

		try {
			await form.validateFields();
			form.submit();
			setFormVisible(false);
		} catch (error) {
			return;
		}
	}, [form, isFormVisible, onFinish, passengers]);

	const handlePrimary = useCallback(() => {
		setPrimary((prev) => !prev);
	}, []);

	const handleRemove = useCallback(() => {
		setFormVisible(false);
		setPrimary(false);
	}, []);

	return (
		<Form
			form={form}
			size='large'
			layout='vertical'
			initialValues={{
				is_adult: true,
			}}
			onFinish={handleSubmit}
		>
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
