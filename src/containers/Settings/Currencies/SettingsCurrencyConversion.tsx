import { Typography } from '@/components/atoms';
import { StatusColumn } from '@/components/StatusColumn';
import config from '@/config';
import { currenciesAPI } from '@/libs/api';
import { CurrencyConversation } from '@/libs/api/@types';
import { getPaginatedParams } from '@/utils/helpers';
import { Button, Col, Empty, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useCallback, useMemo, useState } from 'react';
import { useAccessContext } from 'react-access-boundary';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CurrencyConversionModal } from './CurrencyConversionModal';

export const SettingsCurrencyConversion = () => {
	const [isModalVisible, setModalVisible] = useState(false);
	const [updateData, setUpdateData] = useState<CurrencyConversation>();
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const { current, pageSize } = useMemo(() => {
		return {
			current: parseInt(searchParams.get('page') || '1'),
			pageSize: parseInt(searchParams.get('limit') || `${config.itemsPerPage}`),
		};
	}, [searchParams]);
	const { isAllowedTo } = useAccessContext();

	const { data, isLoading } = useQuery(['currencyConversations', current, pageSize], () =>
		currenciesAPI.currencyConversations({ page: current, limit: pageSize })
	);

	const handlePageChange = useCallback(
		(page: number, size: number) => {
			const params = getPaginatedParams(searchParams, page, size);
			navigate({ search: params.toString() });
		},
		[navigate, searchParams]
	);
	const columns: ColumnsType<CurrencyConversation> = [
		{
			title: t('From'),
			dataIndex: 'currency_from',
			render: (_, record) =>
				isAllowedTo('CHANGE_CURRENCYCONVERSION') ? (
					<Button
						size='large'
						type='link'
						onClick={() => {
							setModalVisible(true);
							setUpdateData(record);
						}}
					>
						{record.currency_from.currency_code}
					</Button>
				) : (
					record.currency_from.currency_code
				),
		},
		{
			title: t('To'),
			dataIndex: 'currency_to',
			render: (_, record) => record.currency_to.currency_code,
		},
		{ title: t('Rate'), dataIndex: 'rate' },
		{
			title: t('Status'),
			dataIndex: 'status',
			width: 100,
			render: (_, record) => {
				return (
					<StatusColumn
						status={record?.is_active}
						id={record.id}
						endpoint={'currency-conversions'}
						isDisabled={!isAllowedTo('CHANGE_CURRENCYCONVERSION')}
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
						<Typography.Title level={4} type='primary' className='margin-0'>
							{t('Currency Conversions')} ({data?.count || 0})
						</Typography.Title>
					</Col>
					<Col span={12} style={{ textAlign: 'right' }}>
						{isAllowedTo('ADD_CURRENCYCONVERSION') && (
							<Button type='primary' size='large' onClick={() => setModalVisible(true)}>
								{t('Create new')}
							</Button>
						)}
						<CurrencyConversionModal
							data={updateData}
							isVisible={isModalVisible}
							onHide={() => {
								setModalVisible(false);
								setUpdateData(undefined);
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
			</Col>
		</Row>
	);
};
