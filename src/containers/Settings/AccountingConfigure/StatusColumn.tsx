import { Switch } from '@/components/atoms';
import { translationKeys } from '@/config/translate/i18next';
import { accountingAPI } from '@/libs/api';
import { message, Popconfirm } from 'antd';
import { FC, useMemo } from 'react';
import { useAccessContext } from 'react-access-boundary';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';

type Props = {
	ID: number;
	status: 'Active' | 'Inactive';
};

export const StatusColumn: FC<Props> = ({ ID, status }) => {
	const { t } = useTranslation();
	const queryClient = useQueryClient();
	const { isAllowedTo } = useAccessContext();

	const isChecked = useMemo(() => status === 'Active', [status]);

	const { mutate, isLoading } = useMutation(() => accountingAPI.updateStatus(ID, !isChecked), {
		onSuccess: () => {
			queryClient.invalidateQueries(['accounting-configs']);
			message.success(t('Accounting configuration has been updated!'));
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
				disabled={!isAllowedTo('CHANGE_ACCOUNTINGSERVICEPROVIDERCONFIGURATION')}
				checkedChildren={t('On')}
				unCheckedChildren={t('Off')}
			/>
		</Popconfirm>
	);
};
