import { CheckCircleFilled, DeleteOutlined } from '@ant-design/icons';
import { Button, Col, Row } from 'antd';
import { FC, ReactNode } from 'react';
import { ListWrapper } from './styles';

export type PickedListProps = {
	items: Pick<API.Supplement, 'id' | 'name'>[];
	children?: ReactNode;
	onRemove?: (id: number) => void;
};

export const PickedList: FC<PickedListProps> = (props) => {
	const { children, items, onRemove } = props;

	return (
		<ListWrapper>
			<Row gutter={16}>
				{items.map((item) => (
					<Col key={item.id} xl={12} xxl={8}>
						<Button
							type='primary'
							size='large'
							icon={<CheckCircleFilled />}
							onClick={() => onRemove?.(item.id)}
						>
							{item.name}
							<DeleteOutlined />
						</Button>
					</Col>
				))}
				<Col xl={12} xxl={8}>
					{children}
				</Col>
			</Row>
		</ListWrapper>
	);
};
