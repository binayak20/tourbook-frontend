import config from '@/config';
import { logsAPI } from '@/libs/api';
import { Button, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LogsHeader } from './LogsHeader';
import EmailLogDetail from './LogsHeader/LogModal/EmailLogDetails';

export const EmailLogsList = () => {
	const { t } = useTranslation();
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const [currentId, setCurrentId] = useState<number | null>(null);
	const [visiblity, setVisiblity] = useState(false);

	const { currentPage, currentLimit, searchByToEmail, searchByEmailEvent } = useMemo(() => {
		return {
			currentPage: parseInt(searchParams.get('page') || '1'),
			currentLimit: parseInt(searchParams.get('limit') || '50'),
			searchByToEmail: searchParams.get('to_email') || '',
			searchByEmailEvent: searchParams.get('email_event') || '',
		};
	}, [searchParams]);

	const emailLogsParams = useMemo(() => {
		return {
			page: currentPage,
			limit: currentLimit,
			to_email: searchByToEmail,
			email_event: searchByEmailEvent,
		};
	}, [currentPage, currentLimit, searchByToEmail, searchByEmailEvent]);

	const { data, isLoading } = useQuery(['email-logs', emailLogsParams], () =>
		logsAPI.emailLogs(emailLogsParams)
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

	const columns: ColumnsType<API.EmailLog> = [
		{
			title: t('From email'),
			dataIndex: 'from_email',
			render: (from_email) => from_email || '-',
		},
		{
			title: t('To email'),
			dataIndex: 'to_email',
			render: (to_email) => to_email || '-',
		},
		{
			title: t('Email provider'),
			dataIndex: 'email_provider',
		},
		{
			title: t('Email event'),
			dataIndex: 'email_event',
			render: (email_event) => email_event || '-',
		},
		{
			title: t('Sent at'),
			dataIndex: 'created_at',
			render: (text = new Date()) => moment(text).format(config.dateTimeFormatReadable),
		},
		{
			title: t('Response'),
			dataIndex: 'response',
			render: (response) => response || '-',
		},
		{
			width: 150,
			title: t('Status'),
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
							{is_success ? t('Success') : t('Failed')}
						</Button>
					</>
				);
			},
		},
	];
	const logsDetailsModal = useMemo(() => {
		return (
			<EmailLogDetail visiblity={visiblity} setVisiblity={setVisiblity} emailLogId={currentId} />
		);
	}, [visiblity, setVisiblity, currentId]);

	return (
		<div style={{ display: 'flex', height: '100%', flexDirection: 'column', gap: '1rem' }}>
			{logsDetailsModal}
			<LogsHeader
				onSearchEventFilter={(e) => {
					handleSearchOrFilter('email_event', e);
				}}
			/>
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
					dataSource={data?.results || []}
					pagination={{
						locale: { items_per_page: `/\t${t('page')}` },
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
