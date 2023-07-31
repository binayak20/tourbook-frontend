import { useBookingContext } from '@/components/providers/BookingProvider';
import { bookingsAPI } from '@/libs/api';
import {
	ContainerOutlined,
	CreditCardOutlined,
	FundProjectionScreenOutlined,
	MailOutlined,
	PrinterOutlined,
	ReloadOutlined,
	RollbackOutlined,
	TagsOutlined,
} from '@ant-design/icons';
import { Button, message } from 'antd';
import { MouseEvent, useState } from 'react';
import { useAccessContext } from 'react-access-boundary';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { AdditionalCostModal } from './AdditionalCostModal';
import AttachmentsModal from './AttachmentsModal';
import { PaymentModal } from './PaymentModal';
import { RefundModal } from './RefundModal';
import TicketsModal from './TicketsModal';
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
	const { isAllowedTo } = useAccessContext();
	const { id } = useParams() as unknown as { id: number };
	const [isPaymentModalVisible, setPaymentModalVisible] = useState(false);
	const [isAdditionalCostModalVisible, setAdditionalCostModalVisible] = useState(false);
	const [isRefundModalVisible, setRefundModalVisible] = useState(false);
	const [isAttachmentModalVisible, setIsAttachmentModalVisible] = useState(false);
	const [isTransferBookingModalVisible, setTransferBookingModalVisible] = useState(false);
	const [isTicketsModalVisible, setIsTicketModalVisible] = useState(false);

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
				onClick={() => setAdditionalCostModalVisible(true)}
				disabled={!is_departed}
			>
				<FundProjectionScreenOutlined /> {t('Additional cost')}
			</Button>

			<AdditionalCostModal
				open={isAdditionalCostModalVisible}
				onCancel={() => setAdditionalCostModalVisible(false)}
			/>

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
				onClick={() => setIsAttachmentModalVisible(true)}
				disabled={isDisabled || isLoading}
			>
				<ContainerOutlined /> {t('Attachments')}
			</Button>
			<AttachmentsModal
				open={isAttachmentModalVisible}
				onCancel={() => setIsAttachmentModalVisible(false)}
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
				disabled={isDisabled || isLoading}
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
			<Button
				block
				size='large'
				type='default'
				onClick={() => setIsTicketModalVisible(true)}
				disabled={isDisabled || isLoading || is_departed || !isAllowedTo('VIEW_BOOKINGTICKET')}
			>
				<TagsOutlined /> {t('Tickets')}
			</Button>
			<TicketsModal
				open={isTicketsModalVisible}
				onCancel={() => setIsTicketModalVisible(false)}
				destroyOnClose
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
