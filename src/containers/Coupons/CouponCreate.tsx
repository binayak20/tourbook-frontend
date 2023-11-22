import { Button } from '@/components/atoms';
import config from '@/config';
import { toursAPI } from '@/libs/api';
import { couponAPI } from '@/libs/api/couponAPI';
import { DEFAULT_LIST_PARAMS } from '@/utils/constants';
import { selectFilterBy } from '@/utils/helpers';
import {
	Col,
	DatePicker,
	Form,
	Input,
	InputNumber,
	Modal,
	Radio,
	Row,
	Select,
	message,
} from 'antd';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { FC, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
dayjs.extend(utc);

type Props = {
	isVisible: boolean;
	setVisible: (isVisible: boolean) => void;
};

export const CouponCreate: FC<Props> = ({ isVisible, setVisible }) => {
	const id = useParams()['*'];
	const navigate = useNavigate();
	const { t } = useTranslation();
	const queryClient = useQueryClient();
	const [form] = Form.useForm();
	const discount_type = Form.useWatch('discount_type', form);
	const coupon_type = Form.useWatch('coupon_type', form);
	const onModalClose = useCallback(() => {
		setVisible(false);
		navigate('');
	}, [setVisible, navigate]);

	const { data: tours, isLoading: toursLoading } = useQuery(
		['tours'],
		() => toursAPI.list({ ...DEFAULT_LIST_PARAMS, is_active: true }),
		{ enabled: coupon_type === 'specific-tour' }
	);

	const { data: coupon } = useQuery(['coupon'], () => couponAPI.get(id as string), {
		enabled: !!id,
	});

	const tourOptions = tours?.results?.map(({ id, name, departure_date }) => ({
		label: `${dayjs.utc(departure_date).format(config?.dateFormat)} - ${name}`,
		value: id,
	}));

	const resetDiscountAmount = useCallback(() => {
		form.setFieldValue('discount', null);
	}, [form]);

	const getCouponFormValues = (
		values: API.CreateCoupon & { validity: [dayjs.Dayjs, dayjs.Dayjs] }
	) => ({
		...values,
		valid_from: values?.validity[0]?.format(config?.dateFormat),
		valid_to: values?.validity[1]?.format(config?.dateFormat),
	});

	const { mutate: handleSubmit, isLoading } = useMutation(
		(values: API.CreateCoupon & { validity: [dayjs.Dayjs, dayjs.Dayjs] }) =>
			id
				? couponAPI.update(id, getCouponFormValues(values))
				: couponAPI.create(getCouponFormValues(values)),
		{
			onSuccess: () => {
				setVisible(false);
				navigate('');
				form.resetFields();
				queryClient.invalidateQueries(['coupons']);
				message.success(id ? t('Coupon has been updated!') : t('Coupon has been created!'));
			},
			onError: (error: Error) => {
				message.error(error.message);
			},
		}
	);

	useEffect(() => {
		if (id) {
			form.setFieldsValue({
				...coupon,
				validity: [dayjs.utc(coupon?.valid_from), dayjs.utc(coupon?.valid_to)],
			});
		} else {
			form.resetFields();
		}
	}, [coupon, form, id]);

	return (
		<Modal
			centered
			maskClosable={false}
			title={id ? t('Update coupon') : t('Create new coupon')}
			open={isVisible}
			footer={false}
			onCancel={onModalClose}
			width='50%'
		>
			<Form form={form} layout='vertical' size='large' onFinish={handleSubmit}>
				<Row gutter={40}>
					<Col lg={12}>
						<Form.Item
							label={t('Coupon Code')}
							name='code'
							rules={[{ required: true, message: t('Coupon code is required') }]}
						>
							<Input />
						</Form.Item>
					</Col>
					<Col lg={12}>
						<Form.Item
							label={t('Validity')}
							name='validity'
							rules={[{ required: true, message: t('Validity is required') }]}
						>
							<DatePicker.RangePicker
								placeholder={[t('Valid from date'), t('Valid to date')]}
								style={{ width: '100%' }}
								format={['YYYY-MM-DD', 'YYYYMMDD', 'YYMMDD', 'YYYY/MM/DD']}
							/>
						</Form.Item>
					</Col>
					<Col lg={12}>
						<Form.Item
							label={t('Discount Type')}
							name='discount_type'
							rules={[{ required: true, message: t('Discount type is required') }]}
						>
							<Select
								disabled={Form.useWatch('used_count', form) > 0}
								options={[
									{ label: t('Amount'), value: 'amount' },
									{ label: t('Percentage'), value: 'percentage' },
								]}
								onChange={resetDiscountAmount}
							/>
						</Form.Item>
					</Col>
					<Col lg={12}>
						<Form.Item
							label={t('Discount')}
							name='discount'
							rules={[
								{ required: true, message: t('Discount is required') },
								{
									validator: (rule, value, callback) => {
										if (value && value > 100 && discount_type === 'percentage') {
											callback('Percentage can not be over 100');
										} else {
											callback();
										}
									},
								},
							]}
						>
							<InputNumber
								disabled={Form.useWatch('used_count', form) > 0}
								min={0}
								max={discount_type === 'percentage' ? 100 : undefined}
								formatter={discount_type === 'percentage' ? (value) => `${value}%` : undefined}
								style={{ width: '100%' }}
								parser={
									discount_type === 'percentage'
										? (value) => Number(value!.replace('%', '')) as 0 | 100
										: undefined
								}
							/>
						</Form.Item>
					</Col>
					<Col lg={12}>
						<Form.Item
							label={t('Usage Limit')}
							name='use_limit'
							help={
								parseInt(Form.useWatch('use_limit', form)) === 0 ? (
									<div style={{ color: 'RGB(240, 173, 78)' }}>
										{t('Setting value 0 will set usage limit to unlimited')}
									</div>
								) : (
									''
								)
							}
						>
							<Input type='number' min={0} />
						</Form.Item>
					</Col>
					<Col lg={12}>
						<Form.Item label={t('Used Count')} name='used_count'>
							<Input type='number' disabled />
						</Form.Item>
					</Col>
					<Col lg={24}>
						<Form.Item label={t('Tours')} name='coupon_type'>
							<Radio.Group buttonStyle='solid'>
								<Radio.Button value='all-tour'>{t('All tour')}</Radio.Button>
								<Radio.Button value='specific-tour'>{t('Specified tours')}</Radio.Button>
							</Radio.Group>
						</Form.Item>
					</Col>
					{coupon_type === 'specific-tour' ? (
						<Col lg={24}>
							<Form.Item
								label={t('Tour List')}
								name='tours'
								rules={[{ required: true, message: t('Specific tour is required') }]}
							>
								<Select
									options={tourOptions}
									mode='multiple'
									showSearch
									filterOption={selectFilterBy}
									loading={toursLoading}
								/>
							</Form.Item>
						</Col>
					) : null}
					<Col lg={24}>
						<Form.Item label={t('Description')} name='description'>
							<Input.TextArea rows={3} />
						</Form.Item>
					</Col>
				</Row>
				<Row align='middle' justify='center'>
					<Col span={5}>
						<Button block type='cancel' htmlType='button' onClick={onModalClose}>
							{t('Cancel')}
						</Button>
					</Col>
					<Col span={5} className='margin-4'>
						<Button block type='primary' htmlType='submit' loading={isLoading}>
							{t('Save')}
						</Button>
					</Col>
				</Row>
			</Form>
		</Modal>
	);
};
