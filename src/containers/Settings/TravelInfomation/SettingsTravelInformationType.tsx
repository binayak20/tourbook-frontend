import { Switch } from '@/components/atoms';
import { DataTableWrapper } from '@/components/atoms/DataTable/DataTableWrapper';
import config from '@/config';
import { travelInfoAPI } from '@/libs/api/travelinfoAPI';
import { getPaginatedParams } from '@/utils/helpers';

import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useCallback, useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';

export function SettingsTravelInformationType() {
	const { t } = useTranslation();
	const navigate = useNavigate();

	const [searchParams] = useSearchParams();
	const { current, pageSize } = useMemo(() => {
		return {
			current: parseInt(searchParams.get('page') || '1'),
			pageSize: parseInt(searchParams.get('limit') || `${config.itemsPerPage}`),
		};
	}, [searchParams]);

	const { isLoading, data } = useQuery(['travel-info-types', current, pageSize], () =>
		travelInfoAPI.getTravelInfoTypeList({ page: current, limit: pageSize })
	);

	const tableData = useMemo(() => {
		return data?.results?.length ? data.results : [];
	}, [data]);

	const handlePageChange = useCallback(
		(page: number, size: number) => {
			const params = getPaginatedParams(searchParams, page, size);
			navigate({ search: params.toString() });
		},
		[navigate, searchParams]
	);

	const columns: ColumnsType<API.TravelInfoType> = [
		{
			title: t('Name'),
			dataIndex: 'name',
		},
		{
			title: t('Status'),
			dataIndex: 'is_active',
			width: 120,
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
		<DataTableWrapper title={t('Travel information types')} count={data?.count}>
			<Table
				rowKey='id'
				loading={isLoading}
				columns={columns}
				dataSource={tableData}
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
}
