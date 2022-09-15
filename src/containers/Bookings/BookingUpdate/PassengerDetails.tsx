import { Button, ButtonProps } from '@/components/atoms';
import { Alert, Col, Form, Row } from 'antd';
import moment from 'moment';
import { FC, Fragment, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormHeader } from '../BookingCreate/PassengerDetails/FormHeader';
import { PassengerForm } from '../BookingCreate/PassengerDetails/PassengerForm';
import { Passengers } from '../BookingCreate/PassengerDetails/Passengers';

export type PassengerItem = API.BookingCreatePayload['passengers'][number] & { id?: number };

type PassengerDetailsProps = {
	values?: PassengerItem[];
	totalPassengers: number;
	backBtnProps?: ButtonProps;
	onFinish?: (values?: PassengerItem) => void;
	isLoading?: boolean;
};

export const PassengerDetails: FC<PassengerDetailsProps> = (props) => {
	const { values = [], totalPassengers, backBtnProps, onFinish, isLoading } = props;
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const [isFormVisible, setFormVisible] = useState(false);
	const [isPrimary, setPrimary] = useState(false);
	const isPassengerAdult = Form.useWatch('is_adult', form);
	const [currentPassenger, setCurrentPassenger] = useState<number | undefined>(undefined);

	// Validate email
	const validateEmail = useCallback(
		(email: string) => {
			return !!values.find((item) => item.email === email && item.id !== currentPassenger);
		},
		[currentPassenger, values]
	);

	// Form submit store passenger data to state, If form is invisible, show form when submit
	const handleSubmit = useCallback(
		(values: PassengerItem) => {
			if (!isFormVisible && !values?.first_name) {
				setFormVisible(true);
				form.resetFields();
				return;
			}

			onFinish?.({ ...values, id: currentPassenger });
			setCurrentPassenger(undefined);
			form.resetFields();
		},
		[currentPassenger, form, isFormVisible, onFinish]
	);

	// Call form submit if form is visible, If form is invisible, go to next step
	const handleSaveAndNext = useCallback(async () => {
		if (!isFormVisible) {
			onFinish?.();
		}

		try {
			await form.validateFields();
			form.submit();
			setFormVisible(false);
		} catch (error) {
			return;
		}
	}, [form, isFormVisible, onFinish]);

	const handlePrimary = useCallback(() => {
		setPrimary((prev) => !prev);
	}, []);

	const handleRemove = useCallback(() => {
		setFormVisible(false);
		setPrimary(false);
	}, []);

	const handleEditPassenger = useCallback(
		(id: number) => {
			const passenger = values.find((item) => item.id === id);
			if (passenger) {
				setCurrentPassenger(id);
				setFormVisible(true);
				form.setFieldsValue({
					...passenger,
					date_of_birth: moment(passenger.date_of_birth),
				});
			}
		},
		[form, values]
	);

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

			<Passengers data={values} onDelete={(e) => console.log(e)} onEdit={handleEditPassenger} />

			{isFormVisible && (
				<Fragment>
					<FormHeader
						title={`${t('Passenger')} - ${values.length + 1}`}
						isPrimary={isPrimary}
						primaryBtnProps={{ onClick: handlePrimary }}
						removeBtnProps={{
							isVisble: values.length > 0,
							onClick: handleRemove,
						}}
					/>
					<PassengerForm isEmailRequired={isPassengerAdult} checkEmailExists={validateEmail} />
				</Fragment>
			)}

			<Row gutter={16} justify='center'>
				<Col>
					<Button type='default' htmlType='button' style={{ minWidth: 120 }} {...backBtnProps}>
						{t('Back')}
					</Button>
				</Col>
				{totalPassengers !== values.length && (
					<Col>
						<Button type='cancel' htmlType='submit' style={{ minWidth: 120 }} loading={isLoading}>
							{isFormVisible ? t('Save and add another') : t('Add another')}
						</Button>
					</Col>
				)}
				<Col>
					<Button
						type='primary'
						htmlType='button'
						style={{ minWidth: 120 }}
						loading={isLoading}
						onClick={handleSaveAndNext}
					>
						{isFormVisible ? t('Save') : t('Next')}
					</Button>
				</Col>
			</Row>
		</Form>
	);
};
