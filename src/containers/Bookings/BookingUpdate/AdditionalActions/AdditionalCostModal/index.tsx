import { Modal, ModalProps } from 'antd';
import { FC } from 'react';
import { AdditionalCostForm } from './AdditionalCost';

export const AdditionalCostModal: FC<ModalProps> = (props) => {
	return (
		<Modal centered width={700} footer={false} {...props}>
			<AdditionalCostForm onCancel={props.onCancel} />
		</Modal>
	);
};
