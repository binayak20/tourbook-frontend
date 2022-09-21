import { bookingsAPI } from '@/libs/api';
import {
	CreditCardOutlined,
	MailOutlined,
	PrinterOutlined,
	ReloadOutlined,
} from '@ant-design/icons';
import { Button, message } from 'antd';
import { FC, MouseEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { ManualPaymentModal } from './ManualPaymentModal';

type AdditionalActionsProps = {
	bookingRef: string;
};

export const AdditionalActions: FC<AdditionalActionsProps> = ({ bookingRef }) => {
	const { t } = useTranslation();
	const { id } = useParams() as unknown as { id: number };
	const [isPaymentModalVisible, setPaymentModalVisible] = useState(false);

	const downloadPDF = (data: Blob, filename: string) => {
		const link = document.createElement('a');
		link.href = URL.createObjectURL(data);
		link.download = filename;
		document.body.append(link);
		link.click();
		link.remove();
	};

	const { mutate: mutatePrintBookingInfo, isLoading: isLoadingPrintBookingInfo } = useMutation(
		() => bookingsAPI.printBookingInfo(id),
		{
			onSuccess: (data) => {
				downloadPDF(data, `booking-${bookingRef}.pdf`);
			},
		}
	);

	const { mutate: mutateEmailBookingInfo, isLoading: isLoadingEmailBookingInfo } = useMutation(
		(_e: MouseEvent<HTMLButtonElement>) => bookingsAPI.emailBookingInfo(id),
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
			<Button block size='large' type='default' onClick={() => setPaymentModalVisible(true)}>
				<CreditCardOutlined /> {t('Payment')}
			</Button>
			<ManualPaymentModal
				open={isPaymentModalVisible}
				onCancel={() => setPaymentModalVisible(false)}
			/>

			<Button
				block
				size='large'
				type='default'
				onClick={() => mutatePrintBookingInfo()}
				loading={isLoadingPrintBookingInfo}
			>
				<PrinterOutlined /> {t('Print Booking Info')}
			</Button>

			<Button
				block
				size='large'
				type='default'
				onClick={mutateEmailBookingInfo}
				loading={isLoadingEmailBookingInfo}
			>
				<MailOutlined /> {t('Email Booking Info')}
			</Button>

			<Button block size='large' type='default'>
				<ReloadOutlined /> {t('Transfer Booking')}
			</Button>
		</Wrapper>
	);
};

const Wrapper = styled.div`
	margin: 50px 0;

	.ant-btn {
		text-align: left;
		padding-inline: 30px;
		color: ${({ theme }) => theme.colors.text};

		& + .ant-btn {
			margin-top: 12px;
		}
	}
`;
