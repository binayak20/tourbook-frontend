import { Button } from '@/components/atoms';
import { PlusCircleOutlined } from '@ant-design/icons';
import { Card, Col, Form, Input, Row, Select } from 'antd';
import { FC, useState } from 'react';

interface Props {
	isNew?: boolean;
}

export const EventWiseAccount: FC<Props> = ({ isNew = false }) => {
	const [isAdding, setIsAdding] = useState(false);
	return isAdding || !isNew ? (
		<Form>
			<Card
				title={
					!isNew ? (
						'Event Name'
					) : (
						<Select placeholder='Select an event'>
							<Select.Option value='1'>Event 1</Select.Option>
							<Select.Option value='2'>Event 2</Select.Option>
						</Select>
					)
				}
			>
				<AccountEntry />
			</Card>
		</Form>
	) : (
		<Col span={24}>
			<Button
				style={{ height: '3.5rem', width: '100%' }}
				icon={<PlusCircleOutlined />}
				onClick={() => setIsAdding(true)}
			>
				Add New Event
			</Button>
		</Col>
	);
};

const AccountEntry = () => (
	<Row gutter={[16, 16]}>
		<Col span={8}>
			<Form.Item label='Scenario'>
				<Select>
					<Select.Option value='1'>Scenario 1</Select.Option>
					<Select.Option value='2'>Scenario 2</Select.Option>
				</Select>
			</Form.Item>
		</Col>
		<Col span={8}>
			<Form.Item label='Type'>
				<Select>
					<Select.Option value='1'>Debit</Select.Option>
					<Select.Option value='2'>Credit</Select.Option>
				</Select>
			</Form.Item>
		</Col>
		<Col span={8}>
			<Form.Item label='Account'>
				<Input />
			</Form.Item>
		</Col>
	</Row>
);
