import { useBookingContext } from '@/components/providers/BookingProvider';
import { bookingsAPI } from '@/libs/api';
import {
	ContainerOutlined,
	CreditCardOutlined,
	MailOutlined,
	PrinterOutlined,
	ReloadOutlined,
	RollbackOutlined,
} from '@ant-design/icons';
import { Button, message } from 'antd';
import { MouseEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import AttachmentsModal from './AttachmentsModal';
import { PaymentModal } from './PaymentModal';
import { RefundModal } from './RefundModal';
import { TransferBookingModal } from './TransferBookingModal';

type AdditionalActionsProps = {
	isLoading: boolean;
};

export const AdditionalActions: React.FC<AdditionalActionsProps> = ({ isLoading }) => {
	const {
		bookingInfo: { reference, number_of_passenger, is_departed, is_paid },
		isDisabled,
	} = useBookingContext();
	const { t } = useTranslation();
	const { id } = useParams() as unknown as { id: number };
	const [isPaymentModalVisible, setPaymentModalVisible] = useState(false);
	const [isRefundModalVisible, setRefundModalVisible] = useState(false);
	const [isTicketViewModalVisible, setTicketViewModalVisible] = useState(false);
	const [isTransferBookingModalVisible, setTransferBookingModalVisible] = useState(false);

	const downloadPDF = (data: Blob, filename: string) => {
		const link = document.createElement('a');
		link.href = window.URL.createObjectURL(data);
		link.download = filename;
		document.body.append(link);
		link.click();
		link.remove();
	};

	const { mutate: mutatePrintBookingInfo, isLoading: isLoadingPrintBookingInfo } = useMutation(
		() => bookingsAPI.printInfo(id),
		{
			onSuccess: (data) => {
				downloadPDF(data, `booking-${reference}.pdf`);
			},
			onError: (error: Error) => {
				message.error(error.message);
			},
		}
	);

	const { mutate: mutateEmailBookingInfo, isLoading: isLoadingEmailBookingInfo } = useMutation(
		(_e: MouseEvent<HTMLButtonElement>) => bookingsAPI.emailInfo(id),
		{
			onSuccess: (data) => {
				message.success(data.detail);
			},
			onError: (error: Error) => {
				message.error(error.message);
			},
		}
	);

	return (
		<Wrapper>
			<Button
				block
				size='large'
				type='default'
				onClick={() => setPaymentModalVisible(true)}
				disabled={isDisabled || isLoading || (is_departed && is_paid)}
			>
				<CreditCardOutlined /> {t('Payment')}
			</Button>
			<PaymentModal open={isPaymentModalVisible} onCancel={() => setPaymentModalVisible(false)} />

			<Button
				block
				size='large'
				type='default'
				onClick={() => setRefundModalVisible(true)}
				disabled={isDisabled || isLoading || is_departed}
			>
				<RollbackOutlined /> {t('Refund')}
			</Button>
			<RefundModal open={isRefundModalVisible} onCancel={() => setRefundModalVisible(false)} />

			<Button
				block
				size='large'
				type='default'
				onClick={() => setTicketViewModalVisible(true)}
				disabled={isDisabled || isLoading || is_departed}
			>
				<ContainerOutlined /> {t('Attachments')}
			</Button>
			<AttachmentsModal
				open={isTicketViewModalVisible}
				onCancel={() => setTicketViewModalVisible(false)}
			/>

			<Button
				block
				size='large'
				type='default'
				onClick={() => mutatePrintBookingInfo()}
				loading={isLoadingPrintBookingInfo}
				disabled={isLoading}
			>
				<PrinterOutlined /> {t('Print Booking Info')}
			</Button>

			<Button
				block
				size='large'
				type='default'
				onClick={mutateEmailBookingInfo}
				loading={isLoadingEmailBookingInfo}
				disabled={isDisabled || isLoading || is_departed}
			>
				<MailOutlined /> {t('Email Booking Info')}
			</Button>

			<Button
				block
				size='large'
				type='default'
				onClick={() => setTransferBookingModalVisible(true)}
				disabled={isDisabled || isLoading || is_departed}
			>
				<ReloadOutlined /> {t('Transfer Booking')}
			</Button>
			<TransferBookingModal
				open={isTransferBookingModalVisible}
				onCancel={() => setTransferBookingModalVisible(false)}
				transferCapacity={number_of_passenger}
			/>
		</Wrapper>
	);
};

const Wrapper = styled.div`
	margin: 50px 0;

	.ant-btn {
		text-align: left;
		padding-inline: 30px;

		& + .ant-btn {
			margin-top: 12px;
		}
	}
`;
