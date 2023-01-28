import { Typography } from '@/components/atoms';
import config from '@/config';
import { bookingsAPI, toursAPI } from '@/libs/api';
import { PRIVATE_ROUTES } from '@/routes/paths';
import { DEFAULT_LIST_PARAMS } from '@/utils/constants';
import { Button, Col, Form, message, Modal, ModalProps, Row, Select } from 'antd';
import moment from 'moment';
import { FC, MouseEvent, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueries } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';

type TransferBookingModalProps = ModalProps & {
	transferCapacity: number;
};

export const TransferBookingModal: FC<TransferBookingModalProps> = ({
	transferCapacity,
	...rest
}) => {
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const { id } = useParams() as unknown as { id: number };
	const navigate = useNavigate();
	const tour_type = Form.useWatch('tour_type', form);

	const [
		{ data: tourTypes, isLoading: isTourTypesLoading },
		{ data: tours, isLoading: isToursLoading },
	] = useQueries([
		{ queryKey: ['tourTypes'], queryFn: () => toursAPI.tourTypes(DEFAULT_LIST_PARAMS) },
		{
			queryKey: ['tours', tour_type, transferCapacity],
			queryFn: () =>
				toursAPI.list({
					...DEFAULT_LIST_PARAMS,
					tour_type,
					remaining_capacity: transferCapacity,
					is_active: true,
				}),
		},
	]);

	const handleCancel = useCallback(
		(e: MouseEvent<HTMLElement>) => {
			rest.onCancel?.(e);
			form.resetFields();
		},
		[rest, form]
	);

	const { mutate: handleSubmit, isLoading } = useMutation(
		(payload: { tour_type?: number; tour: number }) => bookingsAPI.transfer(id, payload.tour),
		{
			onSuccess: (data) => {
				handleCancel(undefined as unknown as MouseEvent<HTMLElement>);
				message.success(data.detail);
				navigate(`/dashboard/${PRIVATE_ROUTES.BOOKINGS}`);
			},
			onError: (error: Error) => {
				message.error(error.message);
			},
		}
	);

	return (
		<Modal centered width={700} footer={false} afterClose={form.resetFields} {...rest}>
			<Typography.Title level={4} type='primary' style={{ textAlign: 'center', marginBottom: 30 }}>
				{t('Transfer Booking')}
			</Typography.Title>

			<Form
				form={form}
				layout='vertical'
				size='large'
				initialValues={{ date: moment(new Date()) }}
				onFinish={handleSubmit}
			>
				<Row>
					<Col span={24}>
						<Row gutter={12}>
							<Col span={10}>
								<Form.Item name='tour_type' label={t('Tour type')}>
									<Select
										allowClear
										style={{ width: '100%' }}
										placeholder={t('Please choose an option')}
										options={tourTypes?.results?.map(({ id, name }) => ({
											value: id,
											label: name,
										}))}
										loading={isTourTypesLoading}
										onChange={() => form.setFieldsValue({ tour: undefined })}
									/>
								</Form.Item>
							</Col>
							<Col span={14}>
								<Form.Item
									name='tour'
									label={t('Tour')}
									rules={[{ required: true, message: t('Tour is required!') }]}
								>
									<Select
										style={{ width: '100%' }}
										placeholder={t('Please choose an option')}
										options={tours?.results?.map(
											({ id, name, departure_date, remaining_capacity, capacity }) => ({
												value: id,
												label: (
													<Typography.Text style={{ fontSize: 15 }}>
														{name} - {moment(departure_date).format(config.dateFormatReadable)} (
														{remaining_capacity}/{capacity})
													</Typography.Text>
												),
											})
										)}
										loading={isToursLoading}
									/>
								</Form.Item>
							</Col>
						</Row>
						<Row gutter={16} justify='center' style={{ marginTop: 20 }}>
							<Col>
								<Button
									type='default'
									htmlType='button'
									style={{ minWidth: 120 }}
									onClick={handleCancel}
								>
									{t('Cancel')}
								</Button>
							</Col>
							<Col>
								<Button
									type='primary'
									htmlType='submit'
									style={{ minWidth: 120 }}
									loading={isLoading}
								>
									{t('Save')}
								</Button>
							</Col>
						</Row>
					</Col>
				</Row>
			</Form>
		</Modal>
	);
};
