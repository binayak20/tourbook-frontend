import { Switch } from '@/components/atoms';
import { DataTableWrapper } from '@/components/atoms/DataTable/DataTableWrapper';
import config from '@/config';
import { ticketTypeAPI } from '@/libs/api/ticketTypeAPI';
import { getPaginatedParams } from '@/utils/helpers';
import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const TicketTypes = () => {
	const { t } = useTranslation();
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();

	const { current, pageSize } = useMemo(() => {
		return {
			current: parseInt(searchParams.get('page') || '1'),
			pageSize: parseInt(searchParams.get('limit') || `${config.itemsPerPage}`),
		};
	}, [searchParams]);

	const { isLoading, data } = useQuery(['TicketTypes', current, pageSize], () =>
		ticketTypeAPI.list({ page: current, limit: pageSize })
	);

	const handlePageChange = useCallback(
		(page: number, size: number) => {
			const params = getPaginatedParams(searchParams, page, size);
			navigate({ search: params.toString() });
		},
		[navigate, searchParams]
	);

	const tableData = useMemo(() => {
		return data?.results?.length ? data.results : [];
	}, [data]);

	const columns: ColumnsType<API.TicketType> = [
		{
			title: t('Name'),
			dataIndex: 'name',
			render: (name: string) => {
				return name;
			},
		},
		{
			width: 120,
			title: t('Status'),
			dataIndex: 'is_active',
			render: (is_active) => (
				<Switch
					custom
					disabled
					checked={is_active}
					checkedChildren={t('On')}
					unCheckedChildren={t('Off')}
				/>
			),
		},
	];

	return (
		<DataTableWrapper title={t('Ticket types')} count={data?.count}>
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
				scroll={{ y: '100%' }}
			/>
		</DataTableWrapper>
	);
};
