import { StatusColumn } from '@/components/StatusColumn';
import { HeaderDropdown } from '@/components/TourAdminHeaderDropdown';
import config from '@/config';
import { toursAPI } from '@/libs/api';
import { TourTag } from '@/libs/api/@types';
import { useDropdownParam } from '@/libs/hooks/useHeaderDropdownParam';
import { PRIVATE_ROUTES } from '@/routes/paths';
import { getPaginatedParams } from '@/utils/helpers';
import { Button, Col, Empty, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useCallback, useMemo, useState } from 'react';
import { useAccessContext } from 'react-access-boundary';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { TourTagCreate } from './TagCreate';
import { TourTagUpdate } from './TagUpdate';

export const TourTags = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const activeItem = useMemo(() => searchParams.get('status') || 'active', [searchParams]);
	const [updateId, setUpdateId] = useState<number>();
	const [isCreateModal, setCreateModal] = useState(false);
	const [isUpdateModal, setUpdateModal] = useState(false);
	const queryClient = useQueryClient();
	const { current, pageSize } = useMemo(() => {
		return {
			current: parseInt(searchParams.get('page') || '1'),
			pageSize: parseInt(searchParams.get('limit') || `${config.itemsPerPage}`),
		};
	}, [searchParams]);
	const { isAllowedTo } = useAccessContext();

	//Seetings param hook for same header dropdown
	const tagParam = useDropdownParam(searchParams, current, pageSize);

	const { data: tagList, isLoading } = useQuery(['tour-tags', tagParam], () =>
		toursAPI.tourTags(tagParam)
	);

	const handlePageChange = useCallback(
		(page: number, size: number) => {
			const params = getPaginatedParams(searchParams, page, size);
			navigate({ search: params.toString() });
		},
		[navigate, searchParams]
	);

	const columns: ColumnsType<TourTag> = [
		{
			title: t('Name'),
			dataIndex: 'name',
			width: 200,
			ellipsis: true,
			render: (text, record) =>
				isAllowedTo('CHANGE_TOUR') ? (
					<Button
						size='large'
						type='link'
						onClick={() => {
							setUpdateId(record.id);
							setUpdateModal(true);
						}}
					>
						{text}
					</Button>
				) : (
					text
				),
		},
		{
			title: t('Slug'),
			dataIndex: 'slug',
			width: 200,
			ellipsis: true,
		},
		{
			title: t('Status'),
			dataIndex: 'status',
			width: 100,
			ellipsis: true,
			render: (_, record) => {
				return (
					<StatusColumn
						status={record?.is_active}
						id={record.id}
						endpoint={PRIVATE_ROUTES.TOUR_TAG_URL}
						successMessage='Tag status has been updated'
						onSuccessFn={() => {
							queryClient.invalidateQueries('tour-tags');
						}}
						isDisabled={!isAllowedTo('CHANGE_TOUR')}
					/>
				);
			},
		},
	];

	return (
		<div style={{ display: 'flex', height: '100%', flexDirection: 'column', gap: '1rem' }}>
			<Row align='middle' justify='space-between'>
				<Col span={12}>
					{/* Componet for header dropdown */}
					<HeaderDropdown count={tagList?.count} activeItem={activeItem ?? ''} sideItem='Tag' />
				</Col>
				<Col>
					{isAllowedTo('ADD_TOUR') && (
						<Button type='primary' size='large' onClick={() => setCreateModal(true)}>
							{t('Create tag')}
						</Button>
					)}
					<TourTagCreate isVisible={isCreateModal} setVisible={setCreateModal} />{' '}
					{updateId && (
						<TourTagUpdate
							clearId={() => setUpdateId(undefined)}
							id={updateId}
							isVisible={isUpdateModal}
							setVisible={setUpdateModal}
						/>
					)}
				</Col>
			</Row>
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
					dataSource={tagList?.results}
					columns={columns}
					rowKey='id'
					pagination={{
						locale: { items_per_page: `/\t${t('page')}` },
						pageSize: pageSize,
						current: current,
						total: tagList?.count,
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
