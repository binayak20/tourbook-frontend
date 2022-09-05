import { Typography } from '@/components/atoms';
import { StatusColumn } from '@/components/StatusColumn';
import config from '@/config';
import { emailConfigsAPI } from '@/libs/api';
import { Button, Col, message, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useCallback, useMemo, useState } from 'react';
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
	const currentPage = useMemo(() => parseInt(searchParams.get('page') || '1'), [searchParams]);

	const [{ data, isLoading }, { data: emailProviders }] = useQueries([
		{
			queryKey: ['providerConfigurations', currentPage],
			queryFn: () => emailConfigsAPI.emailProviderConfig({ page: currentPage }),
		},
		{
			queryKey: ['unconfiguredEmailProviders', currentPage],
			queryFn: () => emailConfigsAPI.unconfiguredEmailProviders(),
		},
	]);

	const handlePageChange = useCallback(
		(page: number) => {
			navigate(page > 1 ? `?page=${page}` : '');
		},
		[navigate]
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
			render: (_, record) => (
				<Button
					type='link'
					onClick={() => {
						setUpdateModal(record);
						setCreateModal(false);
					}}
				>
					{record.email_provider.name}
				</Button>
			),
		},
		{
			title: '',
			dataIndex: 'action',
			render: (_, record) => (
				<Button type='link' onClick={() => setTemplatesModal(record)}>
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
					<StatusColumn status={value} id={record.id} endpoint={'email-provider-configurations'} />
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
							{t('Email configuration')}
						</Typography.Title>
					</Col>
					<Col span={12} style={{ textAlign: 'right' }}>
						<Button type='primary' size='large' onClick={handleCreate}>
							{t('Configure email provider')}
						</Button>
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
