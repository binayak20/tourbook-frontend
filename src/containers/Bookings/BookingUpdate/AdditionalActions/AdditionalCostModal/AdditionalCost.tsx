import { Typography } from '@/components/atoms';
import { bookingsAPI } from '@/libs/api';
import { AdditionalCost, AdditionalCostPayload } from '@/libs/api/@types';
import { uniqNumericId } from '@/utils/helpers';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import {
	Button,
	Col,
	Form,
	FormInstance,
	Input,
	InputNumber,
	ModalProps,
	Popconfirm,
	Row,
	message,
} from 'antd';
import { FC, MouseEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';

type CostFormProps = Pick<ModalProps, 'onCancel'>;

export const AdditionalCostForm: FC<CostFormProps> = (props) => {
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const { id } = useParams() as unknown as { id: number };
	const formRef = useRef<FormInstance>(null);
	const queryClient = useQueryClient();
	const [saveAndSend, setSaveAndSend] = useState(false);

	const { data, isLoading: listIsLoading } = useQuery(['additionalCosts', id], () =>
		bookingsAPI.getAdditionalCostList(id)
	);
	console.log(listIsLoading);
	const [additionalCosts, setAdditionalCosts] = useState<AdditionalCost[]>([
		{ name: '', amount: 0, id: 1, key: 1 },
	]);
	useEffect(() => {
		if (data && data?.length > 0) {
			setAdditionalCosts(data);
		}
	}, [data]);

	const handleChange = (index: number, field: keyof AdditionalCost, value: string | number) => {
		const updatedCosts = [...additionalCosts];
		updatedCosts[index] = {
			...updatedCosts[index],
			[field]: value,
		};
		setAdditionalCosts(updatedCosts);
	};

	const handleAddCost = () => {
		const newId = uniqNumericId(additionalCosts);
		const newAdditionalCost = {
			name: '',
			amount: 0,
			id: newId,
			key: newId,
		};
		setAdditionalCosts([...additionalCosts, newAdditionalCost]);
	};
	const handleDeleteCost = (id?: number) => {
		const newArray = additionalCosts.filter((item) => item.id !== id);
		setAdditionalCosts(newArray);
	};
	const handleCancel = useCallback(
		(e: MouseEvent<HTMLElement>) => {
			props.onCancel?.(e);
			form.resetFields();
		},
		[props, form]
	);
	const { mutate: handleSave, isLoading } = useMutation(
		(payload: Array<AdditionalCostPayload>) =>
			bookingsAPI.addAdditionalCost(id, saveAndSend, payload),
		{
			onSuccess: () => {
				form.resetFields();
				queryClient.invalidateQueries(['booking']);
				message.success(t('Additional cost added successfully!'));
				handleCancel(undefined as unknown as MouseEvent<HTMLElement>);
			},
			onError: (error: Error) => {
				message.error(error.message);
			},
		}
	);
	const { mutate: handleUpdate, isLoading: isLoadingUpdate } = useMutation(
		(payload: Array<AdditionalCostPayload>) =>
			bookingsAPI.updateAdditionalCost(id, saveAndSend, payload),
		{
			onSuccess: () => {
				form.resetFields();
				queryClient.invalidateQueries(['booking']);
				message.success(t('Additional cost update successfully!'));
				handleCancel(undefined as unknown as MouseEvent<HTMLElement>);
			},
			onError: (error: Error) => {
				message.error(error.message);
			},
		}
	);
	const handleClick = () => {
		const newAdditionalCosts = additionalCosts.map((obj) => {
			if (obj.key) return { name: obj.name, amount: obj.amount };
			return { ...obj };
		});
		const payload: AdditionalCostPayload[] = newAdditionalCosts;
		if (data && data?.length > 0) {
			handleUpdate(payload);
		} else {
			handleSave(payload);
		}
	};
	const { mutate: sendFortnox, isLoading: isLoadingSendFortnox } = useMutation(
		() => bookingsAPI.sendToFortnox(id),
		{
			onSuccess: () => {
				form.resetFields();
				queryClient.invalidateQueries(['booking']);
				//	queryClient.invalidateQueries(['bookingTransactions']);
				message.success(t('Booking additional cost has been send to fortnox!'));
				//handleCancel(undefined as unknown as MouseEvent<HTMLElement>);
			},
			onError: (error: Error) => {
				message.error(error.message);
			},
		}
	);
	const handleSendConfirmToFortnox = () => {
		sendFortnox();
	};
	const handleConfirm = () => {
		if (formRef.current) {
			formRef.current.submit();
		}
	};
	return (
		<>
			<Typography.Title level={4} type='primary' style={{ textAlign: 'center', marginBottom: 30 }}>
				{t('Add Additional cost')}
			</Typography.Title>

			<Form form={form} ref={formRef} layout='vertical' size='large' onFinish={handleClick}>
				{additionalCosts.length > 0 &&
					additionalCosts.map((cost, index) => (
						<Row gutter={12} align='middle' key={cost.id}>
							<Col span={11}>
								<Form.Item
									label={t('Field name')}
									rules={[{ required: true, message: t('Field name is required!') }]}
								>
									<Input
										style={{ width: '100%' }}
										placeholder={t('Field name')}
										value={cost.name}
										onChange={(e) => handleChange(index, 'name', e.target.value)}
									/>
								</Form.Item>
							</Col>
							<Col span={11}>
								<Form.Item
									label={t('Amount')}
									rules={[{ required: true, message: t('Payment amount is required!') }]}
								>
									<InputNumber
										style={{ width: '100%' }}
										placeholder={t('Payment amount')}
										precision={0}
										value={cost.amount}
										onChange={(value: any) => handleChange(index, 'amount', parseInt(value))}
									/>
								</Form.Item>
							</Col>
							<Col span={2}>
								<Button
									danger
									type='link'
									icon={<DeleteOutlined />}
									onClick={() => handleDeleteCost(cost.id)}
								/>
							</Col>
						</Row>
					))}

				<Button icon={<PlusOutlined />} onClick={handleAddCost}>
					{t('Add cost')}
				</Button>

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
								handleConfirm();
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
							onConfirm={() => {
								handleSendConfirmToFortnox();
							}}
						>
							<Button
								type='default'
								htmlType='submit'
								loading={isLoadingSendFortnox}
								style={{ minWidth: 120 }}
							>
								{t('Send to fortnox')}
							</Button>
						</Popconfirm>
					</Col>
				</Row>
			</Form>
		</>
	);
};
