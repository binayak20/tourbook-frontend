import {
	CreditCardOutlined,
	MailOutlined,
	PrinterOutlined,
	ReloadOutlined,
} from '@ant-design/icons';
import { Button } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { ManualPaymentModal } from './ManualPaymentModal';

export const AdditionalActions = () => {
	const { t } = useTranslation();
	const [isPaymentModalVisible, setPaymentModalVisible] = useState(false);

	return (
		<Wrapper>
			<Button block size='large' type='default' onClick={() => setPaymentModalVisible(true)}>
				<CreditCardOutlined /> {t('Payment')}
			</Button>
			<ManualPaymentModal
				visible={isPaymentModalVisible}
				onCancel={() => setPaymentModalVisible(false)}
			/>

			<Button block size='large' type='default'>
				<PrinterOutlined /> {t('Print Booking Info')}
			</Button>

			<Button block size='large' type='default'>
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
