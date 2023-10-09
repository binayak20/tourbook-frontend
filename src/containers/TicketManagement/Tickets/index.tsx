import { Button } from '@/components/atoms';
import { DataTableWrapper } from '@/components/atoms/DataTable/DataTableWrapper';
import config from '@/config';
import { Ticket } from '@/libs/api/@types';
import { ticketsAPI } from '@/libs/api/ticketsAPI';
import { PRIVATE_ROUTES } from '@/routes/paths';
import { getPaginatedParams } from '@/utils/helpers';
import { EllipsisOutlined, UploadOutlined } from '@ant-design/icons';
import { Dropdown, MenuProps, Modal, Popconfirm, Space, Table, Upload, message } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { UploadRequestOption } from 'rc-upload/lib/interface';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAccessContext } from 'react-access-boundary';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { CreateTicket } from './CreateTicket';
import TicketExpand from './TicketExpand';
import { TicketFilters } from './TicketFilters';
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

	const { current, pageSize, ticket_type, ticket_supplier, pnr } = useMemo<{
		current: number;
		pageSize: number;
		pnr: string;
		ticket_type: string;
		ticket_supplier: string;
	}>(() => {
		return {
			current: parseInt(searchParams.get('page') || '1'),
			pageSize: parseInt(searchParams.get('limit') || config.itemsPerPage?.toString()),
			pnr: searchParams.get('pnr') || '',
			ticket_type: searchParams.get('ticket_type') || '',
			ticket_supplier: searchParams.get('ticket_supplier') || '',
		};
	}, [searchParams]);

	const { isLoading, data } = useQuery(
		['tickets', current, pageSize, ticket_type, ticket_supplier, pnr],
		() => ticketsAPI.list({ page: current, limit: pageSize, ticket_type, ticket_supplier, pnr })
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

	const { mutate: uploadTicketRequest } = useMutation((data: FormData) => ticketsAPI.upload(data), {
		onSuccess: () => {
			queryClient.invalidateQueries(['tickets']);
			message.success(t('File has been uploaded!'));
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
				disabled: !isAllowedTo('CHANGE_TICKET'),
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
				disabled: !isAllowedTo('DELETE_TICKET'),
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
			dataIndex: 'ticket_outbound_date',
			render: (value, record) => (
				<span
					style={{
						opacity: '0.75',
					}}
				>{`${value} to ${record?.ticket_inbound_date}`}</span>
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
		if (!id || !data?.results.find((ticket) => ticket.id === parseInt(id?.split('/')?.[0]))) {
			setOpenCreateModal(false);
			setOpenReminderModal(false);

			return;
		}
		if (id?.split('/')[1] === 'reminder') {
			setOpenReminderModal(true);
			return;
		}
		setOpenCreateModal(true);
	}, [id, data?.results]);

	const uploadTickets = useCallback(
		({ file }: UploadRequestOption<any>) => {
			if (
				(file as File).type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
			) {
				message.error(t('File type must be xlsx!'));
				return;
			}
			const formData = new FormData();
			formData.append('file_name', (file as File).name);
			formData.append('excel_file', file);
			uploadTicketRequest(formData);
		},
		[uploadTicketRequest, t]
	);

	return (
		<>
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
			<Modal open={openReminderModal} footer={false} onCancel={handleOnCancel} width={700}>
				<TicketReminder selected={selectedTicket} closeModal={handleOnCancel} />
			</Modal>
			<DataTableWrapper
				title={t('Tickets')}
				filterBar={<TicketFilters />}
				createButton={
					<Space>
						<Upload customRequest={uploadTickets} showUploadList={false}>
							<Button size='large' type='primary' ghost icon={<UploadOutlined />}>
								{t('Upload ticket')}
							</Button>
						</Upload>
						<Button
							size='large'
							type='primary'
							onClick={() => setOpenCreateModal(true)}
							disabled={!isAllowedTo('ADD_TICKET')}
						>
							{t('Create ticket')}
						</Button>
					</Space>
				}
			>
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
					scroll={{ y: '100%' }}
				/>
			</DataTableWrapper>
		</>
	);
};
