import { Typography } from '@/components/atoms';
import config from '@/config';
import { accountingAPI } from '@/libs/api';
import { Button, Col, message, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { StatusColumn } from './StatusColumn';

export const SettingsAccountingConfigure = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const currentPage = useMemo(() => parseInt(searchParams.get('page') || '1'), [searchParams]);

	const { data, isLoading } = useQuery(['accounting-configs', currentPage], () =>
		accountingAPI.list({ page: currentPage })
	);

	const handlePageChange = useCallback(
		(page: number) => {
			navigate(page > 1 ? `?page=${page}` : '');
		},
		[navigate]
	);

	const handleCreate = useCallback(
		(url: string) => {
			if (!data?.results?.length) {
				message.error(t('No accounting providers available!'));
				return;
			}

			navigate(url);
		},
		[data?.results?.length, navigate, t]
	);

	const columns: ColumnsType<API.AccountingConfig> = [
		{
			title: t('Name'),
			dataIndex: 'name',
			width: 450,
			ellipsis: true,
			render: (_text, record) => {
				return <Link to={`edit/${record.id}`}>{record.accounting_service_provider.name}</Link>;
			},
		},
		{ title: t('Base URL'), dataIndex: 'base_url' },
		{
			width: 120,
			title: t('Status'),
			dataIndex: 'is_active',
			render: (is_active, record) => (
				<StatusColumn ID={record.id} status={is_active ? 'Active' : 'Inactive'} />
			),
		},
	];

	return (
		<Row>
			<Col span={24} className='margin-4-bottom'>
				<Row align='middle'>
					<Col span={12}>
						<Typography.Title level={4} type='primary' noMargin>
							{t('Accounting configure')}
						</Typography.Title>
					</Col>
					<Col span={12} style={{ textAlign: 'right' }}>
						<Button
							className='ant-btn ant-btn-primary ant-btn-lg'
							onClick={() => handleCreate('create')}
						>
							{t('Configure new provider')}
						</Button>
					</Col>
				</Row>
			</Col>

			<Col span={24}>
				<Table
					rowKey='id'
					loading={isLoading}
					columns={columns}
					dataSource={data?.results || []}
					pagination={{
						pageSize: config.itemsPerPage,
						current: currentPage,
						total: data?.count || 0,
						onChange: handlePageChange,
					}}
				/>
			</Col>
		</Row>
	);
};
