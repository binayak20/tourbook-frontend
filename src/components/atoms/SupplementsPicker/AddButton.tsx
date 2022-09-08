import { PlusOutlined } from '@ant-design/icons';
import { Avatar, ButtonProps } from 'antd';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { AddBtnWrapper } from './styles';

export const AddButton: FC<ButtonProps> = (props) => {
	const { t } = useTranslation();

	return (
		<AddBtnWrapper {...props}>
			<Avatar size={42} icon={<PlusOutlined />} />
			{t('Add supplement')}
		</AddBtnWrapper>
	);
};
