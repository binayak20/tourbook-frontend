import { Button } from '@/components/atoms';
import { toursAPI } from '@/libs/api';
import { Alert, Col, Form, Input, InputNumber, Popconfirm, Row, Select, message } from 'antd';
import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';

type Props = {
	data?: any;
	handleDelete?: () => void;
	isDeleteLoading?: boolean;
};

export const TourDiscountForm: FC<Props> = ({ data, handleDelete, isDeleteLoading }) => {
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const discount_type = Form.useWatch('discount_type', form);
	const { id } = useParams() as unknown as { id: number };
	const queryClient = useQueryClient();

	const getCouponFormValues = (values: API.TourDiscountPayload) => ({
		...values,
		tour: id,
	});
	const { mutate: handleSubmit, isLoading } = useMutation(
		(values: API.TourDiscountPayload) =>
			toursAPI.createTourDiscount(id, getCouponFormValues(values)),
		{
			onSuccess: () => {
				form.resetFields();
				queryClient.invalidateQueries(['tour-discount-history']);
				message.success(id ? t('Coupon has been updated!') : t('Coupon has been created!'));
			},
			onError: (error: Error) => {
				message.error(error.message);
			},
		}
	);
	useEffect(() => {
		if (!isLoading && data) {
			form.setFieldsValue({
				discount_type: data.discount_type,
				discount_value: data.discount_value,
				note: data.note,
			});
		}
		if (data && !data.discount_type) {
			form.resetFields();
		}
	}, [isLoading, data, form]);

	return (
		<>
			{!data?.discount_value && (
				<Alert
					showIcon
					type='warning'
					style={{ marginBottom: 24 }}
					message={t('There is no discount in this tour. Please add a discount!')}
				/>
			)}

			<Form form={form} size='large' layout='vertical' onFinish={handleSubmit}>
				<Row gutter={16}>
					<Col md={24} lg={12}>
						<Form.Item
							label={t('Discount Type')}
							name='discount_type'
							rules={[{ required: true, message: t('Discount type is required') }]}
						>
							<Select
								//disabled={Form.useWatch('used_count', form) > 0}
								options={[
									{ label: t('Amount'), value: 'amount' },
									{ label: t('Percentage'), value: 'percentage' },
								]}
								//	onChange={resetDiscountAmount}
							/>
						</Form.Item>
					</Col>
					<Col md={24} lg={12}>
						<Form.Item
							label={t('Discount')}
							name='discount_value'
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
				</Row>
				<Row>
					<Col md={24} lg={24}>
						<Form.Item label={t('Note')} name='note'>
							<Input.TextArea rows={3} />
						</Form.Item>
					</Col>
				</Row>
				<Row align='middle' justify='center'>
					{data?.discount_type && (
						<Col md={5} lg={5}>
							<Popconfirm
								placement='top'
								title={t(`Do you really want to delete?`)}
								onConfirm={handleDelete}
								okText={t('Yes')}
								cancelText={t('No')}
							>
								<Button block type='danger' loading={isDeleteLoading}>
									{t('Delete')}
								</Button>
							</Popconfirm>
						</Col>
					)}
					<Col md={5} lg={5} className='margin-4'>
						<Button block type='primary' htmlType='submit' loading={isLoading}>
							{t('Save')}
						</Button>
					</Col>
				</Row>
			</Form>
		</>
	);
};
