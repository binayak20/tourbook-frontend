import { Switch, Typography } from '@/components/atoms';
import config from '@/config';
import { locationsAPI } from '@/libs/api';
import { getPaginatedParams } from '@/utils/helpers';
import { Col, Empty, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const SettingsTerritories = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const { current, pageSize } = useMemo(() => {
		return {
			current: parseInt(searchParams.get('page') || '1'),
			pageSize: parseInt(searchParams.get('limit') || `${config.itemsPerPage}`),
		};
	}, [searchParams]);

	const { data: territories, isLoading } = useQuery(['territories', current, pageSize], () =>
		locationsAPI.territories({ page: current, limit: pageSize })
	);

	const handlePageChange = useCallback(
		(page: number, size: number) => {
			const params = getPaginatedParams(searchParams, page, size);
			navigate({ search: params.toString() });
		},
		[navigate, searchParams]
	);

	const columns: ColumnsType<API.Territory> = [
		{
			title: t('Name'),
			dataIndex: 'name',
			ellipsis: true,
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
		<div style={{ display: 'flex', height: '100%', flexDirection: 'column', gap: '1rem' }}>
			<Row align='middle'>
				<Col span={12}>
					<Typography.Title level={4} type='primary' className='margin-0'>
						{t('Territories')} ({territories?.count || 0})
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
					locale={{
						emptyText: (
							<Empty
								image={Empty.PRESENTED_IMAGE_SIMPLE}
								description={<span>{t('No results found')}</span>}
							/>
						),
					}}
					dataSource={territories?.results}
					columns={columns}
					rowKey='id'
					scroll={{ y: '100%' }}
					loading={isLoading}
					pagination={{
						pageSize: pageSize,
						total: territories?.count,
						current: current,
						onChange: handlePageChange,
						showSizeChanger: true,
					}}
				/>
			</div>
		</div>
	);
};
