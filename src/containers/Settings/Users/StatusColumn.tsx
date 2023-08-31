import { Switch } from '@/components/atoms';
import { translationKeys } from '@/config/translate/i18next';
import { usersAPI } from '@/libs/api';
import { message, Popconfirm } from 'antd';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';

type Props = {
	id: number;
	status: 'Active' | 'Inactive';
	successMessage?: translationKeys;
	isDisabled?: boolean;
};

export const StatusColumn: FC<Props> = ({ status, id, successMessage, isDisabled }) => {
	const [isChecked, setChecked] = useState(status === 'Active');
	const { t } = useTranslation();
	const queryClient = useQueryClient();

	const { mutate, isLoading } = useMutation(() => usersAPI.updateUserStatus(id, !isChecked), {
		onSuccess: () => {
			setChecked((prev) => !prev);
			queryClient.invalidateQueries(['settings-users']);
			message.success(t(successMessage ?? 'Status has been updated'));
		},
		onError: (error: Error) => {
			message.error(error.message);
		},
	});

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
			<Switch
				custom
				checked={isChecked}
				disabled={isDisabled}
				checkedChildren={t('On')}
				unCheckedChildren={t('Off')}
			/>
		</Popconfirm>
	);
};
