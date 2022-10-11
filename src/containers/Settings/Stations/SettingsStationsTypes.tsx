import { Switch, Typography } from '@/components/atoms';
import config from '@/config';
import { stationsAPI } from '@/libs/api';
import { Col, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const SettingsStationTypes = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const currentPage = useMemo(() => parseInt(searchParams.get('page') || '1'), [searchParams]);

	const { isLoading, data } = useQuery(['stationsTypes', currentPage], () =>
		stationsAPI.types({ page: currentPage })
	);

	const handlePageChange = useCallback(
		(page: number) => {
			navigate(page > 1 ? `?page=${page}` : '');
		},
		[navigate]
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
		<div style={{ display: 'flex', height: '100%', flexDirection: 'column', gap: '1rem' }}>
			<Row align='middle'>
				<Col span={6}>
					<Typography.Title noMargin level={4} type='primary'>
						{t('Station types')}
					</Typography.Title>
				</Col>
			</Row>

			<div
				style={{
					maxWidth: '100%',
					minHeight: '1px',
				}}
			>
				<Table
					rowKey='id'
					loading={isLoading}
					columns={columns}
					scroll={{ y: '100%' }}
					dataSource={data?.results || []}
					pagination={{
						pageSize: config.itemsPerPage,
						current: currentPage,
						total: data?.count || 0,
						onChange: handlePageChange,
					}}
				/>
			</div>
		</div>
	);
};