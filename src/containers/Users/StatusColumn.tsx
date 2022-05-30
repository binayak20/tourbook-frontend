import { Switch } from '@/components/atoms';
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
			title={`Are you sure to ${checked ? 'deactivate' : 'active'}?`}
			onConfirm={handleStatusChange}
			okText='Yes'
			cancelText='No'
		>
			<Switch custom checked={checked} checkedChildren={t('On')} unCheckedChildren={t('Off')} />
		</Popconfirm>
	);
};
