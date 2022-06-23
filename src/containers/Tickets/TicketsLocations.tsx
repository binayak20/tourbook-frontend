import { ReactComponent as ElipsisIcon } from '@/assets/images/icons/elipsis.svg';
import { Button, Typography } from '@/components/atoms';
import { OutlinedRangePicker, OutlinedSelect } from '@/components/atoms/FormItems';
import { Col, Pagination, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useTranslation } from 'react-i18next';
import { locationsData } from './dummy';

export type DataType = {
	id: number;
	name: string;
	transportation_type: number;
	transportation_type_name: string;
	short_code: string;
	is_active: boolean;
};

const dataSource: DataType[] = locationsData;

const { Option } = OutlinedSelect;

export const TicketsLocations = () => {
	const { t } = useTranslation();
	const columns: ColumnsType<DataType> = [
		{
			title: t('Name'),
			dataIndex: 'name',
			render: (text) => text,
		},
		{
			title: t('Ticket Type'),
			dataIndex: 'transportation_type_name',
		},
		{
			title: t('Short Code'),
			dataIndex: 'short_code',
		},
		{
			title: t('Actions'),
			render: () => (
				<Button
					style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
					icon={<ElipsisIcon />}
				/>
			),
			width: '16rem',
		},
	];

	return (
		<div style={{ display: 'flex', height: '100%', flexDirection: 'column', gap: '1rem' }}>
			<div>
				<Row align='middle'>
					<Col flex={1}>
						<Typography.Title level={4} type='primary' className='margin-0'>
							{t('Ticket Locations')}
						</Typography.Title>
					</Col>
					<Row>
						<Col>
							<OutlinedRangePicker
								onChange={(value) => console.log(value ? value[0]?.format('YYYY-MM-DD') : '')}
							/>
						</Col>
						<Col>
							<OutlinedSelect placeholder='Test'>
								<Option>Option 1</Option>
								<Option>Option 2</Option>
							</OutlinedSelect>
						</Col>
					</Row>
				</Row>
			</div>
			<div
				style={{
					maxWidth: '100%',
					minHeight: '1px',
				}}
			>
				<Table
					dataSource={dataSource}
					columns={columns}
					rowKey='id'
					pagination={false}
					scroll={{ y: '100%' }}
				/>
			</div>
			<div>
				<Pagination />
			</div>
		</div>
	);
};
