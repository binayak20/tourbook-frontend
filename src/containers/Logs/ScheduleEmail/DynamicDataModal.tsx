import { Typography } from '@/components/atoms';
import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import ReactJson from 'react-json-view';

type DynamicDataModalProps = {
	visiblity: boolean;
	setVisiblity: (args: boolean) => void;
	dynamicData: API.DynamicData | null;
};

function DynamicDataModal({ visiblity, setVisiblity, dynamicData }: DynamicDataModalProps) {
	const { t } = useTranslation();

	const handleCancel = () => {
		setVisiblity(false);
	};

	return (
		<Modal
			open={visiblity}
			title={
				<Typography.Title
					level={4}
					type='primary'
					style={{ textAlign: 'center', marginBottom: '' }}
				>
					{t('Dynamic data')}
				</Typography.Title>
			}
			onCancel={handleCancel}
			width={'80%'}
			centered={true}
			footer={false}
			bodyStyle={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}
		>
			{dynamicData && <ReactJson src={dynamicData as object} theme='monokai' />}
		</Modal>
	);
}

export default DynamicDataModal;
