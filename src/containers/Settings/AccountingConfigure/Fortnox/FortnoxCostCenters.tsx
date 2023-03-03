import { Typography } from '@/components/atoms';
import config from '@/config';
import { fortnoxAPI } from '@/libs/api';
import { Button, Col, Empty, message, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const FortnoxCostCenters = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const currentPage = useMemo(() => parseInt(searchParams.get('page') || '1'), [searchParams]);

	const columns: ColumnsType<API.FortnoxCostCenter> = [
		{
			title: t('Name'),
			dataIndex: 'name',
		},
		{
			title: t('Description'),
			dataIndex: 'note',
		},
		{
			title: t('Code'),
			dataIndex: 'code',
		},
		{
			title: t('Status'),
			dataIndex: 'is_active',
			render: (active) => (active ? t('Yes') : t('No')),
		},
	];

	const { data, isLoading } = useQuery(['fortnox-cost-centers', currentPage], () =>
		fortnoxAPI.costCenters({ page: currentPage })
	);

	const handlePageChange = useCallback(
		(page: number) => {
			const params = new URLSearchParams(searchParams);
			if (page === 1) {
				params.delete('page');
			} else {
				params.set('page', page.toString());
			}
			navigate({ search: params.toString() });
		},
		[navigate, searchParams]
	);

	const { mutate, isLoading: isMutateLoading } = useMutation(() => fortnoxAPI.fetchCostCenters(), {
		onSuccess: (data) => {
			message.success(data.details);
		},
		onError: (error: Error) => {
			message.error(error.message);
		},
	});

	return (
		<div style={{ display: 'flex', height: '100%', flexDirection: 'column', gap: '1rem' }}>
			<Row align='middle' justify='space-between'>
				<Col span={12}>
					<Typography.Title level={4} type='primary' className='margin-0'>
						{t('Fortnox cost centers')} ({data?.count || 0})
					</Typography.Title>
				</Col>
				<Col>
					<Button type='primary' size='large' loading={isMutateLoading} onClick={() => mutate()}>
						{t('Fetch cost centers')}
					</Button>
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
					dataSource={data?.results || []}
					columns={columns}
					rowKey='id'
					pagination={{
						pageSize: config.itemsPerPage,
						current: currentPage,
						total: data?.count || 0,
						onChange: handlePageChange,
					}}
					scroll={{ y: '100%' }}
					loading={isLoading}
				/>
			</div>
		</div>
	);
};
