import { Typography } from '@/components/atoms';
import config from '@/config';
import { accountingAPI } from '@/libs/api';
import { useStoreSelector } from '@/store';
import { getPaginatedParams } from '@/utils/helpers';
import { Button, Col, message, Row, Space, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import classNames from 'classnames';
import { useCallback, useMemo, useState } from 'react';
import { useAccessContext } from 'react-access-boundary';
import { useTranslation } from 'react-i18next';
import { useQueries } from 'react-query';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AccountingConfigureModal } from './AccountingConfigureModal';
import { useConfigureFortnox } from './hooks/useConfigureFortnox';
import { StatusColumn } from './StatusColumn';

export const SettingsAccountingConfigure = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const [isCreateModal, setCreateModal] = useState(false);
	const [isUpdateModal, setUpdateModal] = useState<API.AccountingConfig>();
	const { fortnox } = useStoreSelector((state) => state.app);
	useConfigureFortnox();

	const { current, pageSize } = useMemo(() => {
		return {
			current: parseInt(searchParams.get('page') || '1'),
			pageSize: parseInt(searchParams.get('limit') || `${config.itemsPerPage}`),
		};
	}, [searchParams]);
	const { isAllowedTo } = useAccessContext();

	const [{ data, isLoading }, { data: accountingProviders }] = useQueries([
		{
			queryKey: ['accounting-configs', current, pageSize],
			queryFn: () => accountingAPI.list({ page: current, limit: pageSize }),
		},
		{
			queryKey: ['accounting-unconfigured-providers', current, pageSize],
			queryFn: () => accountingAPI.unconfiguredProviders(),
		},
	]);

	const handlePageChange = useCallback(
		(page: number, size: number) => {
			const params = getPaginatedParams(searchParams, page, size);
			navigate({ search: params.toString() });
		},
		[navigate, searchParams]
	);

	const handleCreate = useCallback(() => {
		if (!accountingProviders?.length) {
			message.error(t('No accounting providers available!'));
			return;
		}

		setCreateModal(true);
		setUpdateModal(undefined);
	}, [accountingProviders?.length, t]);

	const handleConfigureFortnox = useCallback(() => {
		const {
			fortnox_client_id,
			fortnox_scope,
			fortnox_state,
			fortnox_access_type,
			fortnox_response_type,
			fortnox_account_type,
		} = fortnox || {};

		if (fortnox_client_id && fortnox_scope && fortnox_state && fortnox_response_type) {
			const url = new URL('https://apps.fortnox.se/oauth-v1/auth');
			url.searchParams.append('client_id', fortnox_client_id);
			url.searchParams.append('redirect_uri', window.location.href);
			url.searchParams.append('scope', fortnox_scope);
			url.searchParams.append('state', fortnox_state);
			if (fortnox_access_type) {
				url.searchParams.append('access_type', fortnox_access_type);
			}
			url.searchParams.append('response_type', fortnox_response_type);
			if (fortnox_account_type) {
				url.searchParams.append('account_type', fortnox_account_type);
			}
			window.location.href = url.toString();
		} else {
			message.error(t('Fortnox configuration is missing!'));
		}
	}, [fortnox, t]);

	const columns: ColumnsType<API.AccountingConfig> = [
		{
			width: 200,
			title: t('Name'),
			dataIndex: 'name',
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
		{
			title: '',
			dataIndex: 'action',
			render: (_, record) => (
				<Space>
					<Button type='link' size='large' style={{ padding: 0 }} onClick={handleConfigureFortnox}>
						{t('Configure Fortnox')}
					</Button>
					<Link
						to={`edit/${record.id}`}
						className={classNames('ant-btn ant-btn-link ant-btn-lg', {
							'ant-btn-disabled': !isAllowedTo('CHANGE_FORTNOXCOSTCENTER'),
						})}
					>
						{t('Scenarios')}
					</Link>
					<Link
						to='fortnox-cost-centers'
						className={classNames('ant-btn ant-btn-link ant-btn-lg', {
							'ant-btn-disabled': !isAllowedTo('CHANGE_FORTNOXCOSTCENTER'),
						})}
					>
						{t('Cost centers')}
					</Link>
					<Link
						to='fortnox-projects'
						className={classNames('ant-btn ant-btn-link ant-btn-lg', {
							'ant-btn-disabled': !isAllowedTo('CHANGE_FORTNOXCOSTCENTER'),
						})}
					>
						{t('Projects')}
					</Link>
				</Space>
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
						{isAllowedTo('ADD_ACCOUNTINGSERVICEPROVIDERCONFIGURATION') && (
							<Button className='ant-btn ant-btn-primary ant-btn-lg' onClick={handleCreate}>
								{t('Configure new provider')}
							</Button>
						)}
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
						pageSize: pageSize,
						current: current,
						total: data?.count || 0,
						onChange: handlePageChange,
						showSizeChanger: true,
					}}
				/>
			</Col>
		</Row>
	);
};
