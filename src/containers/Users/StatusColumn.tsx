import { Switch } from '@/components/atoms';
import { translationKeys } from '@/config/translate/i18next';
import { Popconfirm } from 'antd';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DataType } from '.';

export const StatusColumn: FC<DataType> = ({ status }) => {
	const [checked, setChecked] = useState(status === 'Active');
	const { t } = useTranslation();

	const handleStatusChange = () => {
		setChecked((prev) => !prev);
	};

	return (
		<Popconfirm
			placement='leftTop'
			title={t(`Are you sure to ${checked ? 'deactive' : 'active'}?` as translationKeys)}
			onConfirm={handleStatusChange}
			okText={t('Yes')}
			cancelText={t('No')}
		>
			<Switch custom checked={checked} checkedChildren={t('On')} unCheckedChildren={t('Off')} />
		</Popconfirm>
	);
};
