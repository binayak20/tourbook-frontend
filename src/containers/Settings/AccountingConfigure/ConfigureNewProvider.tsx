import { accountingAPI } from '@/libs/api';
import { Form, message, Modal, ModalProps, Select } from 'antd';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useConfigureFortnox } from './hooks/useConfigureFortnox';

export const ConfigureNewProvider: React.FC<ModalProps> = (props) => {
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const { handleConfigureFortnox } = useConfigureFortnox();

	const { data } = useQuery(
		'accounting-unconfigured-providers',
		() => accountingAPI.unconfiguredProviders(),
		{
			enabled: props?.open,
			onSuccess: (data) => {
				if (!data?.length) {
					message.error(t('No accounting providers available!'));
				}
			},
		}
	);

	const handleOk = useCallback(() => {
		const { provider } = form.getFieldsValue();
		if (provider === 1) {
			handleConfigureFortnox();
		}
	}, [form, handleConfigureFortnox]);

	return (
		<Modal {...props} onOk={handleOk}>
			<Form form={form} labelAlign='left' layout='vertical' size='large'>
				<Form.Item
					label='Provider'
					name='provider'
					rules={[{ required: true, message: t('Accounting provider is required!') }]}
					style={{ marginBottom: 0 }}
				>
					<Select
						size='large'
						style={{ width: '100%' }}
						placeholder='Select an option'
						options={
							data?.map(({ id, name }) => ({
								label: name,
								value: id,
							})) || []
						}
					/>
				</Form.Item>
			</Form>
		</Modal>
	);
};
