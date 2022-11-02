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
} & Pick<SupplementProps, 'onRemove' | 'onIncrement' | 'onDecrement'> &
	Omit<SupplementsModalProps, 'modalProps' | 'supplements'>;

export const SupplementsPicker: FC<SupplementsPickerProps> = (props) => {
	const { selectedItems, onRemove, onIncrement, onDecrement, ...rest } = props;
	const { t } = useTranslation();
	const [isModalVisible, setModalVisible] = useState(false);

	const modalProps = useMemo(() => {
		return {
			modalProps: {
				open: isModalVisible,
				onCancel: () => setModalVisible(false),
			},
			onCancel: () => setModalVisible(false),
			...rest,
		};
	}, [isModalVisible, rest]);

	return (
		<Wrapper>
			<Typography.Title type='primary' level={5}>
				{t('Supplements Included')}
			</Typography.Title>

			<Row gutter={16}>
				{selectedItems?.map((supplement) => (
					<Col key={supplement.id} span={8}>
						<Supplement
							item={supplement}
							onRemove={onRemove}
							onIncrement={onIncrement}
							onDecrement={onDecrement}
						/>
					</Col>
				))}
				<Col span={8}>
					<AddButton onClick={() => setModalVisible(true)} />
					<SupplementsModal {...modalProps} />
				</Col>
			</Row>
		</Wrapper>
	);
};
