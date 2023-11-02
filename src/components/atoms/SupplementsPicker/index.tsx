import { Col, Row } from 'antd';
import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '../Typography';
import { AddButton } from './AddButton';
import { Supplement, SupplementProps } from './Supplement';
import { SupplementsModal, SupplementsModalProps } from './SupplementsModal';
import { Wrapper } from './styles';

export type SupplementsPickerProps = {
	items?: API.Supplement[];
	selectedItems?: (API.Supplement & { selectedquantity: number })[];
	colSize?: number;
	onClearList?: () => void;
	disabled?: boolean;
	refetchItems?: () => void;
	onUpdateSupplementPrice?: (ID: number, price: number) => void;
	currencyCode?: string;
} & Pick<SupplementProps, 'onRemove' | 'onIncrement' | 'onDecrement' | 'isBooking'> &
	Omit<SupplementsModalProps, 'modalProps' | 'supplements'>;

export const SupplementsPicker: FC<SupplementsPickerProps> = (props) => {
	const {
		selectedItems,
		onRemove,
		onIncrement,
		onDecrement,
		colSize = 8,
		onClearList,
		disabled,
		isBooking,
		onUpdateSupplementPrice,
		currencyCode,
		...rest
	} = props;
	const { t } = useTranslation();
	const [isModalVisible, setModalVisible] = useState(false);

	const modalProps = useMemo(() => {
		return {
			modalProps: {
				open: isModalVisible,
			},
			onCancel: () => {
				onClearList?.();
				setModalVisible(false);
			},
			...rest,
		};
	}, [isModalVisible, onClearList, rest]);

	return (
		<Wrapper>
			<Typography.Title level={5}>{t('Supplements Included')}</Typography.Title>
			<Row gutter={16}>
				{selectedItems?.map((supplement) => (
					<Col key={supplement.id} span={colSize}>
						<Supplement
							{...{
								item: supplement,
								onRemove,
								onIncrement,
								onDecrement,
								disabled,
								isBooking,
								onUpdateSupplementPrice,
								currencyCode,
							}}
						/>
					</Col>
				))}
				<Col span={colSize}>
					<AddButton disabled={disabled} onClick={() => setModalVisible(true)} />
					<SupplementsModal {...modalProps} />
				</Col>
			</Row>
		</Wrapper>
	);
};
