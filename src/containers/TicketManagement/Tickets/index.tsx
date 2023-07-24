import { Button, Typography } from '@/components/atoms';
import config from '@/config';
import { Ticket } from '@/libs/api/@types';
import { ticketsAPI } from '@/libs/api/ticketsAPI';
import { PRIVATE_ROUTES } from '@/routes/paths';
import { getPaginatedParams } from '@/utils/helpers';
import { EllipsisOutlined } from '@ant-design/icons';
import { Col, Dropdown, MenuProps, Modal, Popconfirm, Row, Table, message } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAccessContext } from 'react-access-boundary';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { CreateTicket } from './CreateTicket';
import TicketExpand from './TicketExpand';
import TicketReminder from './TicketReminder';

export const Tickets = () => {
	const id = useParams()['*'];
	const { t } = useTranslation();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [searchParams] = useSearchParams();
	const { isAllowedTo } = useAccessContext();
	const [openCreateModal, setOpenCreateModal] = useState(false);
	const [openReminderModal, setOpenReminderModal] = useState(false);

	const { current, pageSize } = useMemo<{ current: number; pageSize: number }>(() => {
		return {
			current: parseInt(searchParams.get('page') || '1'),
			pageSize: parseInt(searchParams.get('limit') || config.itemsPerPage?.toString()),
		};
	}, [searchParams]);

	const { isLoading, data } = useQuery(['tickets', current, pageSize], () =>
		ticketsAPI.list({ page: current, limit: pageSize })
	);

	const { mutate: deleteTicket } = useMutation((id: number) => ticketsAPI.delete(id), {
		onSuccess: () => {
			queryClient.invalidateQueries(['tickets']);
			message.success(t('Ticket has been removed!'));
		},
		onError: (error: Error) => {
			message.error(error.message);
		},
	});

	const handlePageChange = useCallback(
		(page: number, size: number) => {
			const params = getPaginatedParams(searchParams, page, size);
			navigate({ search: params.toString() });
		},
		[navigate, searchParams]
	);

	const selectedTicket = useMemo(() => {
		if (id && data?.results) {
			return data.results.find((ticket) => ticket.id === parseInt(id?.split('/')?.[0]));
		}
		return;
	}, [data, id]);

	const handleOnEdit = useCallback(
		(id: number) => {
			navigate({
				pathname: `${id}`,
				search: searchParams.toString(),
			});
		},
		[navigate, searchParams]
	);
	const handleOnReminder = useCallback(
		(id: number) => {
			navigate({
				pathname: `${id}/reminder`,
				search: searchParams.toString(),
			});
		},
		[navigate, searchParams]
	);

	const handleOnCancel = useCallback(() => {
		setOpenCreateModal(false);
		setOpenReminderModal(false);
		navigate({
			pathname: `/dashboard/${PRIVATE_ROUTES.TICKET_MANAGEMENT}/${PRIVATE_ROUTES.TICKETS}`,
			search: searchParams.toString(),
		});
	}, [navigate, searchParams]);

	const items: (id: number) => MenuProps['items'] = (id) => {
		return [
			{
				key: '1',
				label: t('Edit'),
				onClick: () => handleOnEdit(id),
			},
			{
				key: '2',
				label: t('Reminder'),
				onClick: () => handleOnReminder(id),
			},
			{
				key: '3',
				label: (
					<Popconfirm
						title={t('Are you sure to delete this ticket?')}
						onConfirm={() => deleteTicket(id)}
						okText={t('Yes')}
						cancelText={t('No')}
					>
						{t('Delete')}{' '}
					</Popconfirm>
				),
				danger: true,
			},
		];
	};

	const columns: ColumnsType<Ticket> = [
		{
			title: t('PNR'),
			dataIndex: 'pnr',
		},
		{
			title: t('Date Range'),
			dataIndex: 'start_date',
			render: (value, record) => (
				<span
					style={{
						opacity: '0.75',
					}}
				>{`${value} to ${record?.end_date}`}</span>
			),
		},
		{
			title: t('Departure'),
			dataIndex: 'departure_station',
			render: (value) => value?.name,
		},
		{
			title: t('Destination'),
			dataIndex: 'destination_station',
			render: (value) => value?.name,
		},
		{
			title: t('Ticket Supplier'),
			dataIndex: 'ticket_supplier',
			render: (value) => value?.name,
		},
		{
			title: t('Available/Total Ticket'),
			dataIndex: 'available_tickets',
			render: (value, record) => `${value}/${record?.number_of_tickets}`,
		},
		{
			width: 120,
			title: t('Action'),
			dataIndex: 'id',
			render: (value) => (
				<Dropdown menu={{ items: items(value) }} trigger={['click']}>
					<Button icon={<EllipsisOutlined />} />
				</Dropdown>
			),
		},
	];

	useEffect(() => {
		if (!id) return;
		if (!data?.results.find((ticket) => ticket.id === parseInt(id?.split('/')?.[0]))) return;
		if (id?.split('/')[1] === 'reminder') {
			setOpenReminderModal(true);
			return;
		}
		setOpenCreateModal(true);
	}, [id, data?.results]);

	return (
		<div style={{ display: 'flex', height: '100%', flexDirection: 'column', gap: '1rem' }}>
			<Row align='middle' justify='space-between'>
				<Col span={12}>
					<Typography.Title level={4} type='primary' className='margin-0'>
						{t('Tickets')} ({data?.count || 0})
					</Typography.Title>
				</Col>
				<Col>
					<Button
						size='large'
						type='primary'
						onClick={() => setOpenCreateModal(true)}
						disabled={!isAllowedTo('ADD_TICKET')}
					>
						{t('Create ticket')}
					</Button>
					<Modal
						open={openCreateModal}
						onCancel={handleOnCancel}
						footer={false}
						width={900}
						title={selectedTicket ? t('Edit ticket') : t('Create ticket')}
						destroyOnClose
					>
						<CreateTicket selected={selectedTicket} closeModal={handleOnCancel} />
					</Modal>
				</Col>
			</Row>
			<Row>
				<Col span={24}>
					<Table
						rowKey='id'
						loading={isLoading}
						columns={columns}
						expandable={{
							expandedRowRender: (data) => <TicketExpand data={data} />,
						}}
						dataSource={data?.results || []}
						pagination={{
							locale: { items_per_page: `/\t${t('page')}` },
							pageSize: pageSize,
							current: current,
							total: data?.count || 0,
							onChange: handlePageChange,
							showSizeChanger: true,
						}}
					/>
				</Col>
			</Row>
			<Modal open={openReminderModal} footer={false} onCancel={handleOnCancel} width={700}>
				<TicketReminder selected={selectedTicket} closeModal={handleOnCancel} />
			</Modal>
		</div>
	);
};
