import { Typography } from '@/components/atoms';
import { logsAPI } from '@/libs/api/logsAPI';
import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import ReactJson from 'react-json-view';
import { useQuery } from 'react-query';

type EmailLogDeailModal = {
	visiblity: boolean;
	setVisiblity: (args: boolean) => void;
	emailLogId: number | null;
	companyID?: number;
};

function EmailLogDetail({ visiblity, setVisiblity, emailLogId }: EmailLogDeailModal) {
	const { t } = useTranslation();

	const handleCancel = () => {
		setVisiblity(false);
	};

	const { data, isLoading } = useQuery(
		['email-log-detail', emailLogId],
		() => logsAPI.singleEmailLog(emailLogId),
		{ enabled: emailLogId ? true : false }
	);

	//	console.log('email logs :', data);

	return (
		<Modal
			visible={visiblity}
			title={
				<Typography.Title
					level={4}
					type='primary'
					style={{ textAlign: 'center', marginBottom: '' }}
				>
					{t('Email log Detail')}
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

export default EmailLogDetail;
