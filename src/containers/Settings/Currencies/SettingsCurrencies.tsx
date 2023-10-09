import { DataTableWrapper } from '@/components/atoms/DataTable/DataTableWrapper';
import config from '@/config';
import { currenciesAPI } from '@/libs/api';
import { getPaginatedParams } from '@/utils/helpers';
import { Empty, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const SettingsCurrencies = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const { current, pageSize } = useMemo(() => {
		return {
			current: parseInt(searchParams.get('page') || '1'),
			pageSize: parseInt(searchParams.get('limit') || `${config.itemsPerPage}`),
		};
	}, [searchParams]);
	const { data: currencies, isLoading } = useQuery(['currencies', current, pageSize], () =>
		currenciesAPI.list({ page: current, limit: pageSize })
	);

	const handlePageChange = useCallback(
		(page: number, size: number) => {
			const params = getPaginatedParams(searchParams, page, size);
			navigate({ search: params.toString() });
		},
		[navigate, searchParams]
	);

	const columns: ColumnsType<API.Currency> = [
		{
			title: t('Name'),
			dataIndex: 'name',
			ellipsis: true,
		},
		{
			title: t('Currency Code'),
			dataIndex: 'currency_code',
			ellipsis: true,
		},
		{
			title: t('Country Name'),
			dataIndex: 'country_name',
			ellipsis: true,
		},
	];
	return (
		<DataTableWrapper title={t('Currencies')} count={currencies?.count}>
			<Table
				locale={{
					emptyText: (
						<Empty
							image={Empty.PRESENTED_IMAGE_SIMPLE}
							description={<span>{t('No results found')}</span>}
						/>
					),
				}}
				dataSource={currencies?.results}
				columns={columns}
				rowKey='id'
				scroll={{ y: '100%' }}
				loading={isLoading}
				pagination={{
					locale: { items_per_page: `/\t${t('page')}` },
					pageSize: pageSize,
					total: currencies?.count,
					onChange: handlePageChange,
					current: current,
					showSizeChanger: true,
				}}
			/>
		</DataTableWrapper>
	);
};
