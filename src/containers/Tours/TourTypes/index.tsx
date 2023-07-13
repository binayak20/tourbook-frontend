import config from '@/config';
import { toursAPI } from '@/libs/api';
import { getPaginatedParams } from '@/utils/helpers';
import { Empty, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useCallback, useMemo } from 'react';
import { useAccessContext } from 'react-access-boundary';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { StatusColumn } from './StatusColumn';
import { TourTypesHeader } from './TourTypesHeader';

export const TourTypes = () => {
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

	const tourTypesParams: API.PaginateParams = useMemo(() => {
		const status = searchParams.get('status') || 'active';
		return {
			page: current,
			limit: pageSize,
			name: searchParams.get('name') || undefined,
			is_active:
				status === 'active'
					? ('true' as unknown as boolean)
					: status === 'inactive'
					? ('false' as unknown as boolean)
					: undefined,
		};
	}, [current, pageSize, searchParams]);

	const { data, isLoading } = useQuery(['tourTypes', tourTypesParams], () =>
		toursAPI.tourTypes(tourTypesParams)
	);

	const handlePageChange = useCallback(
		(page: number, size: number) => {
			const params = getPaginatedParams(searchParams, page, size);
			navigate({ search: params.toString() });
		},
		[navigate, searchParams]
	);

	const columns: ColumnsType<API.TourType> = [
		{
			title: t('Name'),
			dataIndex: 'name',
			width: 250,
			ellipsis: true,
			render: (name, { id }) =>
				isAllowedTo('CHANGE_TOURTYPE') ? <Link to={`edit/${id}`}>{name}</Link> : name,
		},
		{ title: t('Duration'), dataIndex: 'duration' },
		{
			title: t('Capacity'),
			dataIndex: 'capacity',
		},
		{
			title: t('Status'),
			dataIndex: 'is_active',
			width: 160,
			align: 'center',
			render: (is_active, { id }) => (
				<StatusColumn id={id} status={is_active ? 'Active' : 'Inactive'} />
			),
		},
	];

	return (
		<div style={{ display: 'flex', height: '100%', flexDirection: 'column', gap: '1rem' }}>
			<TourTypesHeader count={data?.count} />

			<div
				style={{
					maxWidth: '100%',
					minHeight: '1px',
				}}
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
					dataSource={data?.results || []}
					columns={columns}
					rowKey='id'
					pagination={{
						locale: { items_per_page: `/\t${t('page')}` },
						pageSize: pageSize,
						current: current,
						total: data?.count,
						onChange: handlePageChange,
						showSizeChanger: true,
					}}
					scroll={{ y: '100%' }}
					loading={isLoading}
				/>
			</div>
		</div>
	);
};
