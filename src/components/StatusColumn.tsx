import { Switch } from '@/components/atoms';
import { translationKeys } from '@/config/translate/i18next';
import { commonAPI } from '@/libs/api';
import { message, Popconfirm } from 'antd';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';

type Props = {
	endpoint: API.UpdateStausRequest['endpoint'];
	id: API.UpdateStausRequest['id'];
	status: API.UpdateStausRequest['payload']['is_active'];
};

export const StatusColumn: FC<Props> = ({ status, id, endpoint }) => {
	console.log(status);
	const [isChecked, setChecked] = useState(status ? true : false);
	const { t } = useTranslation();

	const { mutate, isLoading } = useMutation(
		() =>
			commonAPI.updateStatus({
				endpoint,
				id,
				payload: {
					is_active: !isChecked,
				},
			}),
		{
			onSuccess: () => {
				setChecked((prev) => !prev);
				message.success(t('Status has been updated'));
			},
			onError: (error: Error) => {
				message.error(error.message);
			},
		}
	);

	const handleChange = () => mutate();

	return (
		<Popconfirm
			placement='leftTop'
			title={t(`Are you sure to ${isChecked ? 'deactive' : 'active'}?` as translationKeys)}
			onConfirm={handleChange}
			okText={t('Yes')}
			cancelText={t('No')}
			disabled={isLoading}
		>
			<Switch custom checked={isChecked} checkedChildren={t('On')} unCheckedChildren={t('Off')} />
		</Popconfirm>
	);
};
