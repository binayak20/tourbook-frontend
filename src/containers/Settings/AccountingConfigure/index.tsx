import { Typography } from '@/components/atoms';
import config from '@/config';
import { accountingAPI } from '@/libs/api';
import { Button, Col, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import classNames from 'classnames';
import { useCallback, useMemo, useState } from 'react';
import { useAccessContext } from 'react-access-boundary';
import { useTranslation } from 'react-i18next';
import { useQueries } from 'react-query';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AccountingConfigureModal } from './AccountingConfigureModal';
import { StatusColumn } from './StatusColumn';

export const SettingsAccountingConfigure = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const [isCreateModal, setCreateModal] = useState(false);
	const [isUpdateModal, setUpdateModal] = useState<API.AccountingConfig>();
	const currentPage = useMemo(() => parseInt(searchParams.get('page') || '1'), [searchParams]);
	const { isAllowedTo } = useAccessContext();

	const [{ data, isLoading }, { data: accountingProviders }] = useQueries([
		{
			queryKey: ['accounting-configs', currentPage],
			queryFn: () => accountingAPI.list({ page: currentPage }),
		},
		{
			queryKey: ['accounting-unconfigured-providers', currentPage],
			queryFn: () => accountingAPI.unconfiguredProviders(),
		},
	]);

	const handlePageChange = useCallback(
		(page: number) => {
			navigate(page > 1 ? `?page=${page}` : '');
		},
		[navigate]
	);

	// const handleCreate = useCallback(() => {
	// 	if (!accountingProviders?.length) {
	// 		message.error(t('No accounting providers available!'));
	// 		return;
	// 	}

	// 	setCreateModal(true);
	// 	setUpdateModal(undefined);
	// }, [accountingProviders?.length, t]);

	const columns: ColumnsType<API.AccountingConfig> = [
		{
			title: t('Name'),
			dataIndex: 'name',
			width: 450,
			ellipsis: true,
			render: (_, record) =>
				isAllowedTo('CHANGE_ACCOUNTINGSERVICEPROVIDERCONFIGURATION') ? (
					<Button
						size='large'
						type='link'
						onClick={() => {
							setUpdateModal(record);
							setCreateModal(false);
						}}
					>
						{record.accounting_service_provider.name}
					</Button>
				) : (
					record.accounting_service_provider.name
				),
		},
		{ title: t('Base URL'), dataIndex: 'base_url' },
		{
			title: '',
			dataIndex: 'action',
			render: (_, record) => (
				<Link
					to={`edit/${record.id}`}
					className={classNames('ant-btn ant-btn-link ant-btn-lg', {
						'ant-btn-disabled': !isAllowedTo('CHANGE_FORTNOXCOSTCENTER'),
					})}
				>
					{t('Scenarios')}
				</Link>
			),
		},
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
							{t('Accounting configure')} ({data?.count || 0})
						</Typography.Title>
					</Col>
					<Col span={12} style={{ textAlign: 'right' }}>
						{/* {isAllowedTo('ADD_ACCOUNTINGSERVICEPROVIDERCONFIGURATION') && (
							<Button className='ant-btn ant-btn-primary ant-btn-lg' onClick={handleCreate}>
								{t('Configure new provider')}
							</Button>
						)} */}
						<AccountingConfigureModal
							data={isUpdateModal}
							providers={accountingProviders}
							isModalVisible={isCreateModal || !!isUpdateModal}
							onClose={() => {
								setCreateModal(false);
								setUpdateModal(undefined);
							}}
						/>
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
