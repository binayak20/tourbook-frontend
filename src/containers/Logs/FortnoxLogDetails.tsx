import { Typography } from '@/components/atoms';
import { logsAPI } from '@/libs/api';
import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import ReactJson from 'react-json-view';
import { useQuery } from 'react-query';

type FrotnoxLogDetailModal = {
	visiblity: boolean;
	setVisiblity: (args: boolean) => void;
	fortnoxLogId: number | null;
};

function FrotnoxLogDetail({ visiblity, setVisiblity, fortnoxLogId }: FrotnoxLogDetailModal) {
	const { t } = useTranslation();

	const handleCancel = () => {
		setVisiblity(false);
	};

	const { data, isLoading } = useQuery(
		['fortnox-log-detail', fortnoxLogId],
		() => logsAPI.singleFortnoxLog(fortnoxLogId),
		{ enabled: fortnoxLogId ? true : false }
	);

	return (
		<Modal
			open={visiblity}
			title={
				<Typography.Title
					level={4}
					type='primary'
					style={{ textAlign: 'center', marginBottom: '' }}
				>
					{t('Fortnox log detail')}
				</Typography.Title>
			}
			onCancel={handleCancel}
			width={'80%'}
			centered={true}
			footer={false}
			bodyStyle={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}
		>
			{!isLoading && (
				<ReactJson style={{ wordBreak: 'break-all' }} src={data as object} theme='monokai' />
			)}
		</Modal>
	);
}

export default FrotnoxLogDetail;
