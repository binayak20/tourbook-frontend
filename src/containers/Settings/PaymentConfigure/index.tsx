import { Typography } from '@/components/atoms';
import config from '@/config';
import { paymentConfigsAPI } from '@/libs/api';
import { getPaginatedParams } from '@/utils/helpers';
import { Button, Col, Empty, message, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useCallback, useMemo, useState } from 'react';
import { useAccessContext } from 'react-access-boundary';
import { useTranslation } from 'react-i18next';
import { useQueries } from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PaymentConfigureModal } from './PaymentConfigureModal';
import { PaymentStatus } from './PaymentStatus';

export const PaymentConfigure = () => {
	const { t } = useTranslation();
	const [isModalVisible, setModalVisible] = useState(false);
	const [isUpdateModal, setUpdateModal] = useState<API.PaymentConfig>();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const { current, pageSize } = useMemo(() => {
		return {
			current: parseInt(searchParams.get('page') || '1'),
			pageSize: parseInt(searchParams.get('limit') || `${config.itemsPerPage}`),
		};
	}, [searchParams]);
	const { isAllowedTo } = useAccessContext();

	const [{ data, isLoading }, { data: paymentMethods }] = useQueries([
		{
			queryKey: ['paymentConfigurations', current, pageSize],
			queryFn: () => paymentConfigsAPI.paymentConfigurations({ page: current, limit: pageSize }),
		},
		{
			queryKey: ['unconfiguredPaymentMethods'],
			queryFn: () => paymentConfigsAPI.unconfiguredPaymentMethods(),
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
		if (!paymentMethods?.length) {
			message.error(t('No payment methods available!'));
			return;
		}

		setModalVisible(true);
		setUpdateModal(undefined);
	}, [paymentMethods?.length, t]);

	const columns: ColumnsType<API.PaymentConfig> = [
		{
			title: t('Name'),
			dataIndex: 'payment_method_name',
			render: (_, recoard) =>
				isAllowedTo('CHANGE_PAYMENTMETHODCONFIGURATION') ? (
					<Button
						size='large'
						type='link'
						onClick={() => {
							setUpdateModal(recoard);
							setModalVisible(true);
						}}
					>
						{recoard.payment_method.name}
					</Button>
				) : (
					recoard.payment_method.name
				),
		},
		{
			width: 120,
			title: t('Status'),
			dataIndex: 'is_active',
			render: (is_active, record) => (
				<PaymentStatus ID={record.id} status={is_active ? 'Active' : 'Inactive'} />
			),
		},
	];

	return (
		<Row>
			<Col span={24} className='margin-4-bottom'>
				<Row align='middle'>
					<Col span={12}>
						<Typography.Title level={4} type='primary' noMargin>
							{t('Payment configure')} ({data?.count || 0})
						</Typography.Title>
					</Col>
					<Col span={12} style={{ textAlign: 'right' }}>
						{isAllowedTo('ADD_PAYMENTMETHODCONFIGURATION') && (
							<Button type='primary' size='large' onClick={handleCreate}>
								{t('Configure new payment')}
							</Button>
						)}
						<PaymentConfigureModal
							data={isUpdateModal}
							methods={paymentMethods}
							isModalVisible={isModalVisible}
							onClose={() => {
								setModalVisible(false);
								setUpdateModal(undefined);
							}}
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
							description={
								<span>
									{t('No results found')}
								</span>
							}
						/>
					),
				}}
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
