import { StatusColumn } from '@/components/StatusColumn';
import { HeaderDropdown } from '@/components/TourAdminHeaderDropdown';
import config from '@/config';
import { settingsAPI } from '@/libs/api';
import { Accommodation } from '@/libs/api/@types/settings';
import { useDropdownParam } from '@/libs/hooks/useHeaderDropdownParam';
import { PRIVATE_ROUTES } from '@/routes/paths';
import { getPaginatedParams } from '@/utils/helpers';
import { Button, Col, Empty, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useCallback, useMemo, useState } from 'react';
import { useAccessContext } from 'react-access-boundary';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SettingsAccommodationCreate } from './SettingsAccommodationCreate';
import { SettingsAccommodationUpdate } from './SettingsAccommodationUpdate';

export const SettingsAccommodations: React.FC = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const activeItem = useMemo(() => searchParams.get('status') || 'active', [searchParams]);
	const [updateId, setUpdateId] = useState<number>();
	const [isCreateModal, setCreateModal] = useState(false);
	const [isUpdateModal, setUpdateModal] = useState(false);
	const { current, pageSize } = useMemo(() => {
		return {
			current: parseInt(searchParams.get('page') || '1'),
			pageSize: parseInt(searchParams.get('limit') || `${config.itemsPerPage}`),
		};
	}, [searchParams]);
	const { isAllowedTo } = useAccessContext();

	const accParam = useDropdownParam(searchParams, current, pageSize);
	const { data, isLoading } = useQuery(['accomodations', accParam], () =>
		settingsAPI.accommodations(current, pageSize, accParam?.is_active)
	);
	const accommodationsList = useMemo(() => {
		if (data?.results) return data?.results;
		return [];
	}, [data]);
	const handlePageChange = useCallback(
		(page: number, size: number) => {
			const params = getPaginatedParams(searchParams, page, size);
			navigate({ search: params.toString() });
		},
		[navigate, searchParams]
	);

	const columns: ColumnsType<Accommodation> = [
		{
			title: t('Name'),
			dataIndex: 'name',
			width: 250,
			ellipsis: true,
			render: (text, record) =>
				isAllowedTo('CHANGE_ACCOMMODATION') ? (
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
			title: t('Address'),
			dataIndex: 'address',
			ellipsis: true,
			width: 250,
		},
		{
			title: t('Website'),
			dataIndex: 'website_url',
			ellipsis: true,
			width: 200,
			render: (text) =>
				text ? (
					<a href={text} target='_blank' rel='noreferrer'>
						{text}
					</a>
				) : (
					'-'
				),
		},
		{
			title: t('Status'),
			dataIndex: 'status',
			width: 150,
			render: (_, record) => {
				return (
					<StatusColumn
						status={record?.is_active}
						id={record.id}
						endpoint={PRIVATE_ROUTES.ACCOMMODATIONS}
						isDisabled={!isAllowedTo('CHANGE_ACCOMMODATION')}
					/>
				);
			},
		},
	];
	return (
		<div style={{ display: 'flex', height: '100%', flexDirection: 'column', gap: '1rem' }}>
			<Row align='middle' justify='space-between'>
				<Col span={12}>
					<HeaderDropdown
						count={data?.count}
						activeItem={activeItem ?? ''}
						sideItem='accommodation'
					/>
				</Col>
				<Col>
					{isAllowedTo('ADD_ACCOMMODATION') && (
						<Button type='primary' size='large' onClick={() => setCreateModal(true)}>
							{t('Create Accommodation')}
						</Button>
					)}
					<SettingsAccommodationCreate isVisible={isCreateModal} setVisible={setCreateModal} />
					{updateId && (
						<SettingsAccommodationUpdate
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
					dataSource={accommodationsList}
					columns={columns}
					rowKey='id'
					scroll={{ y: '100%' }}
					loading={isLoading}
					pagination={{
						locale: { items_per_page: `/\t${t('page')}` },
						pageSize: pageSize,
						current: current,
						total: data?.count,
						onChange: handlePageChange,
						showSizeChanger: true,
					}}
				/>
			</div>
		</div>
	);
};
