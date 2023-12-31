import { Typography } from '@/components/atoms';
import config from '@/config';
import { bookingsAPI, toursAPI } from '@/libs/api';
import { PRIVATE_ROUTES } from '@/routes/paths';
import { DEFAULT_LIST_PARAMS } from '@/utils/constants';
import { Button, Col, DatePicker, Form, Modal, ModalProps, Row, Select, message } from 'antd';
import dayjs from 'dayjs';
import { FC, MouseEvent, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';

const { RangePicker } = DatePicker;

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
	const deparatureDates = Form.useWatch('departure_dates', form);
	const TourListParams = useMemo(() => {
		return {
			from_departure_date: deparatureDates
				? dayjs(deparatureDates[0]).format(config.dateFormat)
				: undefined,
			to_departure_date: deparatureDates
				? dayjs(deparatureDates[1]).format(config.dateFormat)
				: undefined,
			remaining_capacity: transferCapacity,
			is_active: true,
		};
	}, [deparatureDates, transferCapacity]);

	const { data: tours, isLoading: isToursLoading } = useQuery(
		['tours', TourListParams],
		() => toursAPI.list({ ...DEFAULT_LIST_PARAMS, ...TourListParams }),
		{
			enabled: rest?.open,
		}
	);

	const handleCancel = useCallback(
		(e: MouseEvent<HTMLButtonElement>) => {
			rest.onCancel?.(e);
			form.resetFields();
		},
		[rest, form]
	);

	const { mutate: handleSubmit, isLoading } = useMutation(
		(payload: { tour_type?: number; tour: number }) => bookingsAPI.transfer(id, payload.tour),
		{
			onSuccess: (data) => {
				handleCancel(undefined as unknown as MouseEvent<HTMLButtonElement>);
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
				initialValues={{ date: dayjs(new Date()) }}
				onFinish={handleSubmit}
			>
				<Row>
					<Col span={24}>
						<Row gutter={12}>
							<Col span={24}>
								<Form.Item name='departure_dates' label={t('Date range')}>
									<RangePicker
										format={['YYYY-MM-DD', 'YYYYMMDD', 'YYMMDD', 'YYYY/MM/DD']}
										style={{ width: '100%' }}
										size='large'
										onChange={() => {
											form.setFieldsValue({ tour: undefined });
										}}
										allowClear
									/>
								</Form.Item>
							</Col>
							<Col span={24}>
								<Form.Item
									name='tour'
									label={t('Tour')}
									rules={[{ required: true, message: t('Tour is required!') }]}
								>
									<Select
										style={{ width: '100%' }}
										showSearch
										placeholder={t('Please choose an option')}
										options={tours?.results?.map(
											({ id, name, departure_date, remaining_capacity, capacity }) => ({
												value: id,
												label: `${dayjs(departure_date).format(
													config.dateFormatReadable
												)} - ${name} (${remaining_capacity}/${capacity})`,
											})
										)}
										filterOption={(inputValue, option) =>
											option?.label.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1
										}
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
