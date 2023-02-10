import { CloseOutlined, FileTextOutlined } from '@ant-design/icons';
import { Modal, ModalProps, Tabs, TabsProps } from 'antd';

import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { UploadAttachments } from './UploadAttachments';
import { UploadTickets } from './UploadTickets';

const AttachmentsModal: FC<ModalProps> = (props) => {
	const { t } = useTranslation();

	const items = useMemo(() => {
		return [
			{
				key: '1',
				label: (
					<>
						<svg
							width='22'
							height='24'
							fill='none'
							viewBox='0 0 24 22'
							style={{ height: 16, marginBottom: '-0.25rem', marginRight: '0.3rem' }}
						>
							<path
								fill='currentColor'
								d='M20.373 6.651a2.14 2.14 0 000-3.026 2.084 2.084 0 00-1.582-.623c-.593.02-1.15.285-1.541.732l-2.436 2.798-7.367-3.057a.696.696 0 00-.754.15l-1.37 1.37a.692.692 0 00.07 1.038l5.856 4.44L8.1 13.718l-3.483-1.31a.686.686 0 00-.734.158l-.68.679a.694.694 0 00.07 1.042l3.378 2.551.569.567 2.487 3.318c.12.161.304.262.504.277h.05a.69.69 0 00.489-.203l.68-.68a.692.692 0 00.16-.728l-1.255-3.427 3.244-3.148 4.384 5.789a.69.69 0 00.503.272c.2.01.394-.063.537-.201l1.364-1.364a.693.693 0 00.15-.755l-3.049-7.367 2.79-2.43a1.34 1.34 0 00.114-.107zm-1.014-.944L16.185 8.47a.693.693 0 00-.185.787l3.069 7.403-.476.475-4.376-5.779a.693.693 0 00-1.033-.079l-4.108 3.987a.692.692 0 00-.188.754l.928 2.536-1.513-2.017a.692.692 0 00-.064-.074l-.597-.597a.585.585 0 00-.104-.096L5.471 14.21l2.57.97a.69.69 0 00.742-.168l4.007-4.132a.692.692 0 00-.08-1.035L6.865 5.414l.48-.48 7.4 3.07c.274.113.59.04.786-.184l2.763-3.174a.744.744 0 01.545-.258.696.696 0 01.553.22c.143.14.222.333.221.532a.78.78 0 01-.253.567z'
							></path>
						</svg>{' '}
						{t('Tickets')}
					</>
				),
				children: <UploadTickets open={props.open} onCancel={props.onCancel} />,
			},
			{
				key: '2',
				label: (
					<>
						<FileTextOutlined />
						{t('Attachments')}
					</>
				),
				children: <UploadAttachments open={props.open} onCancel={props.onCancel} />,
			},
		] as TabsProps['items'];
	}, [props.onCancel, props.open, t]);

	return (
		<Modal
			centered
			width={900}
			{...props}
			footer={false}
			style={{ padding: '24px' }}
			closeIcon={
				<CloseOutlined
					style={{
						backgroundColor: '#E7EEF8',
						borderRadius: '50%',
						padding: '12px',
						margin: '15px 15px 0px 0px',
					}}
				/>
			}
		>
			<Tabs defaultActiveKey='1' items={items} />
		</Modal>
	);
};

export default AttachmentsModal;
