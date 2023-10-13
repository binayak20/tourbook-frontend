import { paymentConfigsAPI } from '@/libs/api';
import { MailOutlined } from '@ant-design/icons';
import { Button, Popconfirm, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';

type PaymentReminderProps = {
	id: number;
	deadline_type: 'first_payment' | 'residue_payment';
};

function PaymentReminder({ id, deadline_type }: PaymentReminderProps) {
	const { t } = useTranslation();
	const { mutate: sendPaymentReminder } = useMutation(
		(payload: API.PaymentReminderPayload) => paymentConfigsAPI.sendPaymentReminder(id!, payload),
		{
			onSuccess: (response: { detail: string }) => {
				message.success(response?.detail);
			},
			onError: (error: Error) => {
				message.error(error.message);
			},
		}
	);
	return (
		<Popconfirm
			title={t('Do you really want to send reminder?')}
			okText='Yes'
			cancelText='No'
			onConfirm={() => sendPaymentReminder({ deadline_type: deadline_type })}
		>
			<Button type='link' size='small' icon={<MailOutlined />} />
		</Popconfirm>
	);
}

export default PaymentReminder;
