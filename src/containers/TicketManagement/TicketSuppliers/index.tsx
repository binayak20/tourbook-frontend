import { Button, Typography } from '@/components/atoms';
import { StatusColumn } from '@/components/StatusColumn';
import config from '@/config';
import { ticketSupplierAPI } from '@/libs/api/ticketSupplierAPI';
import { PRIVATE_ROUTES } from '@/routes/paths';
import { getPaginatedParams } from '@/utils/helpers';
import { DownOutlined } from '@ant-design/icons';
import { Col, Dropdown, MenuProps, Modal, Row, Space, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { MenuInfo } from 'rc-menu/lib/interface';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAccessContext } from 'react-access-boundary';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from 'react-query';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { CreateTicketSupplier } from './CreateTicketSupplier';

export const TicketSuppliers = () => {
	const id = useParams()['*'];
	const { t } = useTranslation();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [searchParams] = useSearchParams();
	const { isAllowedTo } = useAccessContext();
	const [openCreateModal, setOpenCreateModal] = useState(false);
	const currentStatus = useMemo(() => searchParams.get('status') || 'active', [searchParams]);

	const { current, pageSize, is_active } = useMemo(() => {
		return {
			current: parseInt(searchParams.get('page') || '1'),
			pageSize: parseInt(searchParams.get('limit') || config.itemsPerPage?.toString()),
			is_active:
				currentStatus === 'active'
					? ('true' as unknown as boolean)
					: currentStatus === 'inactive'
					? ('false' as unknown as boolean)
					: undefined,
		};
	}, [searchParams, currentStatus]);

	const { isLoading, data } = useQuery(['ticket-suppliers', current, pageSize, is_active], () =>
		ticketSupplierAPI.list({ page: current, limit: pageSize, is_active })
	);
	const handlePageChange = useCallback(
		(page: number, size: number) => {
			const params = getPaginatedParams(searchParams, page, size);
			navigate({ search: params.toString() });
		},
		[navigate, searchParams]
	);

	const selectedSupplier = useMemo(() => {
		if (id && data?.results) {
			return data.results.find((supplier) => supplier.id === parseInt(id));
		}
		return;
	}, [data, id]);

	const handleOnClick = useCallback(
		(id: number) => {
			navigate({
				pathname: `${id}`,
				search: searchParams.toString(),
			});
		},
		[navigate, searchParams]
	);

	const handleOnCancel = useCallback(() => {
		setOpenCreateModal(false);
		navigate({
			pathname: `/dashboard/${PRIVATE_ROUTES.TICKET_MANAGEMENT}/${PRIVATE_ROUTES.TICKET_SUPPLIERS}`,
			search: searchParams.toString(),
		});
	}, [navigate, searchParams]);

	const columns: ColumnsType<API.TicketSupplier> = [
		{
			title: t('Name'),
			dataIndex: 'name',
			render: (name, record) =>
				isAllowedTo('CHANGE_SUPPLEMENT') ? (
					<Button
						size='large'
						type='link'
						style={{ padding: 0, height: 'auto' }}
						onClick={() => handleOnClick(record?.id)}
					>
						{name}
					</Button>
				) : (
					name
				),
		},
		{
			width: 120,
			title: t('Status'),
			dataIndex: 'is_active',
			render: (_, record) => {
				return (
					<StatusColumn
						status={record?.is_active}
						id={record.id}
						endpoint={PRIVATE_ROUTES.TICKET_SUPPLIERS}
						isDisabled={!isAllowedTo('CHANGE_TICKETSUPPLIER')}
						onSuccessFn={() => queryClient.invalidateQueries('ticket-suppliers')}
					/>
				);
			},
		},
	];

	const handleStatusNavigation = useCallback(
		({ key }: MenuInfo) => {
			const params = new URLSearchParams();

			if (key === 'active') {
				params.delete('status');
			} else if (key === 'inactive') {
				params.set('status', 'inactive');
			} else {
				params.set('status', 'all');
			}

			navigate({ search: params.toString() });
		},
		[navigate]
	);

	const menuItems: MenuProps = useMemo(() => {
		return {
			items: [
				{ key: 'active', label: t('Active Ticket Suppliers') },
				{ key: 'inactive', label: t('Inactive Ticket Suppliers') },
				{ key: 'all', label: t('All Ticket Suppliers') },
			],
			selectedKeys: [currentStatus],
			onClick: handleStatusNavigation,
		};
	}, [currentStatus, handleStatusNavigation, t]);

	useEffect(() => {
		if (id) setOpenCreateModal(true);
	}, [id]);

	return (
		<div style={{ display: 'flex', height: '100%', flexDirection: 'column', gap: '1rem' }}>
			<Row align='middle' justify='space-between'>
				<Col span={12}>
					<Dropdown menu={menuItems}>
						<a onClick={(e) => e.preventDefault()}>
							<Space>
								<Typography.Title level={4} type='primary' className='margin-0'>
									{
										(
											menuItems?.items?.find((item) => item?.key === currentStatus) as {
												label: string;
											}
										)?.label
									}{' '}
									({data?.count || 0})
								</Typography.Title>
								<DownOutlined />
							</Space>
						</a>
					</Dropdown>
				</Col>
				<Col>
					<Button
						size='large'
						type='primary'
						onClick={() => setOpenCreateModal(true)}
						disabled={!isAllowedTo('ADD_TICKETSUPPLIER')}
					>
						{t('Create supplier')}
					</Button>
					<Modal
						open={openCreateModal}
						onCancel={handleOnCancel}
						footer={false}
						maskClosable={false}
						title={selectedSupplier ? t('Edit supplier') : t('Create supplier')}
						destroyOnClose
					>
						<CreateTicketSupplier selected={selectedSupplier} closeModal={handleOnCancel} />
					</Modal>
				</Col>
			</Row>
			<Row>
				<Col span={24}>
					<Table
						rowKey='id'
						loading={isLoading}
						columns={columns}
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
		</div>
	);
};
