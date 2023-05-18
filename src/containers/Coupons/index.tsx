import { StatusColumn } from '@/components/StatusColumn';
import { Typography } from '@/components/atoms';
import config from '@/config';
import { couponAPI } from '@/libs/api/couponAPI';
import { PRIVATE_ROUTES } from '@/routes/paths';
import { getPaginatedParams } from '@/utils/helpers';
import { Button, Col, Empty, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import { useCallback, useMemo, useState } from 'react';
import { useAccessContext } from 'react-access-boundary';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from 'react-query';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { CouponCreate } from './CouponCreate';

export const Coupons = () => {
	const id = useParams()['*'];
	const navigate = useNavigate();
	const { t } = useTranslation();
	const { isAllowedTo } = useAccessContext();
	const [searchParams] = useSearchParams();
	const [isCreateModalVisible, setCreateModalVisible] = useState(!!id);
	const queryClient = useQueryClient();

	const { current, pageSize } = useMemo(() => {
		return {
			current: parseInt(searchParams.get('page') || '1'),
			pageSize: parseInt(searchParams.get('limit') || `${config.itemsPerPage}`),
		};
	}, [searchParams]);

	const { data, isLoading } = useQuery(['coupons', current, pageSize], () =>
		couponAPI.list({ page: current, limit: pageSize })
	);

	const columns: ColumnsType<API.Coupon> = [
		{
			title: t('Code'),
			dataIndex: 'code',
			ellipsis: true,
			render: (code, { id }) =>
				isAllowedTo('CHANGE_COUPON') ? (
					<Button
						size='large'
						type='link'
						style={{ padding: 0, height: 'auto' }}
						onClick={() => {
							navigate(`${id}`);
							setCreateModalVisible(true);
						}}
					>
						{code}
					</Button>
				) : (
					code
				),
		},
		{
			title: t('Validity'),
			dataIndex: 'valid_from',
			render: (value, record) =>
				`${moment(value)?.format(config.dateFormat)} to ${moment(record?.valid_to)?.format(
					config.dateFormat
				)}`,
		},
		{
			title: t('For'),
			dataIndex: 'coupon_type',

			render: (value) => `${value === 'all-tour' ? t('All tour') : t('Specified tours')}`,
		},
		{
			title: t('Description'),
			dataIndex: 'description',
			ellipsis: true,
			width: '400px',
		},
		{
			title: t('Status'),
			dataIndex: 'is_active',
			width: '120px',
			render: (value, record) => (
				<StatusColumn
					status={record?.is_active}
					id={record.id}
					endpoint={PRIVATE_ROUTES.COUPONS}
					successMessage='Coupon status has been updated'
					onSuccessFn={() => {
						queryClient.invalidateQueries('coupons');
					}}
				/>
			),
		},
	];
	const handlePageChange = useCallback(
		(page: number, size: number) => {
			const params = getPaginatedParams(searchParams, page, size);
			navigate({ search: params.toString() });
		},
		[navigate, searchParams]
	);

	return (
		<div style={{ display: 'flex', height: '100%', flexDirection: 'column', gap: '1rem' }}>
			{isCreateModalVisible && (
				<CouponCreate isVisible={isCreateModalVisible} setVisible={setCreateModalVisible} />
			)}
			<Row align='middle' justify='space-between'>
				<Col span={12}>
					<Typography.Title level={4} type='primary' className='margin-0'>
						{t('All coupon')} ({data?.count ?? 0})
					</Typography.Title>
				</Col>
				<Col>
					{isAllowedTo('ADD_COUPON') && (
						<Button size='large' type='primary' onClick={() => setCreateModalVisible(true)}>
							{t('Create coupon')}
						</Button>
					)}
				</Col>
			</Row>
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
					rowKey='id'
					loading={isLoading}
					columns={columns}
					scroll={{ y: '100%' }}
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
			</div>
		</div>
	);
};
