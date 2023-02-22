import { Typography } from '@/components/atoms';
import { StatusColumn } from '@/components/StatusColumn';
import config from '@/config';
import { emailConfigsAPI } from '@/libs/api';
import { getPaginatedParams } from '@/utils/helpers';
import { Button, Col, Empty, message, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useCallback, useMemo, useState } from 'react';
import { useAccessContext } from 'react-access-boundary';
import { useTranslation } from 'react-i18next';
import { useQueries } from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { EmailConfigureModal } from './EmailConfigureModal';
// import { EmailStatus } from './EmailStatus';
import { EmailTemplatesModal } from './EmailTemplatesModal';

export const EmailConfigure = () => {
	const { t } = useTranslation();
	const [isCreateModal, setCreateModal] = useState(false);
	const [isUpdateModal, setUpdateModal] = useState<API.EmailProviderConfig>();
	const [isTemplatesModal, setTemplatesModal] = useState<API.EmailProviderConfig>();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const { current, pageSize } = useMemo(() => {
		return {
			current: parseInt(searchParams.get('page') || '1'),
			pageSize: parseInt(searchParams.get('limit') || `${config.itemsPerPage}`),
		};
	}, [searchParams]);
	const { isAllowedTo } = useAccessContext();

	const [{ data, isLoading, refetch }, { data: emailProviders }] = useQueries([
		{
			queryKey: ['providerConfigurations', current, pageSize],
			queryFn: () => emailConfigsAPI.emailProviderConfig({ page: current, limit: pageSize }),
		},
		{
			queryKey: ['unconfiguredEmailProviders', current, pageSize],
			queryFn: () => emailConfigsAPI.unconfiguredEmailProviders(),
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
		if (!emailProviders?.length) {
			message.error(t('No email providers available!'));
			return;
		}

		setCreateModal(true);
		setUpdateModal(undefined);
	}, [emailProviders?.length, t]);

	const columns: ColumnsType<API.EmailProviderConfig> = [
		{
			width: 380,
			title: t('Name'),
			dataIndex: 'email_provider',
			render: (_, record) =>
				isAllowedTo('CHANGE_EMAILPROVIDERCONFIGURATION') ? (
					<Button
						size='large'
						type='link'
						onClick={() => {
							setUpdateModal(record);
							setCreateModal(false);
						}}
					>
						{record.email_provider.name}
					</Button>
				) : (
					record.email_provider.name
				),
		},
		{
			title: '',
			dataIndex: 'action',
			render: (_, record) => (
				<Button
					size='large'
					type='link'
					onClick={() => setTemplatesModal(record)}
					disabled={!isAllowedTo('CHANGE_EMAILEVENTTEMPLATE')}
				>
					{t('Update templates')}
				</Button>
			),
		},
		{
			width: 120,
			title: t('Status'),
			dataIndex: 'is_active',
			render: (value, record) => {
				return (
					<StatusColumn
						status={value}
						id={record.id}
						endpoint={'email-provider-configurations'}
						isDisabled={!isAllowedTo('CHANGE_EMAILPROVIDERCONFIGURATION')}
						onSuccessFn={refetch}
					/>
				);
			},
		},
	];

	return (
		<Row>
			<Col span={24} className='margin-4-bottom'>
				<Row align='middle'>
					<Col span={12}>
						<Typography.Title level={4} type='primary' noMargin>
							{t('Email configuration')} ({data?.count || 0})
						</Typography.Title>
					</Col>
					<Col span={12} style={{ textAlign: 'right' }}>
						{isAllowedTo('ADD_EMAILPROVIDERCONFIGURATION') && (
							<Button type='primary' size='large' onClick={handleCreate}>
								{t('Configure email provider')}
							</Button>
						)}
						<EmailConfigureModal
							data={isUpdateModal}
							providers={emailProviders}
							isModalVisible={isCreateModal || !!isUpdateModal}
							onClose={() => {
								setCreateModal(false);
								setUpdateModal(undefined);
							}}
						/>
						<EmailTemplatesModal
							data={isTemplatesModal}
							isModalVisible={!!isTemplatesModal}
							onClose={() => setTemplatesModal(undefined)}
						/>
					</Col>
				</Row>
			</Col>

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
					scroll={{ y: '100%' }}
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
