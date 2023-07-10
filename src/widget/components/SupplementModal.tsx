import { Checkbox } from '@/components/atoms';
import { Col, InputNumber, List, Modal, ModalProps, Row, Typography } from 'antd';
import { Dispatch, FC, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react';
import { useWidgetState } from '../libs/WidgetContext';
import { isPerPerson, transformString } from '../libs/utills';

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
> = ({ tourDetails, supplements, setSupplements, open, onCancel, ...rest }) => {
	const { formatCurrency, state } = useWidgetState();
	const supplementList = useMemo(
		() => tourDetails?.supplements?.filter((supplement) => supplement.is_calculate),
		[tourDetails?.supplements]
	);
	const [selectedSupplements, setSelectedSupplements] = useState<{ [key: string]: number }>({});

	const handleOnOk = useCallback(
		(e: any) => {
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
			onCancel?.(e);
		},
		[selectedSupplements, setSupplements, onCancel]
	);

	useEffect(() => {
		const preSelectedSupplements = supplementList?.reduce(
			(prev, curr) =>
				curr?.is_mandatory
					? {
							...prev,
							[curr?.id]: isPerPerson(curr) ? state?.remaining_capacity : 1,
					  }
					: prev,
			{}
		);
		setSelectedSupplements((prev) => ({ ...prev, ...preSelectedSupplements }));
	}, [state?.remaining_capacity, supplementList]);

	return (
		<Modal
			open={open}
			onCancel={onCancel}
			{...rest}
			title='Select supplement'
			onOk={handleOnOk}
			width={600}
			forceRender={true}
		>
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
								<Checkbox
									style={{ marginRight: '0.25rem' }}
									checked={supplement?.is_mandatory || selectedSupplements?.[supplement?.id] > 0}
									disabled={supplement?.is_mandatory}
									onChange={(e) =>
										setSelectedSupplements((prev) => ({
											...prev,
											[supplement?.id]: e.target.checked ? state?.remaining_capacity : 0,
										}))
									}
								>
									<h3>{supplement.name}</h3>
								</Checkbox>
								<br />
								<Typography.Text type='secondary'>
									{formatCurrency(supplement?.price)} / {transformString(supplement.unit_type)}
								</Typography.Text>
								<p>{supplement.description}</p>
							</Col>
							<Col span={3} style={{ marginRight: '2rem' }}>
								{isPerPerson(supplement) ? (
									<InputNumber
										size='large'
										value={selectedSupplements?.[supplement?.id]}
										disabled={supplement?.is_mandatory}
										onChange={(value) =>
											setSelectedSupplements((prev) => ({ ...prev, [supplement?.id]: value }))
										}
										defaultValue={0}
										min={0}
									/>
								) : null}
							</Col>
						</Row>
					</List.Item>
				)}
			/>
		</Modal>
	);
};

export default SupplementModal;
