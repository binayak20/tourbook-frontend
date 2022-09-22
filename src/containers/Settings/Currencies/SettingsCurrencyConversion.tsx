import { Typography } from '@/components/atoms';
import { StatusColumn } from '@/components/StatusColumn';
import config from '@/config';
import { currenciesAPI } from '@/libs/api';
import { CurrencyConversation } from '@/libs/api/@types';
import { Button, Col, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useCallback, useMemo, useState } from 'react';
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
	const currentPage = useMemo(() => parseInt(searchParams.get('page') || '1'), [searchParams]);

	const { data, isLoading } = useQuery(['currencyConversations', currentPage], () =>
		currenciesAPI.currencyConversations(currentPage)
	);

	const handlePageChange = useCallback(
		(page: number) => {
			navigate(page > 1 ? `?page=${page}` : '');
		},
		[navigate]
	);

	const columns: ColumnsType<CurrencyConversation> = [
		{
			title: t('From'),
			dataIndex: 'currency_from',
			render: (_, record) => (
				<Button
					type='link'
					onClick={() => {
						setModalVisible(true);
						setUpdateData(record);
					}}
				>
					{record.currency_from.currency_code}
				</Button>
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
							{t('Currency Conversions')}
						</Typography.Title>
					</Col>
					<Col span={12} style={{ textAlign: 'right' }}>
						<Button type='primary' size='large' onClick={() => setModalVisible(true)}>
							{t('Create new')}
						</Button>
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
					rowKey='id'
					loading={isLoading}
					columns={columns}
					scroll={{ y: '100%' }}
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
