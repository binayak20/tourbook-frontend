import { Switch } from '@/components/atoms';
import { translationKeys } from '@/config/translate/i18next';
import { Popconfirm } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const StatusColumn = ({ value }: { value: boolean }) => {
	const [checked, setChecked] = useState(value ? true : false);
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
