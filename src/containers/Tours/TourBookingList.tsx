import { Button } from '@/components/atoms';
import config from '@/config';
import { toursAPI } from '@/libs/api';
import { PRIVATE_ROUTES } from '@/routes/paths';
import { CheckCircleFilled, CloseCircleFilled, DownloadOutlined } from '@ant-design/icons';
import { Space, Table, message } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import { Link } from 'react-router-dom';

function TourBookingList({ Id }: { Id: number }) {
	const { t } = useTranslation();

	const { mutate: HandleDownload } = useMutation(() => toursAPI.bookingListXlDownload(Id), {
		onSuccess: (data: Blob) => {
			const filename = `${Id}-Booking-list.xlsx`;
			const link = document.createElement('a');
			link.href = window.URL.createObjectURL(data);
			link.download = filename;
			document.body.append(link);
			link.click();
			link.remove();
		},
		onError: (error: Error) => {
			message.error(error.message);
		},
	});

	const { data, isLoading } = useQuery(['Booked-passengers'], () =>
		toursAPI.passengersListOfTours(Id)
	);

	const tableData = data?.results?.map((item: API.BookingPassenger, index: number) => {
		return {
			...item,
			passengerID: index,
		};
	});

	const columns: ColumnsType<API.BookingPassenger> = [
		{
			title: t('Booking reference'),
			dataIndex: 'booking_reference',
			render: (value, record) => {
				const bookingURL = `/dashboard/${PRIVATE_ROUTES.BOOKINGS_UPDATE.replace(
					':id',
					record.id.toString()
				)}`;
				return <Link to={bookingURL}>{value}</Link>;
			},
		},
		{
			title: t('Passenger Name'),
			dataIndex: 'passenger_name',
			render: (value) => {
				return value || '-';
			},
		},
		{
			title: t('Date of birth'),
			dataIndex: 'date_of_birth',
			render: (value) => {
				return value ? dayjs(value)?.format(config.dateFormat) : '-';
			},
		},
		{
			title: t('Email'),
			dataIndex: 'email',
			render: (value) => {
				return value || '-';
			},
		},

		{
			title: t('Passport'),
			dataIndex: 'passport_number',
			render: (value) => {
				return value || '-';
			},
		},
		{
			title: t('Pickup location'),
			dataIndex: 'pickup_location',
			render: (value) => {
				return value || '-';
			},
		},
		{
			align: 'center',
			title: t('Payment status'),
			dataIndex: 'is_paid',
			render: (value) => {
				return value ? (
					<CheckCircleFilled style={{ color: '#52c41a' }} />
				) : (
					<CloseCircleFilled style={{ color: '#eb2f2f' }} />
				);
			},
		},

		{
			title: t('Booking date'),
			dataIndex: 'booking_date',
			render: (value) => {
				return value ? dayjs(value)?.format(config.dateFormat) : '-';
			},
		},
	];

	return (
		<div>
			<Space style={{ marginBottom: '20px' }}>
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
			<Table
				scroll={{ x: 1200, y: '100%' }}
				rowKey={'passengerID'}
				dataSource={tableData}
				loading={isLoading}
				columns={columns}
			/>
		</div>
	);
}

export default TourBookingList;
