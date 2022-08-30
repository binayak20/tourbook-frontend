import { Typography } from '@/components/atoms';
import config from '@/config';
import { Col, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FilterBookings } from './FilterBookings';

export const Bookings = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const currentPage = useMemo(() => parseInt(searchParams.get('page') || '1'), [searchParams]);

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
			title: t('Ref.'),
			dataIndex: 'ref',
		},
		{
			title: t('PAX'),
			dataIndex: 'pax',
		},
		{
			title: t('Assigned Tickets'),
			dataIndex: 'action',
		},
		{
			title: t('Booked Date'),
			dataIndex: 'action',
		},
		{
			title: t('Total Price'),
			dataIndex: 'action',
		},
		{
			title: t('Payment'),
			dataIndex: 'payment',
		},
		{
			title: t('Depature Date'),
			dataIndex: 'action',
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
					dataSource={[]}
					columns={columns}
					rowKey='id'
					pagination={{
						pageSize: config.itemsPerPage,
						current: currentPage,
						total: 0,
						onChange: handlePageChange,
					}}
					scroll={{ x: 1300, y: '100%' }}
					loading={false}
				/>
			</div>
		</div>
	);
};
