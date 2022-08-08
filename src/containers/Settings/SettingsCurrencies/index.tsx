import { Typography } from '@/components/atoms';
import config from '@/config';
import { settingsAPI } from '@/libs/api';
import { Button, Col, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CurrenciesModal } from './CurrenciesModal';

export const SettingsCurrencies = () => {
	const [isModalVisible, setModalVisible] = useState(false);
	const [updateData, setUpdateData] = useState<API.CurrencyConversation>();
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const currentPage = useMemo(() => parseInt(searchParams.get('page') || '1'), [searchParams]);

	const { data, isLoading } = useQuery(['currencyConversations', currentPage], () =>
		settingsAPI.currencyConversations(currentPage)
	);

	const handlePageChange = useCallback(
		(page: number) => {
			navigate(page > 1 ? `?page=${page}` : '');
		},
		[navigate]
	);

	const columns: ColumnsType<API.CurrencyConversation> = [
		{
			title: t('From'),
			dataIndex: 'currency_from',
			render: (text: string, record) => (
				<Button
					type='link'
					onClick={() => {
						setModalVisible(true);
						setUpdateData(record);
					}}
				>
					{text}
				</Button>
			),
		},
		{ title: t('To'), dataIndex: 'currency_to' },
		{ title: t('Rate'), dataIndex: 'rate' },
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
						<CurrenciesModal
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
