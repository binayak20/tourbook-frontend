import { Typography } from '@/components/atoms';
import { StatusColumn } from '@/components/StatusColumn';
import config from '@/config';
import { travelInfoAPI } from '@/libs/api/travelinfoAPI';
import { getPaginatedParams } from '@/utils/helpers';
import { Button, Col, Empty, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SettingsCreateTravelInformation } from './SettingsCreateTravelInformation';

export function SettingsTravelInformation() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const [createModal, setCreateModal] = useState(false);
	const [currentTravelInfo, setCurrentTravelInfo] = useState<number>();

	const { current, pageSize } = useMemo(() => {
		return {
			current: parseInt(searchParams.get('page') || '1'),
			pageSize: parseInt(searchParams.get('limit') || `${config.itemsPerPage}`),
		};
	}, [searchParams]);

	const { isLoading, data } = useQuery(['travel-info', current, pageSize], () =>
		travelInfoAPI.getTravelInfoList({ page: current, limit: pageSize })
	);

	const handlePageChange = useCallback(
		(page: number, size: number) => {
			const params = getPaginatedParams(searchParams, page, size);
			navigate({ search: params.toString() });
		},
		[navigate, searchParams]
	);

	const columns: ColumnsType<API.TravelInfo> = [
		{
			title: t('Name'),
			dataIndex: 'name',
			render: (value, record) => (
				<Button
					size='large'
					type='link'
					onClick={() => {
						setCurrentTravelInfo(record?.id);
						setCreateModal(true);
					}}
				>
					{value}
				</Button>
			),
		},
		{ title: t('Link'), dataIndex: 'link' },
		{
			title: t('Status'),
			dataIndex: 'is_active',
			width: 120,
			render: (_, record) => {
				return (
					<StatusColumn
						status={record?.is_active}
						id={record.id}
						endpoint={'travel-informations'}
						successMessage='Travel info status has been updated'
						// isDisabled={!isAllowedTo('CHANGE_CATEGORY')}
					/>
				);
			},
		},
	];

	return (
		<div style={{ display: 'flex', height: '100%', flexDirection: 'column', gap: '1rem' }}>
			<Row align='middle' justify='space-between'>
				<Col span={12}>
					<Typography.Title noMargin level={4} type='primary'>
						{t('All travel information')} ({data?.count || 0})
					</Typography.Title>
				</Col>
				<Col span={6} style={{ textAlign: 'right' }}>
					<Button
						type='primary'
						size='large'
						onClick={() => {
							setCreateModal(true);
							setCurrentTravelInfo(undefined);
						}}
					>
						{t('Create Travel Information')}
					</Button>
					<SettingsCreateTravelInformation
						isVisible={createModal}
						setVisible={setCreateModal}
						travelInfos={data?.results}
						currentTravelInfo={currentTravelInfo}
					/>
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
			</div>
		</div>
	);
}
