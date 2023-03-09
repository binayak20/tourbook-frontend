import config from '@/config';
import { ticketTypeAPI } from '@/libs/api/ticketTypeAPI';
import { getPaginatedParams } from '@/utils/helpers';
import { Button, Col, Row, Switch, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useCallback, useMemo } from 'react';
import { useAccessContext } from 'react-access-boundary';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const TicketTypes = () => {
	const { t } = useTranslation();
	const [searchParams] = useSearchParams();
	const { isAllowedTo } = useAccessContext();
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

	const columns: ColumnsType<API.Ticket> = [
		{
			title: t('Name'),
			dataIndex: 'name',
			render: (name: string) => {
				if (isAllowedTo('CHANGE_TICKETTYPE')) {
					return (
						<Button
							type='link'
							onClick={() => {
								return;
							}}
						>
							{name}
						</Button>
					);
				}

				return name;
			},
		},
		{
			width: 120,
			title: t('Status'),
			dataIndex: 'is_active',
			render: (is_active) => <Switch checked={is_active ? true : false} />,
		},
	];

	return (
		<Row>
			<Col span={24}>
				<Table
					rowKey='id'
					loading={isLoading}
					columns={columns}
					dataSource={tableData}
					pagination={{
						pageSize: pageSize,
						current: current,
						total: data?.count || 0,
						onChange: handlePageChange,
						showSizeChanger: true,
					}}
				/>
			</Col>
		</Row>
	);
};
