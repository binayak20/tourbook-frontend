import { StatusColumn } from '@/components/StatusColumn';
import { Button, Typography } from '@/components/atoms';
import config from '@/config';
import { settingsAPI } from '@/libs/api';
import { EmailConfig } from '@/libs/api/@types';
import { getPaginatedParams } from '@/utils/helpers';
import { Col, Empty, Row, Space, Table, Tag } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { EmailRecepientCreateModal } from './emailRecepientCreate';
import { EmailRecepientUpdateModal } from './emailRecepientUpdate';

export const EmailConfiguration = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const [isCreateModal, setCreateModal] = useState(false);
	const [updateId, setUpdateId] = useState<number>();
	const [isUpdateModal, setUpdateModal] = useState(false);
	const queryClient = useQueryClient();

	const { data: emailConfig, isLoading } = useQuery(['config-email'], () =>
		settingsAPI.getEmailConfig()
	);

	const { current, pageSize } = useMemo(() => {
		return {
			current: parseInt(searchParams.get('page') || '1'),
			pageSize: parseInt(searchParams.get('limit') || `${config.itemsPerPage}`),
		};
	}, [searchParams]);

	const handlePageChange = useCallback(
		(page: number, size: number) => {
			const params = getPaginatedParams(searchParams, page, size);
			navigate({ search: params.toString() });
		},
		[navigate, searchParams]
	);

	const columns: ColumnsType<EmailConfig> = [
		{
			title: t('Name'),
			dataIndex: 'email_event',
			width: 200,
			// ellipsis: true,
			render: (email_event, record) => (
				<Button
					size='large'
					type='link'
					onClick={() => {
						setUpdateId(record?.id);
						setUpdateModal(true);
					}}
				>
					{email_event?.name}
				</Button>
			),
		},
		{
			title: t('To email'),
			dataIndex: 'to_email',
			width: 200,
		},
		{
			title: t('CC email'),
			dataIndex: 'cc_email',
			width: 200,
			render: (cc_email) => {
				return (
					<Space size={[0, 8]} wrap>
						{cc_email?.map((email: string) => (
							<Tag key={email}>{email}</Tag>
						))}
					</Space>
				);
			},
		},
		{
			title: t('Bcc email'),
			dataIndex: 'bcc_email',
			width: 200,
			render: (bcc_email) => {
				return (
					<Space size={[0, 8]} wrap>
						{bcc_email?.map((email: string) => (
							<Tag key={email}>{email}</Tag>
						))}
					</Space>
				);
			},
		},
		{
			title: t('Status'),
			dataIndex: 'is_active',
			width: 100,
			render: (_, record) => {
				return (
					<StatusColumn
						status={record?.is_active}
						id={record?.id}
						endpoint={'event-wise-recipients'}
						successMessage='Email configuration status has been updated'
						onSuccessFn={() => {
							queryClient.invalidateQueries('config-email');
						}}
					/>
				);
			},
		},
	];

	return (
		<div>
			<Col span={24} className='margin-4-bottom'>
				<Row align='middle' justify='space-between'>
					<Col span={12}>
						<Typography.Title level={4} type='primary' className='margin-0'>
							{t('Event wise recipient')}
						</Typography.Title>
					</Col>
					<Col>
						{/* {isAllowedTo('ADD_CATEGORY') && ( */}
						<Button
							type='primary'
							size='large'
							onClick={() => setCreateModal(true)}
							loading={isLoading}
						>
							{t('Create recipient')}
						</Button>
						{/* )} */}
						<EmailRecepientCreateModal isVisible={isCreateModal} setVisible={setCreateModal} />
						{updateId && (
							<EmailRecepientUpdateModal
								clearId={() => setUpdateId(undefined)}
								id={updateId}
								isVisible={isUpdateModal}
								setVisible={setUpdateModal}
							/>
						)}
					</Col>
				</Row>
			</Col>

			<div
				style={{
					maxWidth: '100%',
					minHeight: '1px',
				}}
			>
				<Table
					locale={{
						emptyText: (
							<Empty
								image={Empty.PRESENTED_IMAGE_SIMPLE}
								description={<span>{t('No results found')}</span>}
							/>
						),
					}}
					dataSource={emailConfig?.results}
					columns={columns}
					rowKey='id'
					pagination={{
						locale: { items_per_page: `/\t${t('page')}` },
						pageSize: pageSize,
						current: current,
						total: emailConfig?.count,
						onChange: handlePageChange,
						showSizeChanger: true,
					}}
					scroll={{ x: 1000 }}
					loading={isLoading}
				/>
			</div>
		</div>
	);
};
