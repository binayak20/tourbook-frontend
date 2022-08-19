import { CheckCircleFilled, DeleteOutlined } from '@ant-design/icons';
import { Button, Col, Row } from 'antd';
import { FC, ReactNode } from 'react';
import { SupplementListWrapper } from './styles';

export type SupplementsListProps = {
	items: API.Supplement[];
	children?: ReactNode;
	onRemove?: (id: number) => void;
};

export const SupplementsList: FC<SupplementsListProps> = (props) => {
	const { children, items, onRemove } = props;

	return (
		<SupplementListWrapper>
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
		</SupplementListWrapper>
	);
};
