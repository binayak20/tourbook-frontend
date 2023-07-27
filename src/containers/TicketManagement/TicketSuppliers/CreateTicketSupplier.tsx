import { Button } from '@/components/atoms';
import { TicketSupplier, TicketSupplierCreate } from '@/libs/api/@types';
import { ticketSupplierAPI } from '@/libs/api/ticketSupplierAPI';
import { Col, Form, Input, Row, message } from 'antd';
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
		<Form form={form} layout='vertical' size='large' onFinish={handleSubmit}>
			<Row justify='center' gutter={[16, 8]}>
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
					<Button type='primary' htmlType='submit' size='large'>
						{selected ? t('Update') : t('Create')}
					</Button>
				</Col>
				<Col>
					<Button size='large' onClick={closeModal}>
						{t('Cancel')}
					</Button>
				</Col>
			</Row>
		</Form>
	);
};
