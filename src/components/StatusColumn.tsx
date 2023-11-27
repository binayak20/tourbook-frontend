import { Switch } from '@/components/atoms';
import { translationKeys } from '@/config/translate/i18next';
import { commonAPI } from '@/libs/api';
import { message, Popconfirm } from 'antd';
import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';

type Props = {
	endpoint: API.UpdateStausRequest['endpoint'];
	id: API.UpdateStausRequest['id'];
	recordType?: 'is_active' | 'is_available';
	status: boolean;
	successMessage?: translationKeys;
	onSuccessFn?: () => void;
	isDisabled?: boolean;
};

export const StatusColumn: FC<Props> = ({
	status,
	id,
	endpoint,
	onSuccessFn,
	successMessage,
	isDisabled,
	recordType = 'is_active',
}) => {
	const [isChecked, setChecked] = useState(false);
	const { t } = useTranslation();

	useEffect(() => {
		if (typeof status === 'boolean') {
			setChecked(status);
		}
	}, [status]);

	const { mutate, isLoading } = useMutation(
		() =>
			commonAPI.updateStatus({
				endpoint,
				id,
				recordType,
				payload: {
					[recordType]: !isChecked,
				},
			}),
		{
			onSuccess: () => {
				setChecked((prev) => !prev);
				onSuccessFn?.();
				message.success(
					recordType === 'is_active'
						? t(successMessage ?? `Status has been updated`)
						: t('Availability has been updated')
				);
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
			title={t(
				`Do you really want to ${isChecked ? 'deactivate' : 'activate'}?` as translationKeys
			)}
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
