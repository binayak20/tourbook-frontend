import { Col, InputNumber, List, Modal, ModalProps, Row, Typography } from 'antd';
import { Dispatch, FC, SetStateAction, useState } from 'react';
import { useWidgetState } from '../libs/WidgetContext';
import { transformString } from '../libs/utills';

const SupplementModal: FC<
	ModalProps & {
		tourDetails?: API.Tour;
		supplements: { [key: string]: number };
		setSupplements: Dispatch<
			SetStateAction<{
				[key: string]: number;
			}>
		>;
	}
> = ({ tourDetails, supplements, setSupplements, ...rest }) => {
	const { formatCurrency } = useWidgetState();
	const supplementList = tourDetails?.supplements?.filter((supplement) => supplement.is_calculate);
	const [selectedSupplements, setSelectedSupplements] = useState<{ [key: string]: number }>(
		supplements
	);
	const handleOnOk = (e: any) => {
		const supplements = Object.keys(selectedSupplements).reduce(
			(prev, curr) =>
				selectedSupplements[curr] > 0
					? {
							...prev,
							[curr]: selectedSupplements[curr],
					  }
					: prev,
			{}
		);
		setSupplements(supplements);
		rest.onCancel?.(e);
	};
	return (
		<Modal {...rest} title='Select supplement' onOk={handleOnOk} width={600}>
			<List
				size='small'
				bordered
				dataSource={supplementList}
				rowKey='id'
				renderItem={(supplement) => (
					<List.Item>
						<Row
							justify='space-between'
							align={'middle'}
							style={{
								width: '100%',
								color: '#CCC',
							}}
						>
							<Col flex={1}>
								<h3>{supplement.name}</h3>
								<Typography.Text type='secondary'>
									{formatCurrency(supplement?.price)} / {transformString(supplement.unit_type)}
								</Typography.Text>
								<p>{supplement.description}</p>
							</Col>
							<Col span={3} style={{ marginRight: '2rem' }}>
								<InputNumber
									size='large'
									value={selectedSupplements?.[supplement?.id]}
									onChange={(value) =>
										setSelectedSupplements((prev) => ({ ...prev, [supplement?.id]: value }))
									}
									defaultValue={0}
									min={0}
								/>
							</Col>
						</Row>
					</List.Item>
				)}
			/>
		</Modal>
	);
};

export default SupplementModal;
