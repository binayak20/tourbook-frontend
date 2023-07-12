import { Typography } from '@/components/atoms';
import { bookingsAPI } from '@/libs/api';
import { AdditionalCost } from '@/libs/api/@types';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import {
	Button,
	Col,
	Form,
	Input,
	InputNumber,
	ModalProps,
	Popconfirm,
	Row,
	Space,
	message,
} from 'antd';
import { FC, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';
import { FormInputSkeleton, FormLabelSkeleton } from '../../FormSkeleton';

type CostFormProps = Pick<ModalProps, 'onCancel'>;

export const AdditionalCostForm: FC<CostFormProps> = (props) => {
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const { id } = useParams() as unknown as { id: number };

	const queryClient = useQueryClient();
	const [saveAndSend, setSaveAndSend] = useState(false);

	const { data } = useQuery(['additionalCosts', id], () => bookingsAPI.getAdditionalCostList(id));

	const { mutate: handleSave, isLoading } = useMutation(
		(payload: AdditionalCost[]) => bookingsAPI.addAdditionalCost(id, saveAndSend, payload),
		{
			onSuccess: () => {
				form?.resetFields();
				queryClient.invalidateQueries(['booking']);
				queryClient.invalidateQueries(['additionalCosts']);
				message.success(t('Additional cost added successfully!'));
			},
			onError: (error: Error) => {
				message.error(error.message);
			},
		}
	);
	const { mutate: handleUpdate, isLoading: isLoadingUpdate } = useMutation(
		(payload: AdditionalCost[]) => bookingsAPI.updateAdditionalCost(id, saveAndSend, payload),
		{
			onSuccess: () => {
				form?.resetFields();
				queryClient.invalidateQueries(['booking']);
				queryClient.invalidateQueries(['additionalCosts']);
				message.success(t('Additional cost update successfully!'));
			},
			onError: (error: Error) => {
				message.error(error.message);
			},
		}
	);

	const { mutate: sendFortnox, isLoading: isLoadingSendFortnox } = useMutation(
		() => bookingsAPI.sendToFortnox(id),
		{
			onSuccess: () => {
				message.success(t('Booking additional cost has been send to fortnox!'));
			},
			onError: (error: Error) => {
				message.error(error.message);
			},
		}
	);
	const handleSendConfirmToFortnox = () => {
		sendFortnox();
	};
	const handleConfirm = useCallback(() => form?.submit(), [form]);

	const onFinish = (values: { additionalCost: AdditionalCost[] }) => {
		const payload = values?.additionalCost;
		if (data && data?.length > 0) {
			handleUpdate(payload);
		} else {
			handleSave(payload);
		}
	};

	useEffect(() => {
		if (data) {
			form?.setFieldsValue({ additionalCost: data });
		}
	}, [data, form]);

	return (
		<>
			<Typography.Title level={4} type='primary' style={{ textAlign: 'center', marginBottom: 30 }}>
				{t('Add Additional cost')}
			</Typography.Title>
			{data ? (
				<Form
					form={form}
					name='dynamic_form_nest_item'
					onFinish={onFinish}
					layout='vertical'
					size='large'
					autoComplete='off'
				>
					<Form.List name='additionalCost'>
						{(fields, { add, remove }) => (
							<>
								{fields.map(({ key, name, ...restField }) => (
									<Row gutter={12} align='middle' key={key}>
										<Col span={11}>
											<Form.Item
												{...restField}
												name={[name, 'name']}
												rules={[{ required: true, message: t('Field name is required!') }]}
												label={t('Field name')}
											>
												<Input
													size='large'
													style={{ width: '100%' }}
													placeholder={t('Field name')}
												/>
											</Form.Item>
										</Col>
										<Col span={11}>
											<Form.Item
												{...restField}
												name={[name, 'amount']}
												rules={[{ required: true, message: t('Payment amount is required!') }]}
												label={t('Amount')}
											>
												<InputNumber
													style={{ width: '100%' }}
													placeholder={t('Payment amount')}
													precision={0}
												/>
											</Form.Item>
										</Col>
										<Col span={2}>
											<Space align='center'>
												<Button
													danger
													type='link'
													icon={<DeleteOutlined />}
													onClick={() => remove(name)}
												/>
											</Space>
										</Col>
									</Row>
								))}
								<Form.Item>
									<Button
										type='dashed'
										block={data?.length > 0 ? false : true}
										onClick={() => add()}
										icon={<PlusOutlined />}
									>
										{t('Add cost')}
									</Button>
								</Form.Item>
							</>
						)}
					</Form.List>

					<Row gutter={16} justify='center' style={{ marginTop: 30 }}>
						<Col>
							<Button
								type='primary'
								htmlType='submit'
								loading={(isLoading || isLoadingUpdate) && !saveAndSend}
								onClick={() => {
									setSaveAndSend(false);
								}}
								style={{ minWidth: 120 }}
							>
								{t('Save')}
							</Button>
						</Col>
						<Col>
							<Popconfirm
								title={t('Are you sure you want to save and send additiobal cost to customer ?')}
								okText={t('Yes')}
								cancelText={t('No')}
								onConfirm={() => {
									setSaveAndSend(true);
									handleConfirm;
								}}
							>
								<Button
									type='primary'
									htmlType='submit'
									loading={(isLoading || isLoadingUpdate) && saveAndSend}
									style={{ minWidth: 120 }}
								>
									{t('Save and Send')}
								</Button>
							</Popconfirm>
						</Col>
						<Col>
							<Popconfirm
								title={t('Are you sure you want to send additiobal cost to fortnox ?')}
								okText={t('Yes')}
								cancelText={t('No')}
								onConfirm={handleSendConfirmToFortnox}
							>
								<Button
									type='default'
									htmlType='submit'
									loading={isLoadingSendFortnox}
									style={{ minWidth: 120 }}
									disabled={data?.some((item) => item?.is_sent_to_fortnox)}
								>
									{t('Send to fortnox')}
								</Button>
							</Popconfirm>
						</Col>
					</Row>
				</Form>
			) : (
				<Row gutter={12} align='middle'>
					<Col span={12}>
						<FormLabelSkeleton />
						<FormInputSkeleton />
					</Col>
					<Col span={12}>
						<FormLabelSkeleton />
						<FormInputSkeleton />
					</Col>
				</Row>
			)}
		</>
	);
};
