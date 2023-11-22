import { StatusColumn } from '@/components/StatusColumn';
import { DataTableWrapper } from '@/components/atoms/DataTable/DataTableWrapper';
import config from '@/config';
import { couponAPI } from '@/libs/api/couponAPI';
import { PRIVATE_ROUTES } from '@/routes/paths';
import { generateStatusOptions, getPaginatedParams } from '@/utils/helpers';
import { Button, Empty, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import dayjs from 'dayjs';
import { useCallback, useMemo, useState } from 'react';
import { useAccessContext } from 'react-access-boundary';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from 'react-query';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { CouponCreate } from './CouponCreate';
import { CouponFilters } from './CouponFilters';

export const Coupons = () => {
	const id = useParams()['*'];
	const navigate = useNavigate();
	const { t } = useTranslation();
	const { isAllowedTo } = useAccessContext();
	const [searchParams] = useSearchParams();
	const [isCreateModalVisible, setCreateModalVisible] = useState(!!id);
	const queryClient = useQueryClient();

	const { current, pageSize, couponCode, from_date, to_date, activeItem } = useMemo(() => {
		return {
			current: parseInt(searchParams.get('page') || '1'),
			pageSize: parseInt(searchParams.get('limit') || `${config.itemsPerPage}`),
			couponCode: searchParams.get('coupon_code') || '',
			from_date: searchParams.get('from_date') || undefined,
			to_date: searchParams.get('to_date') || undefined,
			activeItem: searchParams.get('status') || 'active',
		};
	}, [searchParams]);

	const couponParams = useMemo(() => {
		return {
			code: couponCode,
			page: current,
			limit: pageSize,
			from_date,
			to_date,
			is_active:
				activeItem === 'active'
					? ('true' as unknown as boolean)
					: activeItem === 'inactive'
					? ('false' as unknown as boolean)
					: undefined,
			// validity:
			// 	CouponValidForm.length > 0 && CouponValidTo.length > 0
			// 		? [CouponValidForm, CouponValidTo].join(',')
			// 		: '',
		};
	}, [couponCode, current, pageSize, activeItem, from_date, to_date]);

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
			render: (value, record) => {
				return `${dayjs(value)?.format(config.dateFormat)} to ${dayjs(record?.valid_to)?.format(
					config.dateFormat
				)}`;
			},
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
		<>
			<CouponCreate isVisible={isCreateModalVisible} setVisible={setCreateModalVisible} />

			<DataTableWrapper
				title={t('All coupon')}
				menuOptions={generateStatusOptions('Coupons')}
				activeItem={activeItem}
				count={data?.count ?? 0}
				filterBar={<CouponFilters />}
				createButton={
					isAllowedTo('ADD_COUPON') && (
						<Button size='large' type='primary' onClick={() => setCreateModalVisible(true)}>
							{t('Create coupon')}
						</Button>
					)
				}
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
			</DataTableWrapper>
		</>
	);
};
