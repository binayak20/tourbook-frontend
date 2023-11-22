import { Typography } from '@/components/atoms';
import { useBookingContext } from '@/components/providers/BookingProvider';
import { bookingsAPI } from '@/libs/api';
import { EyeOutlined, InboxOutlined } from '@ant-design/icons';
import { Button, Col, ModalProps, Row, Upload, UploadFile, message } from 'antd';
import { RcFile, UploadProps } from 'antd/lib/upload';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

type UploadTicketsProps = Pick<ModalProps, 'open' | 'onCancel'>;

export const UploadTickets: React.FC<UploadTicketsProps> = ({ open, onCancel }) => {
	const { t } = useTranslation();
	const { id } = useParams() as unknown as { id: number };
	const [fileList, setFileList] = useState<UploadFile[]>([]);
	const {
		bookingInfo: { is_departed },
	} = useBookingContext();

	const { data: uploadedTickets, refetch: fetchUploadedTickets } = useQuery(
		['UploadedTickets', id],
		() => bookingsAPI.getTicketsList(id),
		{
			enabled: open,
		}
	);

	const { mutate: handleUploadTickets, isLoading } = useMutation(
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

	const { mutate: handleDeleteTicket } = useMutation(
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

	const handleUpload = useCallback(() => {
		const formData = new FormData();
		fileList.forEach((file) => {
			formData.append('field_name', 'booking_file');
			formData.append('file_objects', file as RcFile);
		});
		handleUploadTickets(formData);
	}, [fileList, handleUploadTickets]);

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
			fileList: (uploadedTickets || [])?.map(({ id, file_name, booking_file }) => ({
				uid: id as unknown as string,
				name: file_name,
				status: 'done',
				url: booking_file,
			})),
			onRemove: (file) => {
				handleDeleteTicket(file.uid);
			},
			iconRender: () => {
				return <EyeOutlined />;
			},
		};
	}, [uploadedTickets, handleDeleteTicket]);

	return (
		<Row gutter={[16, 16]}>
			<Col span={24}>
				{uploadedTickets && uploadedTickets?.length > 0 && (
					<Typography.Title style={{ color: '#9FBCE5' }} level={5}>
						{t('Existing Tickets')}
					</Typography.Title>
				)}
				<CustomUpload {...uploadProps} />
			</Col>
			<Col span={24}>
				<Upload.Dragger {...fileUploadProps} disabled={is_departed}>
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
			</Col>
			<Col span={24}>
				<Row justify='center' gutter={[8, 8]}>
					<Col span={4}>
						<Button block size='large' type='default' onClick={onCancel}>
							{t('Cancel')}
						</Button>
					</Col>

					<Col span={4}>
						<Button
							block
							type='primary'
							size='large'
							onClick={handleUpload}
							disabled={fileList.length === 0}
							loading={isLoading}
						>
							{isLoading ? t('Uploading') : t('Start Upload')}
						</Button>
					</Col>
				</Row>
			</Col>
		</Row>
	);
};

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
