import { StatusColumn } from '@/components/StatusColumn';
import { Typography } from '@/components/atoms';
import config from '@/config';
import { couponAPI } from '@/libs/api/couponAPI';
import { PRIVATE_ROUTES } from '@/routes/paths';
import { getPaginatedParams } from '@/utils/helpers';
import { Button, Col, DatePicker, Empty, Input, Row, Space, Table } from 'antd';
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
	const { Search } = Input;
	const { RangePicker } = DatePicker;
	const navigate = useNavigate();
	const { t } = useTranslation();
	const { isAllowedTo } = useAccessContext();
	const [searchParams] = useSearchParams();
	const [isCreateModalVisible, setCreateModalVisible] = useState(!!id);
	const queryClient = useQueryClient();

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

	const { current, pageSize, couponCode, CouponValidForm, CouponValidTo } = useMemo(() => {
		return {
			current: parseInt(searchParams.get('page') || '1'),
			pageSize: parseInt(searchParams.get('limit') || `${config.itemsPerPage}`),
			couponCode: searchParams.get('coupon_code') || '',
			CouponValidForm: searchParams.get('coupon_valid_form') || '',
			CouponValidTo: searchParams.get('coupon_valid_to') || '',
		};
	}, [searchParams]);

	const couponParams = useMemo(() => {
		return {
			code: couponCode,
			page: current,
			limit: pageSize,
			validity:
				CouponValidForm.length > 0 && CouponValidTo.length > 0
					? [CouponValidForm, CouponValidTo].join(',')
					: '',
		};
	}, [couponCode, current, pageSize, CouponValidForm, CouponValidTo]);

	const { data, isLoading } = useQuery(['coupons', couponParams], () =>
		couponAPI.list(couponParams)
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
			render: (value) =>
				value ? `${value === 'all-tour' ? t('All tour') : t('Specified tours')}` : `-`,
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
			<CouponCreate isVisible={isCreateModalVisible} setVisible={setCreateModalVisible} />

			<Row align='middle' justify='space-between'>
				<Col span={'auto'}>
					<Typography.Title level={4} type='primary' className='margin-0'>
						{t('All coupon')} ({data?.count ?? 0})
					</Typography.Title>
				</Col>
				<Col span={'auto'}>
					<Space>
						<Search
							size='large'
							addonBefore={t('Code')}
							placeholder={t('Search by Code')}
							allowClear
							onSearch={(couponCode) => {
								handleSearchOrFilter('coupon_code', couponCode);
							}}
						/>
					</Space>
				</Col>
				<Col span={'auto'}>
					<Space>
						<RangePicker
							placeholder={[t('Valid from'), t('Valid to')]}
							size='large'
							onChange={(dates) => {
								handleSearchOrFilter(
									'coupon_valid_form',
									dates ? (dates[0]?.startOf('day').format('YYYY-MM-DDTHH:mm:ss[Z]') as string) : ''
								);
								handleSearchOrFilter(
									'coupon_valid_to',
									dates ? (dates[1]?.startOf('day').format('YYYY-MM-DDTHH:mm:ss[Z]') as string) : ''
								);
							}}
						/>
					</Space>
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
