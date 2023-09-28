import { Button } from '@/components/atoms';
import config from '@/config';
import { logsAPI } from '@/libs/api';
import { getPaginatedParams } from '@/utils/helpers';
import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SearchComponent, { Field } from '../../../components/SearchComponent';
import DynamicDataModal from './DynamicDataModal';
import { SheduledEmailHeader } from './ScheduleEmailHeader';

export const ScheduleEmails = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [visible, setVisible] = useState<boolean>(false);
	const [currentData, setCurrentData] = useState<API.DynamicData | null>(null);
	const [searchParams] = useSearchParams();
	const { current, pageSize, to_email, event } = useMemo(() => {
		return {
			to_email: searchParams.get('to_email') || '',
			event: searchParams.get('event') || '',
			current: parseInt(searchParams.get('page') || '1'),
			pageSize: parseInt(searchParams.get('limit') || `${config.itemsPerPage}`),
		};
	}, [searchParams]);

	const sheduledEmailListParams = useMemo(() => {
		return {
			page: current,
			limit: pageSize,
			to_email,
			event,
		};
	}, [current, pageSize, to_email, event]);

	const handlePageChange = useCallback(
		(page: number, size: number) => {
			const params = getPaginatedParams(searchParams, page, size);
			navigate({ search: params.toString() });
		},
		[navigate, searchParams]
	);

	const { data, isLoading } = useQuery(['scheduled-email', sheduledEmailListParams], () =>
		logsAPI.sheduledEmailList(sheduledEmailListParams)
	);

	const columns: ColumnsType<API.ScheduledEmail> = [
		{
			width: 200,
			ellipsis: true,
			title: t('To email'),
			dataIndex: 'to_email',
		},
		{
			title: t('Event'),
			dataIndex: 'event',
		},
		{
			title: t('Send on'),
			dataIndex: 'send_on',
			render: (send_on) => (send_on ? moment(send_on).format(config.dateTimeFormatReadable) : '-'),
		},
		{
			title: t('To cc'),
			dataIndex: 'to_cc',
			render: (to_cc) => to_cc || '-',
		},
		{
			title: t('To bcc'),
			dataIndex: 'to_bcc',
			render: (to_bcc) => to_bcc || '-',
		},
		{
			title: t('Dynamic data'),
			dataIndex: 'dynamic_data',
			render: (dynamic_data) => {
				return dynamic_data ? (
					<Button
						type='primary'
						onClick={() => {
							setCurrentData(dynamic_data);
							setVisible(true);
						}}
					>
						{t('View data')}
					</Button>
				) : (
					'-'
				);
			},
		},

		{
			title: t('Is email sent'),
			dataIndex: 'is_email_sent',
			render: (is_email_sent) => (is_email_sent ? t('True') : t('False')),
		},
		{
			title: t('Send at'),
			dataIndex: 'send_at',
			render: (send_at) => (send_at ? moment(send_at).format(config.dateTimeFormatReadable) : '-'),
		},
	];
	const searchFields: Field[] = [
		{ type: 'input', name: 'to_email', placeholder: t('Search by email') },
		{ type: 'input', name: 'event', placeholder: t('Search by event') },
	];
	return (
		<div style={{ display: 'flex', height: '100%', flexDirection: 'column', gap: '1rem' }}>
			<SheduledEmailHeader count={data?.count} />

			<DynamicDataModal visiblity={visible} setVisiblity={setVisible} dynamicData={currentData} />
			<SearchComponent fields={searchFields} />
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
						pageSize: pageSize,
						current: current,
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
