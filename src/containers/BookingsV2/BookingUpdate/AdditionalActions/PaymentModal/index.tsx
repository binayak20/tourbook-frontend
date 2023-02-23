import { Modal, ModalProps, Tabs } from 'antd';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { InvoicePayment } from './InvoicePayment';
import { ManualPayment } from './ManualPayment';

export const PaymentModal: FC<ModalProps> = (props) => {
	const { t } = useTranslation();

	const items = [
		{
			label: t('Manual Payment'),
			key: 'manual-payment',
			children: <ManualPayment onCancel={props?.onCancel} />,
		},
		{
			label: t('Invoice Payment'),
			key: 'invoice-payment',
			children: <InvoicePayment onCancel={props?.onCancel} />,
		},
	];

	return (
		<Modal centered width={700} footer={false} {...props}>
			<Tabs items={items} />
		</Modal>
	);
};
