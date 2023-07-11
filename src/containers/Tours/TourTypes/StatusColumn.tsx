import { Switch } from '@/components/atoms';
import { translationKeys } from '@/config/translate/i18next';
import { toursAPI } from '@/libs/api';
import { message, Popconfirm } from 'antd';
import { FC, useState } from 'react';
import { useAccessContext } from 'react-access-boundary';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';

type Props = {
	id: number;
	status: 'Active' | 'Inactive';
};

export const StatusColumn: FC<Props> = ({ status, id }) => {
	const [isChecked, setChecked] = useState(status === 'Active');
	const { t } = useTranslation();
	const queryClient = useQueryClient();
	const { isAllowedTo } = useAccessContext();

	const { mutate, isLoading } = useMutation(() => toursAPI.updateTourTypeStatus(id, !isChecked), {
		onSuccess: () => {
			setChecked((prev) => !prev);
			queryClient.invalidateQueries(['tourTypes']);
			message.success(t('Tour template status has been updated!'));
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
				disabled={!isAllowedTo('CHANGE_TOURTYPE')}
				checkedChildren={t('On')}
				unCheckedChildren={t('Off')}
			/>
		</Popconfirm>
	);
};
