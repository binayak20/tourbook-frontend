import { toursAPI } from '@/libs/api';
import { Space, Table, message } from 'antd';
import { useMutation, useQuery } from 'react-query';
import { ColumnsType } from 'antd/lib/table';
import { Button, Typography } from '@/components/atoms';
import { useTranslation } from 'react-i18next';
import { DownloadOutlined } from '@ant-design/icons';
import config from '@/config';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { PRIVATE_ROUTES } from '@/routes/paths';

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
				return value ? moment(value)?.format(config.dateFormat) : '-';
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
			title: t('Booking date'),
			dataIndex: 'booking_date',
			render: (value) => {
				return value ? moment(value)?.format(config.dateFormat) : '-';
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
