import { Typography } from '@/components/atoms';
import config from '@/config';
import { supplementsAPI } from '@/libs/api';
import { Breadcrumb as AntBreadcrumb, Button, Col, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { StatusColumn } from './StatusColumn';
import { SupplementCategoriesCreateModalMemo } from './SupplementCategoriesCreateModal';

export const SupplementCategories = () => {
	const { t } = useTranslation();
	const [isModalVisible, setModalVisible] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState<API.SupplementCategory>();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const currentPage = useMemo(() => parseInt(searchParams.get('page') || '1'), [searchParams]);

	const handlePageChange = useCallback(
		(page: number) => {
			navigate(page > 1 ? `?page=${page}` : '');
		},
		[navigate]
	);

	const { data, isLoading } = useQuery(['supplementsCategories', currentPage], () =>
		supplementsAPI.categories({ page: currentPage })
	);

	const columns: ColumnsType<API.SupplementCategory> = [
		{
			title: t('Name'),
			dataIndex: 'name',
			render: (name, record) => (
				<Breadcrumb separator='>'>
					{record.parent?.name && <Breadcrumb.Item>{record.parent.name}</Breadcrumb.Item>}
					<Breadcrumb.Item
						onClick={() => {
							setModalVisible(true);
							setSelectedCategory(record);
						}}
					>
						{name}
					</Breadcrumb.Item>
				</Breadcrumb>
			),
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
			<Row align='middle' justify='space-between'>
				<Col span={12}>
					<Typography.Title level={4} type='primary' className='margin-0'>
						{t('Supplement Categories')}
					</Typography.Title>
				</Col>
				<Col>
					<Button size='large' type='primary' onClick={() => setModalVisible(true)}>
						{t('Create category')}
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
					dataSource={data?.results || []}
					columns={columns}
					rowKey='id'
					scroll={{ y: '100%' }}
					loading={isLoading}
					pagination={{
						pageSize: config.itemsPerPage,
						current: currentPage,
						total: data?.count,
						onChange: handlePageChange,
					}}
				/>

				<SupplementCategoriesCreateModalMemo
					visible={isModalVisible}
					data={selectedCategory}
					mode={selectedCategory ? 'update' : 'create'}
					onCancel={() => {
						setModalVisible(false);
						setSelectedCategory(undefined);
					}}
				/>
			</div>
		</div>
	);
};

const Breadcrumb = styled(AntBreadcrumb)`
	ol {
		li {
			&:last-child {
				cursor: pointer;
				color: ${({ theme }) => theme.colors.primary};
			}
		}
	}
`;
