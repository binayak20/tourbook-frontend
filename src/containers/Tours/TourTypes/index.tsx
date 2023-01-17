import config from '@/config';
import { toursAPI } from '@/libs/api';
import { Table } from 'antd';
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
	const currentPage = useMemo(() => parseInt(searchParams.get('page') || '1'), [searchParams]);
	const { isAllowedTo } = useAccessContext();

	const tourTypesParams: API.PaginateParams = useMemo(() => {
		const status = searchParams.get('status') || 'active';
		return {
			page: currentPage,
			is_active:
				status === 'active'
					? ('true' as unknown as boolean)
					: status === 'inactive'
					? ('false' as unknown as boolean)
					: undefined,
		};
	}, [currentPage, searchParams]);

	const { data, isLoading } = useQuery(['tourTypes', tourTypesParams], () =>
		toursAPI.tourTypes(tourTypesParams)
	);

	const handlePageChange = useCallback(
		(page: number) => {
			navigate(page > 1 ? `?page=${page}` : '');
		},
		[navigate]
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
					dataSource={data?.results || []}
					columns={columns}
					rowKey='id'
					pagination={{
						pageSize: config.itemsPerPage,
						current: currentPage,
						total: data?.count,
						onChange: handlePageChange,
					}}
					scroll={{ y: '100%' }}
					loading={isLoading}
				/>
			</div>
		</div>
	);
};
