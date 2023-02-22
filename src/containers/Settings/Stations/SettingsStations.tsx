import { Typography } from '@/components/atoms';
import { StatusColumn } from '@/components/StatusColumn';
import config from '@/config';
import { stationsAPI } from '@/libs/api';
import { PRIVATE_ROUTES } from '@/routes/paths';
import { getPaginatedParams } from '@/utils/helpers';
import { Button, Col, Empty, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SettingsStationCreate } from './SettingsStationCreate';
import { SettingsStationUpdate } from './SettingsStationUpdate';

export const SettingsStations = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [updateId, setUpdateId] = useState<number>();
	const [updateModal, setUpdateModal] = useState(false);
	const [createModal, setCreateModal] = useState(false);
	const [searchParams] = useSearchParams();
	const { current, pageSize } = useMemo(() => {
		return {
			current: parseInt(searchParams.get('page') || '1'),
			pageSize: parseInt(searchParams.get('limit') || `${config.itemsPerPage}`),
		};
	}, [searchParams]);

	const { isLoading, data } = useQuery(['stations', current, pageSize], () =>
		stationsAPI.list({ page: current, limit: pageSize })
	);

	const handlePageChange = useCallback(
		(page: number, size: number) => {
			const params = getPaginatedParams(searchParams, page, size);
			navigate({ search: params.toString() });
		},
		[navigate, searchParams]
	);

	const columns: ColumnsType<API.Station> = [
		{
			title: t('Name'),
			dataIndex: 'name',
			render: (text, record) => {
				if (record?.station_type?.name === 'Other') {
					return (
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
					);
				}

				return <Typography.Text style={{ marginLeft: '15px' }}>{text}</Typography.Text>;
			},
		},
		{
			title: t('Type'),
			dataIndex: 'station_type',
			render: (value) => value?.name,
		},
		{
			title: t('Status'),
			dataIndex: 'is_active',
			width: '120px',
			render: (value, record) => (
				<StatusColumn
					status={record?.is_active}
					id={record.id}
					endpoint={PRIVATE_ROUTES.STATIONS}
					successMessage='Station status has been updated'
					onSuccessFn={() => {
						queryClient.invalidateQueries('stations');
					}}
					isDisabled={record?.station_type?.name !== 'Other'}
				/>
			),
		},
	];

	return (
		<div style={{ display: 'flex', height: '100%', flexDirection: 'column', gap: '1rem' }}>
			<Row align='middle' justify='space-between'>
				<Col span={6}>
					<Typography.Title noMargin level={4} type='primary'>
						{t('All stations')} ({data?.count || 0})
					</Typography.Title>
				</Col>
				<Col span={6} style={{ textAlign: 'right' }}>
					<Button type='primary' size='large' onClick={() => setCreateModal(true)}>
						{t('Create Station')}
					</Button>
					<SettingsStationCreate isVisible={createModal} setVisible={setCreateModal} />
					{updateId && (
						<SettingsStationUpdate
							clearId={() => setUpdateId(undefined)}
							id={updateId}
							isVisible={updateModal}
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
					rowKey='id'
					loading={isLoading}
					columns={columns}
					scroll={{ y: '100%' }}
					dataSource={data?.results || []}
					pagination={{
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
};
