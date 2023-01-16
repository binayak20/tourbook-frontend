import { CloseOutlined, EyeOutlined, InboxOutlined } from '@ant-design/icons';
import { Typography } from '@/components/atoms';
import { Modal, ModalProps, Upload, Button, Space, message } from 'antd';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';

import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useMutation, useQuery } from 'react-query';
import { bookingsAPI } from '@/libs/api';
import { useParams } from 'react-router-dom';

const { Dragger } = Upload;

const TicketsViewModal: FC<ModalProps> = (props) => {
	const { t } = useTranslation();
	const { id } = useParams() as unknown as { id: number };
	const [fileList, setFileList] = useState<UploadFile[]>([]);

	const { data: uploadedTickets, refetch: fetchUploadedTickets } = useQuery(
		['UploadedTickets', id],
		() => bookingsAPI.getTicketsList(id)
	);

	const { mutate: deleteTicket } = useMutation(
		(FromID: number | string) => bookingsAPI.deleteTicket(id, FromID),
		{
			onSuccess: () => {
				message.success(t('Tickets has been updated!'));
				fetchUploadedTickets();
			},
			onError: (error: Error) => {
				fetchUploadedTickets();
				message.error(error.message);
			},
		}
	);
	const { mutate: uploadTickets, isLoading } = useMutation(
		(payload: FormData) => bookingsAPI.uploadTickets(id, payload),
		{
			onSuccess: () => {
				message.success(t('Tickets has been updated!'));
				fetchUploadedTickets();
				setFileList([]);
			},
			onError: (error: Error) => {
				message.error(error.message);
			},
		}
	);

	const handleUpload = () => {
		const formData = new FormData();
		fileList.forEach((file) => {
			formData.append('field_name', 'booking_file');
			formData.append('file_objects', file as RcFile);
		});
		uploadTickets(formData);
	};

	const fileUploadProps: UploadProps = {
		multiple: true,
		onRemove: (file) => {
			setFileList((prev) => {
				const index = prev.indexOf(file);
				const newFileList = prev.slice();
				newFileList.splice(index, 1);
				return newFileList;
			});
		},
		beforeUpload: (file) => {
			setFileList((prev) => [...prev, file]);
			return;
		},
		fileList,
		accept: '.pdf',
	};

	const uploadProps: UploadProps = useMemo(() => {
		return {
			fileList: (uploadedTickets || [])?.map(({ id, file_name, booking_file }) => ({
				uid: id as unknown as string,
				name: file_name,
				status: 'done',
				url: booking_file,
			})),
			onRemove: (file) => {
				deleteTicket(file.uid);
			},
			iconRender: () => {
				return <EyeOutlined />;
			},
		};
	}, [uploadedTickets, deleteTicket]);

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
			<Space direction='vertical' style={{ margin: '20px', width: '95%' }}>
				<Typography.Title level={3} type='primary' style={{ marginBottom: 30 }}>
					{t('Tickets')}
				</Typography.Title>
				{uploadedTickets && uploadedTickets?.length > 0 && (
					<Typography.Title style={{ color: '#9FBCE5' }} level={5}>
						{t('Exsisting Tickets')}
					</Typography.Title>
				)}
				<CustomUpload {...uploadProps} />
				<Dragger {...fileUploadProps}>
					<p className='ant-upload-drag-icon'>
						<InboxOutlined />
					</p>
					<p className='ant-upload-text'>{t('Click or drag file to this area to upload')}</p>
					<p className='ant-upload-hint'>
						{t(
							'Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files'
						)}
					</p>
				</Dragger>
				<Space align='center' direction='vertical' style={{ width: '100%', marginTop: '40px' }}>
					<Space style={{ marginTop: 16 }}>
						<Button
							size='large'
							type='default'
							style={{ backgroundColor: '#E7EEF8', height: '48px', width: '155px' }}
						>
							{t('Cancel')}
						</Button>
						<Button
							type='primary'
							size='large'
							onClick={handleUpload}
							disabled={fileList.length === 0}
							loading={isLoading}
							style={{ height: '48px', width: '155px' }}
						>
							{isLoading ? t('Uploading') : t('Start Upload')}
						</Button>
					</Space>
				</Space>
			</Space>
		</Modal>
	);
};

export default TicketsViewModal;

const CustomUpload = styled(Upload)`
	.ant-upload-list-text {
		display: flex;
		flex-wrap: wrap;
		margin-bottom: 20px;
	}

	.ant-upload-list-text-container {
		flex-basis: 50%;
		padding-bottom: 5px;
		padding-right: 10px;
	}
`;
