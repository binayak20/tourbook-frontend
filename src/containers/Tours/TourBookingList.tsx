import { toursAPI } from '@/libs/api';
import { Space, Table, message } from 'antd';
import { useMutation, useQuery } from 'react-query';
import { ColumnsType } from 'antd/lib/table';
import { Button, Typography } from '@/components/atoms';
import { useTranslation } from 'react-i18next';
import { DownloadOutlined } from '@ant-design/icons';

function TourBookingList({ Id }: { Id: number }) {
	const { t } = useTranslation();

	const { mutate: HandleDownload } = useMutation(() => toursAPI.booking_list_xl_download(Id), {
		onSuccess: (Resdata: Blob) => {
			const url = window.URL.createObjectURL(Resdata);
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', `${Date.now()}-Booking-list.xlsx`);
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
			message.success('Downloaded');
		},
		onError: (error: Error) => {
			message.error(error.message);
		},
	});

	const { data, isLoading } = useQuery(['Booked-tours'], () => toursAPI.booking_list_of_tours(Id));

	const columns: ColumnsType<API.BookingTour> = [
		{
			title: 'Id',
			dataIndex: 'id',
		},
		{
			title: t('Booking Name'),
			dataIndex: 'booking_name',
		},
		{
			title: 'Ref',
			dataIndex: 'reference',
		},
		{
			title: t('Date of birth'),
			render: (record) => {
				return record?.primary_passenger?.date_of_birth || '-';
			},
		},
		{
			title: t('Passport Number'),
			render: (record) => {
				return record?.primary_passenger?.passport_number || '-';
			},
		},
		{
			title: t('Email'),
			render: (record) => {
				return record?.primary_passenger?.email || '-';
			},
		},
		{
			title: t('Phone'),
			render: (record) => {
				return record?.primary_passenger?.telephone_number || '-';
			},
		},
	];

	return (
		<div>
			<Space style={{ marginBottom: '20px' }}>
				<Typography.Title level={5}>{t('Bookings')}</Typography.Title>
				<Button
					type='primary'
					size='small'
					icon={<DownloadOutlined />}
					onClick={() => {
						HandleDownload();
					}}
				>
					{t('Download')}
				</Button>
			</Space>
			<Table rowKey={'id'} dataSource={data} loading={isLoading} columns={columns} />
		</div>
	);
}

export default TourBookingList;
