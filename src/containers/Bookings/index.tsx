import config from '@/config';
import { bookingsAPI } from '@/libs/api';
import { Progress, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import { useCallback, useMemo } from 'react';
import { useAccessContext } from 'react-access-boundary';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { BookingsHeader } from './BookingsHeader';

export const Bookings = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const currentPage = useMemo(() => parseInt(searchParams.get('page') || '1'), [searchParams]);
	const { isAllowedTo } = useAccessContext();

	const bookingsParams: API.BookingParams = useMemo(() => {
		const status =
			searchParams.get('status') === 'all' ? undefined : searchParams.get('status') || 'booked';

		return {
			page: currentPage,
			booking_name: searchParams.get('booking_name') || '',
			reference: searchParams.get('reference') || '',
			departure_date: searchParams.get('departure_date') || '',
			booking_status: status,
		};
	}, [currentPage, searchParams]);

	const { data, isLoading } = useQuery(['bookings', bookingsParams], () =>
		bookingsAPI.list(bookingsParams)
	);

	const handlePageChange = useCallback(
		(page: number) => {
			const params = new URLSearchParams(searchParams);
			if (page === 1) {
				params.delete('page');
			} else {
				params.set('page', page.toString());
			}
			navigate({ search: params.toString() });
		},
		[navigate, searchParams]
	);

	const columns: ColumnsType<API.Booking> = [
		{
			width: 200,
			ellipsis: true,
			title: t('Name'),
			dataIndex: 'booking_name',
			render: (booking_name, { id }) =>
				isAllowedTo('CHANGE_BOOKING') ? (
					<Link to={`edit/${id}`}>{booking_name}</Link>
				) : (
					booking_name
				),
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
			render: (created_at) => moment(created_at).format(config.dateTimeFormatReadable),
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
			render: (_payment, { paid_percentage }) => (
				<Progress style={{ width: 100 }} percent={paid_percentage} />
			),
		},
		{
			title: t('Depature Date'),
			dataIndex: 'departure_date',
			render: (departure_date) => moment(departure_date).format(config.dateFormatReadable),
		},
	];

	return (
		<div style={{ display: 'flex', height: '100%', flexDirection: 'column', gap: '1rem' }}>
			<BookingsHeader count={data?.count} />

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
						total: data?.count || 0,
						onChange: handlePageChange,
					}}
					scroll={{ x: 1200, y: '100%' }}
					loading={isLoading}
				/>
			</div>
		</div>
	);
};
