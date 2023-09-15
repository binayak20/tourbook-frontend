import { Typography } from '@/components/atoms';
import { logsAPI } from '@/libs/api';
import { Button, Col, Input, Row, Space, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import FrotnoxLogDetail from './FortnoxLogDetails';
import FortnoxLogExpand from './FortnoxLogExpand';

export const FortnoxLogs = () => {
	const { Search } = Input;
	const { t } = useTranslation();
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const [currentId, setCurrentId] = useState<number | null>(null);
	const [visiblity, setVisiblity] = useState(false);
	const { currentPage, currentLimit, booking_ref, voucher_no, fortnox_event } = useMemo(() => {
		return {
			currentPage: parseInt(searchParams.get('page') || '1'),
			currentLimit: parseInt(searchParams.get('limit') || '50'),
			booking_ref: searchParams.get('booking_reference') || '',
			voucher_no: searchParams.get('voucher_number') || '',
			fortnox_event: searchParams.get('fortnox_event') || '',
		};
	}, [searchParams]);

	const fortnoxLogsParams = useMemo(() => {
		return {
			page: currentPage,
			limit: currentLimit,
			booking_reference: booking_ref,
			voucher_number: voucher_no,
			fortnox_event: fortnox_event,
		};
	}, [currentPage, currentLimit, booking_ref, voucher_no, fortnox_event]);

	const { data, isLoading } = useQuery(['fortnox-logs', fortnoxLogsParams], () =>
		logsAPI.fortnoxLogs(fortnoxLogsParams)
	);

	const handleSearchOrFilter = (key: string, value: string) => {
		searchParams.delete('page');
		searchParams.delete('limit');
		if (value === undefined || value === '') {
			searchParams.delete(key);
		} else {
			searchParams.set(key, value);
		}
		navigate({ search: searchParams.toString() });
	};

	const handlePageChange = (page: number, pageSize: number) => {
		searchParams.set('page', page.toString());
		searchParams.set('limit', pageSize.toString());
		navigate({ search: searchParams.toString() });
	};

	const columns: ColumnsType<API.FortnoxLog> = [
		{
			title: t('Id'),
			dataIndex: 'id',
			render: (response_status_code) => response_status_code || '-',
		},
		{
			title: t('Booking reference'),
			dataIndex: 'booking_reference',
			render: (booking_reference) => booking_reference || '-',
		},
		{
			title: t('Order ID'),
			dataIndex: 'transaction',
			render: (transaction) => (transaction ? transaction[0]?.order_id : '-'),
		},
		{
			title: t('Fortnox event'),
			dataIndex: 'fortnox_event',
			render: (fortnox_event) => fortnox_event || '-',
		},
		{
			title: t('Voucher number'),
			dataIndex: 'voucher_number',
			render: (voucher_number) => voucher_number || '-',
		},
		{
			title: t('Http status code'),
			dataIndex: 'response_status_code',
			render: (response_status_code) => response_status_code || '-',
		},
		{
			title: t('Created at'),
			dataIndex: 'created_at',
			render: (text = new Date()) => moment(text).format('MMM DD, YYYY'),
		},
		{
			title: t('Sent at'),
			dataIndex: 'created_at',
			render: (text = new Date()) => moment(text).format('MMM DD, YYYY'),
		},
		{
			width: 150,
			title: t('Success status'),
			dataIndex: 'is_success',
			render: (is_success, record) => {
				return (
					<>
						<Button
							type='primary'
							danger={!is_success}
							onClick={() => {
								setCurrentId(record?.id);
								setVisiblity(true);
							}}
						>
							{is_success ? 'Success' : 'Failed'}
						</Button>
					</>
				);
			},
		},
	];
	return (
		<div style={{ display: 'flex', height: '100%', flexDirection: 'column', gap: '1rem' }}>
			<FrotnoxLogDetail
				visiblity={visiblity}
				setVisiblity={setVisiblity}
				fortnoxLogId={currentId}
			/>
			<Row align='middle' justify='space-between'>
				<Typography.Title level={4} type='primary' className='margin-0'>
					{t('Fortnox logs')}
				</Typography.Title>
			</Row>
			<Row style={{ marginBottom: '20px' }} gutter={16}>
				<Col span='auto'>
					<Space>
						<Search
							size='large'
							addonBefore={t('Booking reference')}
							placeholder={t('Search by booking reference')}
							allowClear
							onSearch={(e) => {
								handleSearchOrFilter('booking_reference', e);
							}}
						/>
					</Space>
				</Col>
				<Col span='auto'>
					<Space>
						<Search
							size='large'
							addonBefore={t('Voucher number')}
							placeholder={t('Search by voucher number')}
							allowClear
							onSearch={(e) => {
								handleSearchOrFilter('voucher_number', e);
							}}
						/>
					</Space>
				</Col>
				<Col span='auto'>
					<Space>
						<Search
							size='large'
							addonBefore={t('Fortnox event')}
							placeholder={t('Search by fortnox event')}
							allowClear
							onSearch={(e) => {
								handleSearchOrFilter('fortnox_event', e);
							}}
						/>
					</Space>
				</Col>
			</Row>
			<div
				style={{
					maxWidth: '100%',
					minHeight: '1px',
				}}
			>
				<Table
					scroll={{ x: 1300, y: 500 }}
					rowKey='id'
					loading={isLoading}
					columns={columns}
					tableLayout='fixed'
					expandable={{
						expandedRowRender: (record) => <FortnoxLogExpand log={record} />,
					}}
					dataSource={data?.results || []}
					pagination={{
						pageSize: currentLimit,
						current: currentPage,
						total: data?.count || 0,
						onChange: handlePageChange,
						pageSizeOptions: [10, 20, 50, 100],
					}}
				/>
			</div>
		</div>
	);
};
