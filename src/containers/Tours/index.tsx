import { Typography } from '@/components/atoms';
import config from '@/config';
import { toursAPI } from '@/libs/api';
import { PRIVATE_ROUTES } from '@/routes/paths';
import { PlusOutlined } from '@ant-design/icons';
import { Col, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import classNames from 'classnames';
import moment from 'moment';
import { useCallback, useMemo } from 'react';
import { useAccessContext } from 'react-access-boundary';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { StatusColumn } from './StatusColumn';

export const Tours = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const currentPage = useMemo(() => parseInt(searchParams.get('page') || '1'), [searchParams]);
	const { isAllowedTo } = useAccessContext();

	const { data, isLoading } = useQuery(['tours', currentPage], () =>
		toursAPI.list({ page: currentPage })
	);

	const handlePageChange = useCallback(
		(page: number) => {
			navigate(page > 1 ? `?page=${page}` : '');
		},
		[navigate]
	);

	const columns: ColumnsType<API.Tour> = [
		{
			width: 200,
			ellipsis: true,
			title: t('Name'),
			dataIndex: 'name',
			render: (name, { id }) =>
				isAllowedTo('CHANGE_TOUR') ? <Link to={`edit/${id}`}>{name}</Link> : name,
		},
		{
			width: 200,
			title: t('Date Range'),
			dataIndex: 'departure_date',
			render: (departure_date, { return_date }) => {
				const isSameYear = moment(departure_date).isSame(return_date, 'year');
				const isSameMonth = moment(departure_date).isSame(return_date, 'month');

				if (isSameYear && isSameMonth) {
					return `${moment(departure_date).format('MMM D')} - ${moment(return_date).format(
						'D, YYYY'
					)}`;
				}

				if (isSameYear) {
					return `${moment(departure_date).format('MMM D')} - ${moment(return_date).format(
						config.dateFormatReadable
					)}`;
				}

				return `${moment(departure_date).format(config.dateFormatReadable)} - ${moment(
					return_date
				).format(config.dateFormatReadable)}`;
			},
		},
		{
			width: 260,
			align: 'center',
			title: t('Booked/Capacity/(Reserved)'),
			dataIndex: 'number_of_booking_passenger',
			render: (number_of_booking_passenger, { capacity, reserved_capacity }) =>
				`${number_of_booking_passenger}/${capacity}/${reserved_capacity}`,
		},
		{
			align: 'center',
			title: t('Action'),
			dataIndex: 'action',
			render: (_, { id }) => (
				<Link
					to={`/dashboard/${PRIVATE_ROUTES.BOOKINGS_CREATE}`}
					state={{ tourID: id }}
					className={classNames([
						'ant-btn',
						isAllowedTo('ADD_BOOKING') ? 'ant-btn-dashed' : 'ant-btn-disabled',
					])}
				>
					<PlusOutlined /> {t('Add booking')}
				</Link>
			),
		},
		{
			width: 160,
			align: 'center',
			title: t('Status'),
			dataIndex: 'is_active',
			render: (is_active, { id }) => (
				<StatusColumn id={id} status={is_active ? 'Active' : 'Inactive'} />
			),
		},
	];

	return (
		<div style={{ display: 'flex', height: '100%', flexDirection: 'column', gap: '1rem' }}>
			<Row align='middle' justify='space-between'>
				<Col span={12}>
					<Typography.Title level={4} type='primary' className='margin-0'>
						{t('Tours')}
					</Typography.Title>
				</Col>
				<Col>
					{isAllowedTo('ADD_TOUR') && (
						<Link className='ant-btn ant-btn-primary ant-btn-lg' to='create'>
							{t('Create tour')}
						</Link>
					)}
				</Col>
			</Row>
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
						total: data?.count,
						onChange: handlePageChange,
					}}
					scroll={{ x: 1000, y: '100%' }}
					loading={isLoading}
				/>
			</div>
		</div>
	);
};
