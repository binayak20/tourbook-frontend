import { Switch } from '@/components/atoms';
import { DataTableWrapper } from '@/components/atoms/DataTable/DataTableWrapper';
import config from '@/config';
import { locationsAPI } from '@/libs/api';
import { getPaginatedParams } from '@/utils/helpers';
import { Empty, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const SettingsCountries = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const { current, pageSize } = useMemo(() => {
		return {
			current: parseInt(searchParams.get('page') || '1'),
			pageSize: parseInt(searchParams.get('limit') || `${config.itemsPerPage}`),
		};
	}, [searchParams]);

	const { data: countries, isLoading: countryListLoading } = useQuery(
		['countries', current, pageSize],
		() => locationsAPI.countries({ page: current, limit: pageSize })
	);

	const handlePageChange = useCallback(
		(page: number, size: number) => {
			const params = getPaginatedParams(searchParams, page, size);
			navigate({ search: params.toString() });
		},
		[navigate, searchParams]
	);

	const columns: ColumnsType<API.Country> = [
		{
			title: t('Name'),
			dataIndex: 'name',
			ellipsis: true,
		},
		{
			title: t('Territory'),
			dataIndex: 'territory',
			ellipsis: true,
			render: (value) => value?.name,
		},
		{
			title: t('Status'),
			dataIndex: 'is_active',
			width: '120px',
			render: (value) => (
				<Switch
					custom
					checked={value}
					disabled
					checkedChildren={t('On')}
					unCheckedChildren={t('Off')}
				/>
			),
		},
	];

	return (
		<DataTableWrapper title={t('Countries')} count={countries?.count}>
			<Table
				locale={{
					emptyText: (
						<Empty
							image={Empty.PRESENTED_IMAGE_SIMPLE}
							description={<span>{t('No results found')}</span>}
						/>
					),
				}}
				dataSource={countries?.results}
				columns={columns}
				rowKey='id'
				scroll={{ y: '100%' }}
				loading={countryListLoading}
				pagination={{
					locale: { items_per_page: `/\t${t('page')}` },
					pageSize: pageSize,
					total: countries?.count,
					current: current,
					onChange: handlePageChange,
					showSizeChanger: true,
				}}
			/>
		</DataTableWrapper>
	);
};
