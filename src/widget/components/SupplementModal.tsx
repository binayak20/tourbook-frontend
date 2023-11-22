import { Typography } from '@/components/atoms';
import { Checkbox, Col, InputNumber, List, Modal, ModalProps, Row } from 'antd';
import { Dispatch, FC, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useWidgetState } from '../libs/WidgetContext';
import { isPerPerson, transformString } from '../libs/utills';

const StyledInputNumber = styled(InputNumber)`
	width: 100%;
	button {
		padding: 0 1rem;
		border: none;
		background: none;
	}
	.ant-input-number-group-addon {
		padding: 0;
	}
	.ant-input-number-input {
		text-align: center;
	}
`;

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
	const supplementList = useMemo(() => tourDetails?.supplements, [tourDetails?.supplements]);
	const { t } = useTranslation('translationWidget');
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
		setSelectedSupplements((prev) => ({ ...prev, ...preSelectedSupplements, ...supplements }));
	}, [state?.remaining_capacity, supplementList, supplements]);

	return (
		<Modal
			open={open}
			onCancel={onCancel}
			{...rest}
			title={t('Select supplements')}
			onOk={handleOnOk}
			width={768}
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
							<Col span={24} md={18}>
								<Checkbox
									style={{ marginRight: '0.5rem', marginBottom: '1rem', width: '100%' }}
									checked={supplement?.is_mandatory || selectedSupplements?.[supplement?.id] > 0}
									disabled={supplement?.is_mandatory}
									onChange={(e) =>
										setSelectedSupplements((prev) => ({
											...prev,
											[supplement?.id]: e.target.checked
												? isPerPerson(supplement)
													? state?.remaining_capacity
													: 1
												: 0,
										}))
									}
								>
									<Typography.Title level={5} noMarginBottom style={{ marginTop: '1rem' }}>
										{supplement.name}
									</Typography.Title>
									{!supplement?.is_calculate ? (
										<div style={{ display: 'block', opacity: 0.75 }}>
											({t('Not included in total amount')})
										</div>
									) : null}
									<Typography.Text type='secondary'>
										{formatCurrency(supplement?.price)} / {transformString(supplement.unit_type)}
									</Typography.Text>
									{supplement.description ? (
										<Typography.Paragraph>{supplement.description}</Typography.Paragraph>
									) : null}
								</Checkbox>
							</Col>
							<Col span={24} md={6}>
								{isPerPerson(supplement) ? (
									<StyledInputNumber
										size='large'
										value={selectedSupplements?.[supplement?.id]}
										disabled={supplement?.is_mandatory}
										onChange={(value) =>
											setSelectedSupplements((prev) => ({ ...prev, [supplement?.id]: value }))
										}
										defaultValue={0}
										min={0}
										addonBefore={
											<button
												onClick={() =>
													setSelectedSupplements((prev) => ({
														...prev,
														[supplement?.id]:
															prev[supplement?.id] > 0 ? prev[supplement?.id] - 1 : 0,
													}))
												}
											>
												-
											</button>
										}
										addonAfter={
											<button
												onClick={() =>
													setSelectedSupplements((prev) => ({
														...prev,
														[supplement?.id]: Number(prev[supplement?.id] || 0) + 1,
													}))
												}
											>
												+
											</button>
										}
										controls={false}
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
