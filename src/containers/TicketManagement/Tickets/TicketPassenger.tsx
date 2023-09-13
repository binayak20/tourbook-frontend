import { Button, Typography } from '@/components/atoms';
import config from '@/config';
import { AssignedPassenger } from '@/libs/api/@types';
import { ticketsAPI } from '@/libs/api/ticketsAPI';
import { getPaginatedParams } from '@/utils/helpers';
import { Col, Empty, Row, Table, message } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

export function TicketPassengers() {
	const { id } = useParams();
	const navigate = useNavigate();
	const { t } = useTranslation();
	const [searchParams] = useSearchParams();

	const { current, pageSize } = useMemo<{
		current: number;
		pageSize: number;
	}>(() => {
		return {
			current: parseInt(searchParams.get('page') || '1'),
			pageSize: parseInt(searchParams.get('limit') || config.itemsPerPage?.toString()),
		};
	}, [searchParams]);

	const { data, isLoading } = useQuery(['assigned-passengers', current, pageSize, id], () =>
		ticketsAPI.assignedPassenger(id, { page: current, limit: pageSize })
	);

	const handlePageChange = useCallback(
		(page: number, size: number) => {
			const params = getPaginatedParams(searchParams, page, size);
			navigate({ search: params.toString() });
		},
		[navigate, searchParams]
	);

	const { mutate: handleDownloadPassenger, isLoading: isLoadingPassengerDownload } = useMutation(
		(id: number | string | undefined) => ticketsAPI.assignedPassengerDownload(id),
		{
			onSuccess: (data: Blob) => {
				const filename = `assigned-passenger-info(${id}).xlsx`;
				const link = document.createElement('a');
				link.href = window.URL.createObjectURL(data);
				link.download = filename;
				document.body.append(link);
				link.click();
				link.remove();
			},
			onError: (error: Error) => {
				message.error(error.message);
			},
		}
	);

	const handlePassengerListDownload = () => {
		handleDownloadPassenger(id);
	};
	const columns: ColumnsType<AssignedPassenger> = [
		{
			title: t('Name'),
			dataIndex: 'first_name',
			render: (_, record) => (
				<span>{`${record?.passenger?.first_name} ${record?.passenger?.last_name}`}</span>
			),
		},

		{
			title: t('Telephone number'),
			dataIndex: 'telephone_number',
			render: (_, record) => record?.passenger?.telephone_number,
		},
		{
			title: t('Email'),
			dataIndex: 'email',
			render: (_, record) => record?.passenger?.email,
		},
		{
			title: t('Booking Ref.'),
			dataIndex: 'booking_reference',
			render: (_, record) => record?.booking_ticket?.booking_reference,
		},

		{
			width: 120,
			title: t('PNR No'),
			dataIndex: 'pnr',
			render: (_, record) => record?.booking_ticket?.ticket?.pnr,
		},
	];

	return (
		<div style={{ display: 'flex', height: '100%', flexDirection: 'column', gap: '1rem' }}>
			<Row align='middle' justify='space-between'>
				<Col>
					<Typography.Title level={4} type='primary' className='margin-0'>
						{t('Assigned passengers list')}
					</Typography.Title>
				</Col>
				<Col>
					<Button
						type='primary'
						size='large'
						onClick={handlePassengerListDownload}
						loading={isLoadingPassengerDownload}
					>
						{t('Download')}
					</Button>
				</Col>
			</Row>
			<Row>
				<Col span={24}>
					<Table
						locale={{
							emptyText: (
								<Empty
									image={Empty.PRESENTED_IMAGE_SIMPLE}
									description={<span>{t('No results found')}</span>}
								/>
							),
						}}
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
}
