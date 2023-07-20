import { Button, Typography } from '@/components/atoms';
import { TicketSupplier, TicketSupplierCreate } from '@/libs/api/@types';
import { ticketSupplierAPI } from '@/libs/api/ticketSupplierAPI';
import { Col, Form, Input, message, Row } from 'antd';
import { FC, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';

export const CreateTicketSupplier: FC<{ selected?: TicketSupplier; closeModal?: () => void }> = ({
	selected,
	closeModal,
}) => {
	const { t } = useTranslation();
	const queryClient = useQueryClient();
	const [form] = Form.useForm<TicketSupplierCreate>();
	const { mutate: createTicketSupplier } = useMutation(
		(data: API.TicketSupplierCreate) =>
			selected ? ticketSupplierAPI.update(selected?.id, data) : ticketSupplierAPI.create(data),
		{
			onSuccess: () => {
				queryClient.invalidateQueries(['ticket-suppliers']);
				message.success(
					selected ? t('Supplier has been updated') : t('New supplier has been created!')
				);
			},
			onError: (error: Error) => {
				message.error(error.message);
			},
			onSettled: closeModal,
		}
	);
	const handleSubmit = useCallback(
		(data: TicketSupplierCreate) => {
			createTicketSupplier(data);
		},
		[createTicketSupplier]
	);

	useEffect(() => {
		form.setFieldsValue({
			name: selected?.name,
		});
	}, [selected?.name, form]);

	return (
		<Form form={form} onFinish={handleSubmit}>
			<Row justify='center'>
				<Col span={24} className='margin-4-bottom'>
					<Typography.Title level={4} type='primary' className='margin-0'>
						{selected ? t('Edit Supplier') : t('Create Supplier')}
					</Typography.Title>
				</Col>
				<Col span={24}>
					<Form.Item
						label={t('Name')}
						name='name'
						labelCol={{ span: 24 }}
						rules={[{ required: true, message: t('Ticket supplier name is required!') }]}
					>
						<Input />
					</Form.Item>
				</Col>
				<Col>
					<Form.Item>
						<Button type='primary' htmlType='submit' size='large'>
							{selected ? t('Update') : t('Create')}
						</Button>
					</Form.Item>
				</Col>
			</Row>
		</Form>
	);
};
