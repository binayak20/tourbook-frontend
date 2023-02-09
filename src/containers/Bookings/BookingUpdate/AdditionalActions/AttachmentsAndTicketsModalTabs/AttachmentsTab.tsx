import { Typography } from '@/components/atoms';
import { EyeOutlined, InboxOutlined } from '@ant-design/icons';
import { Button, message, Space, Upload } from 'antd';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';

import { bookingsAPI } from '@/libs/api';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

type AttachmentViewModalprops = {
	onCancel: ((e: React.MouseEvent<HTMLElement, MouseEvent>) => void) | undefined;
};

const AttachmentsTab = ({ onCancel }: AttachmentViewModalprops) => {
	const { t } = useTranslation();
	const { id } = useParams() as unknown as { id: number };
	const [fileList, setFileList] = useState<UploadFile[]>([]);

	const { data: uploadedAttachments, refetch: fetchUploadedAttachments } = useQuery(
		['UploadedAttachments', id],
		() => bookingsAPI.getAttachmentsList(id)
	);

	const { mutate: deleteAttachment } = useMutation(
		(FromID: number | string) => bookingsAPI.deleteAttachment(id, FromID),
		{
			onSuccess: () => {
				message.success(t('Attachments has been updated!'));
				fetchUploadedAttachments();
			},
			onError: (error: Error) => {
				fetchUploadedAttachments();
				message.error(error.message);
			},
		}
	);

	const { mutate: uploadAttachments, isLoading } = useMutation(
		(payload: FormData) => bookingsAPI.uploadAttachments(id, payload),
		{
			onSuccess: () => {
				message.success(t('Attachments has been updated!'));
				fetchUploadedAttachments();
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
		uploadAttachments(formData);
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
			return false;
		},
		fileList,
		accept: '.pdf',
	};

	const uploadProps: UploadProps = useMemo(() => {
		return {
			fileList: (uploadedAttachments || [])?.map(({ id, file_name, booking_file }) => ({
				uid: id as unknown as string,
				name: file_name,
				status: 'done',
				url: booking_file,
			})),
			onRemove: (file) => {
				deleteAttachment(file.uid);
			},
			iconRender: () => {
				return <EyeOutlined />;
			},
		};
	}, [uploadedAttachments, deleteAttachment]);

	return (
		<Space direction='vertical' style={{ margin: '20px', width: '95%' }}>
			{uploadedAttachments && uploadedAttachments?.length > 0 && (
				<Typography.Title style={{ color: '#9FBCE5' }} level={5}>
					{t('Exsisting Attachments')}
				</Typography.Title>
			)}
			<CustomUpload {...uploadProps} />
			<Upload.Dragger {...fileUploadProps}>
				<p className='ant-upload-drag-icon'>
					<InboxOutlined />
				</p>
				<p className='ant-upload-text'>{t('Click or drag file to this area to upload')}</p>
				<p className='ant-upload-hint'>
					{t(
						'Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files'
					)}
				</p>
			</Upload.Dragger>
			<Space align='center' direction='vertical' style={{ width: '100%', marginTop: '40px' }}>
				<Space style={{ marginTop: 16 }}>
					<Button
						size='large'
						type='default'
						style={{ backgroundColor: '#E7EEF8', height: '48px', width: '155px' }}
						onClick={onCancel}
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
	);
};

export default AttachmentsTab;

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
