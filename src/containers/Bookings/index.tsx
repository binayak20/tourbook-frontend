import { Typography } from '@/components/atoms';
import config from '@/config';
import { bookingsAPI } from '@/libs/api';
import { Col, Progress, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FilterBookings } from './FilterBookings';

export const Bookings = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const currentPage = useMemo(() => parseInt(searchParams.get('page') || '1'), [searchParams]);

	const bookingsParams: API.BookingParams = useMemo(() => {
		return {
			page: currentPage,
			booking_name: searchParams.get('booking_name') || '',
			booking_reference: searchParams.get('booking_reference') || '',
			departure_date: searchParams.get('departure_date') || '',
		};
	}, [currentPage, searchParams]);

	const { data, isLoading } = useQuery(['bookings', bookingsParams], () =>
		bookingsAPI.list(bookingsParams)
	);

	const handlePageChange = useCallback(
		(page: number) => {
			navigate(page > 1 ? `?page=${page}` : '');
		},
		[navigate]
	);

	const columns: ColumnsType<API.Booking> = [
		{
			width: 200,
			ellipsis: true,
			title: t('Name'),
			dataIndex: 'booking_name',
			render: (booking_name, { id }) => <Link to={`edit/${id}`}>{booking_name}</Link>,
		},
		{
			title: t('Ref.'),
			dataIndex: 'reference',
		},
		{
			align: 'center',
			title: t('Passengers'),
			dataIndex: 'number_of_passenger',
		},
		{
			title: t('Booked Date'),
			dataIndex: 'created_at',
			render: (created_at) => moment(created_at).format(config.dateFormatReadable),
		},
		{
			align: 'right',
			title: t('Total Price'),
			dataIndex: 'grand_total',
		},
		{
			align: 'center',
			title: t('Payment'),
			dataIndex: 'payment',
			render: (payment) => <Progress style={{ width: 100 }} percent={payment} />,
		},
		{
			title: t('Depature Date'),
			dataIndex: 'departure_date',
			render: (departure_date) => moment(departure_date).format(config.dateFormatReadable),
		},
	];

	return (
		<div style={{ display: 'flex', height: '100%', flexDirection: 'column', gap: '1rem' }}>
			<Row align='middle' justify='space-between'>
				<Col span={12}>
					<Typography.Title level={4} type='primary' className='margin-0'>
						{t('Bookings')}
					</Typography.Title>
				</Col>
				<Col>
					<Link className='ant-btn ant-btn-primary ant-btn-lg' to='create'>
						{t('Create booking')}
					</Link>
				</Col>
			</Row>

			<FilterBookings />

			<div
				style={{
					maxWidth: '100%',
					minHeight: '1px',
				}}
			>
				<Table
					dataSource={data?.results || []}
					columns={columns}
					rowKey='id'
					pagination={{
						pageSize: config.itemsPerPage,
						current: currentPage,
						total: 0,
						onChange: handlePageChange,
					}}
					scroll={{ x: 1200, y: '100%' }}
					loading={isLoading}
				/>
			</div>
		</div>
	);
};
