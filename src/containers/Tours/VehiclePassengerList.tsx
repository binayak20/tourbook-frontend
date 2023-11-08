import { Button } from '@/components/atoms';
import config from '@/config';
import { toursAPI } from '@/libs/api';
import { PRIVATE_ROUTES } from '@/routes/paths';
import { selectFilterBy } from '@/utils/helpers';
import { DownloadOutlined } from '@ant-design/icons';
import { Select, Space, Table, message } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { useTTFData } from './hooks/useTTFData';

function VehiclePassengerList({ Id }: { Id: number }) {
	const { t } = useTranslation();
	const [{ data: vehicles, isLoading: isVehiclesLoading }] = useTTFData();
	const [vehicleId, setVehicleId] = useState<number | undefined>(undefined);

	const { mutate: handleDownload } = useMutation(
		() => toursAPI.vehiclePassengerListXlDownload(Id, vehicleId),
		{
			onSuccess: (data: Blob) => {
				const filename = `${Id}-vehicle-passenger-list.xlsx`;
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
		}
	);
	const changeVehicleId = (value: number) => {
		setVehicleId(value);
	};
	const { data, isLoading } = useQuery(
		['Vehicle-passengers', vehicleId],
		() => toursAPI.passengersListOfVehicle(Id, vehicleId),
		{
			enabled: vehicleId !== undefined,
		}
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
			title: t('Phone'),
			dataIndex: 'telephone',
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
				<label htmlFor='Vehicle list'>{t('Vehicles')}: </label>
				<Select
					style={{ width: 200 }}
					showSearch
					filterOption={selectFilterBy}
					showArrow
					placeholder={t('Choose a vehicle')}
					loading={isVehiclesLoading}
					options={vehicles?.results?.map(({ id, name }) => ({
						value: id,
						label: name,
					}))}
					value={vehicleId}
					onChange={changeVehicleId}
				/>
				<Button
					type='primary'
					size='small'
					icon={<DownloadOutlined />}
					onClick={() => {
						handleDownload();
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

export default VehiclePassengerList;
