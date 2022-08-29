import { Typography } from '@/components/atoms';
import config from '@/config';
import { toursAPI } from '@/libs/api';
import { Col, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { StatusColumn } from '../Tours/StatusColumn';

export const Bookings = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();

	const currentPage = useMemo(() => parseInt(searchParams.get('page') || '1'), [searchParams]);

	const { data, isLoading } = useQuery(['tours', currentPage], () => toursAPI.list(currentPage));

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
			render: (name, { id }) => <Link to={`edit/${id}`}>{name}</Link>,
		},
		{
			align: 'center',
			title: t('Date Range'),
			dataIndex: 'departure_date',
			render: (departure_date, { return_date }) => `${departure_date} - ${return_date}`,
		},
		{
			width: 260,
			align: 'center',
			title: t('Booked/Capacity/(Reserved)'),
			dataIndex: 'number_of_bookings',
			render: (booked, { capacity, is_reserved }) =>
				`${booked}/${capacity}${is_reserved ? '/(Yes)' : ''}`,
		},
		{
			align: 'center',
			title: t('Action'),
			dataIndex: 'action',
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
					<Link className='ant-btn ant-btn-primary ant-btn-lg' to='create'>
						{t('Create tour')}
					</Link>
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
					scroll={{ y: '100%' }}
					loading={isLoading}
				/>
			</div>
		</div>
	);
};
