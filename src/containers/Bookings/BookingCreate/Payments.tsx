import { Typography } from '@/components/atoms';
import { bookingsAPI, toursAPI } from '@/libs/api';
import { BookingCreatePayload } from '@/libs/api/@types';
import { useFormatCurrency } from '@/libs/hooks';
import { DEFAULT_LIST_PARAMS } from '@/utils/constants';
import {
	Button,
	Col,
	Divider,
	Empty,
	Input,
	Popconfirm,
	Row,
	Select,
	Space,
	Table,
	Tabs,
	message,
} from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { Fragment, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';
import FortnoxLog from './FortnoxLog';
import { Transactions } from './Transactions';
import { PaymentsProps } from './types';

const DEFAULT_DISCOUNT = {
	coupon_or_fixed_discount_amount: undefined,
	discount_type: 'amount',
	coupon_code: undefined,
	discount_note: '',
} as Partial<BookingCreatePayload>;

export const Payments: React.FC<PaymentsProps> = ({
	cost_preview_rows,
	currency,
	sub_total,
	backBtnProps,
	finishBtnProps,
	onFinish,
	calculateWithDiscount,
	calculationLoading,
	initialDiscount,
	tour,
	isDeparted,
}) => {
	console.log(currency);
	const { isVisible: isFinishBtnVisible = true, ...restFinishBtnProps } = finishBtnProps || {};
	const [discount, setDiscount] = useState<Partial<BookingCreatePayload>>(
		initialDiscount?.coupon_or_fixed_discount_amount || initialDiscount?.coupon_code
			? initialDiscount
			: DEFAULT_DISCOUNT
	);
	const [discountAppiled, setDiscountApplied] = useState(
		!!(initialDiscount?.coupon_or_fixed_discount_amount || initialDiscount?.coupon_code)
	);
	const { t } = useTranslation();
	const { id } = useParams();
	const { formatCurrency, formatCurrencyWithFraction } = useFormatCurrency(currency?.currency_code);
	const columns: ColumnsType<API.CostPreviewRow> = [
		{
			width: 200,
			ellipsis: true,
			title: t('Name'),
			dataIndex: 'name',
		},
		{
			align: 'center',
			title: t('Quantity'),
			dataIndex: 'quantity',
		},
		{
			align: 'right',
			title: t('Unit Price'),
			dataIndex: 'unit_price',
			render: (value) => {
				const isNegetive = Math.sign(value) === -1;
				return (
					<Typography.Text {...(isNegetive && { type: 'danger' })}>
						{formatCurrency(value)}
					</Typography.Text>
				);
			},
		},
		{
			align: 'right',
			title: t('Total Price'),
			dataIndex: 'total_price',
			render: (value) => {
				const isNegetive = Math.sign(value) === -1;
				return (
					<Typography.Text {...(isNegetive && { type: 'danger' })}>
						{formatCurrency(value)}
					</Typography.Text>
				);
			},
		},
	];

	const queryClient = useQueryClient();

	const { data, isLoading: couponsLoading } = useQuery(
		['coupons', DEFAULT_LIST_PARAMS, currency?.currency_code],
		() =>
			toursAPI.coupons(tour!, { ...DEFAULT_LIST_PARAMS, currency_code: currency?.currency_code }),
		{
			enabled: discount?.discount_type === 'coupon' && !!currency?.currency_code,
		}
	);

	const couponOptions = data?.map((coupon) => ({
		label: coupon.code,
		value: coupon.code,
	}));

	const discountTypeOptions = [
		{ label: t('Amount'), value: 'amount' },
		{ label: t('Coupon'), value: 'coupon' },
	];

	const onChangeDiscount = useCallback(
		(value: unknown, key: keyof typeof discount) => {
			setDiscount((prev) => ({ ...prev, [key]: value }));
		},
		[setDiscount]
	);

	const onCreate = useCallback(() => {
		onFinish?.(discountAppiled ? discount : {});
	}, [onFinish, discountAppiled, discount]);

	const { mutate: handleCouponUpdate, isLoading: couponUpdateLoading } = useMutation(
		(values: Partial<BookingCreatePayload> & { is_applied: boolean }) =>
			bookingsAPI.addCoupon(id as unknown as number, values),
		{
			onSuccess: ({ detail }, values) => {
				queryClient.invalidateQueries(['booking']);
				if (values?.is_applied) message.success(detail);
				else message.info('Coupon has been removed');
			},
			onError: (error: Error) => {
				message.error(error.message);
			},
		}
	);

	const handleApplyCoupon = useCallback(() => {
		setDiscountApplied(true);
		calculateWithDiscount?.({
			coupon_or_fixed_discount_amount: Number(discount?.coupon_or_fixed_discount_amount),
			discount_type: discount?.discount_type,
			coupon_code: discount?.coupon_code,
		});
	}, [discount, calculateWithDiscount]);

	const handleRemoveCoupon = useCallback(() => {
		setDiscountApplied(false);
		setDiscount((current) => ({
			...current,
			coupon_or_fixed_discount_amount: undefined,
			coupon_code: undefined,
			discount_note: undefined,
		}));
		if (initialDiscount?.coupon_or_fixed_discount_amount || initialDiscount?.coupon_code) {
			handleCouponUpdate({ ...discount, is_applied: false });
		} else {
			calculateWithDiscount?.({
				coupon_or_fixed_discount_amount: 0,
				discount_type: undefined,
				coupon_code: undefined,
			});
		}
	}, [calculateWithDiscount, initialDiscount, discount, handleCouponUpdate]);

	return (
		<Row>
			<Col span={24}>
				<Typography.Title level={4} type='primary'>
					{t('Billing Details')}
				</Typography.Title>
				<Table
					locale={{
						emptyText: (
							<Empty
								image={Empty.PRESENTED_IMAGE_SIMPLE}
								description={<span>{t('No results found')}</span>}
							/>
						),
					}}
					dataSource={cost_preview_rows || []}
					columns={columns}
					rowKey='name'
					pagination={false}
					scroll={{ y: '100%' }}
					footer={() => (
						<Row justify='space-between' align='middle'>
							<Col span={18}>
								<Row gutter={[16, 16]}>
									<Col span={6}>
										<Typography.Text style={{ fontWeight: 500 }}>
											{t('Discount Type')}
										</Typography.Text>
										<Select
											options={discountTypeOptions}
											style={{ width: '100%' }}
											value={discount?.discount_type}
											disabled={isDeparted || discountAppiled}
											onChange={(value) => onChangeDiscount(value, 'discount_type')}
										/>
									</Col>
									<Col span={9}>
										<Typography.Text style={{ fontWeight: 500 }}>{t('Note')}</Typography.Text>
										<Input
											value={discount?.discount_note}
											disabled={isDeparted || discountAppiled}
											onChange={(e) => onChangeDiscount(e.target.value, 'discount_note')}
										/>
									</Col>
									<Col span={9}>
										<Typography.Text style={{ fontWeight: 500 }}>
											{t(discount.discount_type === 'amount' ? 'Amount' : 'Coupon')}
										</Typography.Text>
										<Space.Compact style={{ width: '100%' }}>
											{discount.discount_type === 'amount' ? (
												<Input
													disabled={isDeparted || discountAppiled}
													value={discount?.coupon_or_fixed_discount_amount || ''}
													onChange={(e) =>
														onChangeDiscount(
															Number(e.target.value),
															'coupon_or_fixed_discount_amount'
														)
													}
												/>
											) : (
												<Select
													allowClear
													options={couponOptions}
													style={{ width: '100%' }}
													loading={couponsLoading}
													disabled={isDeparted || discountAppiled}
													value={discount?.coupon_code}
													onChange={(value) => onChangeDiscount(value, 'coupon_code')}
												/>
											)}
											{discountAppiled ? (
												<Popconfirm
													title={t('Do you really want to remove this coupon?')}
													okText={t('Yes')}
													cancelText={t('No')}
													okType={'danger'}
													onConfirm={handleRemoveCoupon}
													disabled={
														isDeparted ||
														calculationLoading ||
														(!discount?.coupon_or_fixed_discount_amount && !discount?.coupon_code)
													}
												>
													<Button
														disabled={
															isDeparted ||
															calculationLoading ||
															(!discount?.coupon_or_fixed_discount_amount && !discount?.coupon_code)
														}
														danger={discountAppiled}
														type='primary'
													>
														{t('Remove')}
													</Button>
												</Popconfirm>
											) : (
												<Button
													disabled={
														isDeparted ||
														calculationLoading ||
														(!discount?.coupon_or_fixed_discount_amount && !discount?.coupon_code)
													}
													danger={discountAppiled}
													onClick={handleApplyCoupon}
													type='primary'
												>
													{t('Apply')}
												</Button>
											)}
										</Space.Compact>
									</Col>
								</Row>
							</Col>
							<Col>
								<Typography.Title level={5} type='primary' className='margin-4-top'>
									{t('Total')}: {formatCurrencyWithFraction(sub_total)}
								</Typography.Title>
							</Col>
						</Row>
					)}
					style={{ height: 'inherit' }}
				/>
			</Col>

			<Col span={24} style={{ marginTop: 30 }}>
				<Row gutter={16} justify='center'>
					<Col>
						<Button type='default' size='large' style={{ minWidth: 120 }} {...backBtnProps}>
							{t('Back')}
						</Button>
					</Col>
					{isFinishBtnVisible ? (
						<Col>
							<Button
								type='primary'
								size='large'
								style={{ minWidth: 120 }}
								{...restFinishBtnProps}
								onClick={onCreate}
							>
								{t('Create')}
							</Button>
						</Col>
					) : (
						!isDeparted && (
							<Col>
								<Button
									type='primary'
									size='large'
									style={{ minWidth: 120 }}
									{...restFinishBtnProps}
									onClick={() => handleCouponUpdate?.({ ...discount, is_applied: true })}
									loading={couponUpdateLoading}
									disabled={
										!!(
											initialDiscount?.coupon_or_fixed_discount_amount ||
											initialDiscount?.coupon_code
										) || !(discount?.coupon_or_fixed_discount_amount || discount?.coupon_code)
									}
								>
									{t('Save')}
								</Button>
							</Col>
						)
					)}
				</Row>
			</Col>

			{id && (
				<Fragment>
					<Divider />
					<Col span={24}>
						<Tabs
							defaultActiveKey='1'
							items={[
								{ label: t('Transactions'), children: <Transactions />, key: '1' },
								{ label: t('Fortnox log'), children: <FortnoxLog />, key: '2' },
							]}
						/>
					</Col>
				</Fragment>
			)}
		</Row>
	);
};
