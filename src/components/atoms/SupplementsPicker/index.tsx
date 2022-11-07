import { Col, Row } from 'antd';
import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '../Typography';
import { AddButton } from './AddButton';
import { Wrapper } from './styles';
import { Supplement, SupplementProps } from './Supplement';
import { SupplementsModal, SupplementsModalProps } from './SupplementsModal';

export type SupplementsPickerProps = {
	items?: API.Supplement[];
	selectedItems?: (API.Supplement & { selectedquantity: number })[];
	colSize?: number;
	onClearList?: () => void;
} & Pick<SupplementProps, 'onRemove' | 'onIncrement' | 'onDecrement'> &
	Omit<SupplementsModalProps, 'modalProps' | 'supplements'>;

export const SupplementsPicker: FC<SupplementsPickerProps> = (props) => {
	const {
		selectedItems,
		onRemove,
		onIncrement,
		onDecrement,
		colSize = 8,
		onClearList,
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
							item={supplement}
							onRemove={onRemove}
							onIncrement={onIncrement}
							onDecrement={onDecrement}
						/>
					</Col>
				))}
				<Col span={colSize}>
					<AddButton onClick={() => setModalVisible(true)} />
					<SupplementsModal {...modalProps} />
				</Col>
			</Row>
		</Wrapper>
	);
};
