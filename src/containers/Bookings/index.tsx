import config from '@/config';
import { bookingsAPI } from '@/libs/api';
import { getPaginatedParams } from '@/utils/helpers';
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import { Empty, Progress, Table } from 'antd';
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
	const { isAllowedTo } = useAccessContext();

	const { current, pageSize } = useMemo(() => {
		return {
			current: parseInt(searchParams.get('page') || '1'),
			pageSize: parseInt(searchParams.get('limit') || `${config.itemsPerPage}`),
		};
	}, [searchParams]);

	const bookingsParams: API.BookingParams = useMemo(() => {
		const departed =
			searchParams.get('status') === 'all'
				? undefined
				: searchParams.get('is_departed') === 'departed'
				? 'true'
				: 'false';
		const status =
			searchParams.get('status') === 'all' ? undefined : searchParams.get('status') || 'booked';
		return {
			page: current,
			limit: pageSize,
			booking_name: searchParams.get('booking_name') || '',
			reference: searchParams.get('reference') || '',
			departure_date: searchParams.get('departure_date') || '',
			booking_status: status,
			is_departed: departed,
			from_departure_date: searchParams.get('from_departure_date') || '',
			to_departure_date: searchParams.get('to_departure_date') || '',
			from_booking_date: searchParams.get('from_booking_date') || '',
			to_booking_date: searchParams.get('to_booking_date') || '',
		};
	}, [current, pageSize, searchParams]);

	const { data, isLoading } = useQuery(['bookings', bookingsParams], () =>
		bookingsAPI.list(bookingsParams)
	);

	const handlePageChange = useCallback(
		(page: number, size: number) => {
			const params = getPaginatedParams(searchParams, page, size);
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
			title: t('Booking number'),
			dataIndex: 'reference',
		},
		{
			align: 'center',
			title: t('Passengers'),
			dataIndex: 'number_of_passenger',
		},
		{
			align: 'center',
			title: t('Ticketless Passengers'),
			dataIndex: 'ticketless_passengers',
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
		{
			align: 'center',
			title: t('Flight ticket uploaded'),
			dataIndex: 'is_ticket_uploaded',
			render: (is_ticket_uploaded) =>
				is_ticket_uploaded ? (
					<CheckCircleFilled style={{ color: '#52c41a' }} />
				) : (
					<CloseCircleFilled style={{ color: '#eb2f2f' }} />
				),
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
					locale={{
						emptyText: (
							<Empty
								image={Empty.PRESENTED_IMAGE_SIMPLE}
								description={<span>{t('No results found')}</span>}
							/>
						),
					}}
					dataSource={data?.results || []}
					columns={columns}
					rowKey='id'
					pagination={{
						locale: { items_per_page: `/\t${t('page')}` },
						pageSize,
						current,
						total: data?.count || 0,
						onChange: handlePageChange,
						showSizeChanger: true,
					}}
					scroll={{ x: 1200, y: '100%' }}
					loading={isLoading}
				/>
			</div>
		</div>
	);
};
