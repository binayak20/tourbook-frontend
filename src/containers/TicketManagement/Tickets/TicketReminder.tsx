import { Button } from '@/components/atoms';
import { CreateReminder, Ticket } from '@/libs/api/@types';
import { ticketsAPI } from '@/libs/api/ticketsAPI';
import { Col, Form, Input, InputNumber, Row, message } from 'antd';
import dayjs from 'dayjs';
import { pick } from 'lodash';
import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';

const TicketReminder: FC<{ selected?: Ticket; closeModal: () => void }> = ({
	selected,
	closeModal,
}) => {
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const queryClient = useQueryClient();

	useEffect(() => {
		form.setFieldsValue({
			...pick(selected, ['reminder_email', 'reminder_days', 'reminder_note']),
		});
	}, [form, selected]);

	const { mutate: updateReminder } = useMutation(
		(data: API.CreateReminder) => ticketsAPI.reminder(selected?.id, data),
		{
			onSuccess: () => {
				queryClient.invalidateQueries(['tickets']);
				message.success(t('Ticket reminder has been updated!'));
			},
			onError: (error: Error) => {
				message.error(error.message);
			},
			onSettled: closeModal,
		}
	);

	const handleOnFinish = (values: CreateReminder) => {
		updateReminder(values);
	};

	return (
		<Form form={form} onFinish={handleOnFinish} layout='vertical' size='large'>
			<Row gutter={[16, 8]} justify='center'>
				<Col span={8}>
					<Form.Item
						name='reminder_days'
						label={t('Days')}
						labelCol={{ span: 24 }}
						rules={[
							{ required: true, message: t('Reminder days is required!') },
							{
								validator: (_, value) => {
									if (value > dayjs(selected?.deadline).diff(dayjs(), 'days')) {
										return Promise.reject(
											new Error(t('Reminder days must be less than deadline days'))
										);
									}
									return Promise.resolve();
								},
							},
						]}
					>
						<InputNumber style={{ width: '100%' }} min={1} />
					</Form.Item>
				</Col>
				<Col span={16}>
					<Form.Item
						name='reminder_email'
						label={t('Email')}
						labelCol={{ span: 24 }}
						rules={[{ required: true, message: t('Reminder days is required!') }]}
					>
						<Input />
					</Form.Item>
				</Col>
				<Col span={24}>
					<Form.Item
						name='reminder_note'
						label={t('Reminder Note(Internal)')}
						labelCol={{ span: 24 }}
					>
						<Input />
					</Form.Item>
				</Col>
				<Col>
					<Button type='primary' htmlType='submit' size='large'>
						{t('Update')}
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

export default TicketReminder;
