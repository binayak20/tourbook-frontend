import { Switch } from '@/components/atoms';
import { DataTableWrapper } from '@/components/atoms/DataTable/DataTableWrapper';
import config from '@/config';
import { stationsAPI } from '@/libs/api';
import { getPaginatedParams } from '@/utils/helpers';
import { Empty, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const SettingsStationTypes = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const { current, pageSize } = useMemo(() => {
		return {
			current: parseInt(searchParams.get('page') || '1'),
			pageSize: parseInt(searchParams.get('limit') || `${config.itemsPerPage}`),
		};
	}, [searchParams]);

	const { isLoading, data } = useQuery(['stationsTypes', current, pageSize], () =>
		stationsAPI.types({ page: current, limit: pageSize })
	);

	const handlePageChange = useCallback(
		(page: number, size: number) => {
			const params = getPaginatedParams(searchParams, page, size);
			navigate({ search: params.toString() });
		},
		[navigate, searchParams]
	);

	const columns: ColumnsType<API.StationType> = [
		{
			title: t('Name'),
			dataIndex: 'name',
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
		<DataTableWrapper title={t('Station types')} count={data?.count}>
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
	);
};
