import { accountingAPI } from '@/libs/api';
import { Button, Form, Input, message, Modal, Radio, Typography } from 'antd';
import { FC, Fragment, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';

type AccountingConfigureModalProps = {
	data?: API.AccountingConfig;
	providers?: API.AccountingServiceProvider[];
	isModalVisible?: boolean;
	onClose?: () => void;
};

export const AccountingConfigureModal: FC<AccountingConfigureModalProps> = (props) => {
	const { providers, data, isModalVisible, onClose } = props;
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const queryClient = useQueryClient();

	useEffect(() => {
		if (data) {
			form.setFieldsValue(data);
		}
	}, [data, form]);

	const { mutate: handleSubmit, isLoading } = useMutation(
		(payload: API.AccountingConfigCreatePayload) =>
			data
				? accountingAPI.updateConfig(data!.id, {
						...payload,
						accounting_service_provider: data!.accounting_service_provider.id,
				  })
				: accountingAPI.createConfig(payload),
		{
			onSuccess: () => {
				onClose?.();
				queryClient.invalidateQueries(['accounting-configs']);
				queryClient.invalidateQueries(['accounting-unconfigured-providers']);
				message.success(
					t(`Accounting provider configuration has been ${data ? 'updated' : 'created'}!`)
				);
			},
			onError: (error: Error) => {
				message.error(error.message);
			},
		}
	);

	return (
		<Modal
			title={t(data ? 'Update accounting provider' : 'Add accounting provider')}
			open={isModalVisible}
			onCancel={onClose}
			footer={false}
			maskClosable={false}
			bodyStyle={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}
			afterClose={() => form.resetFields()}
		>
			<Form form={form} size='large' labelAlign='left' layout='vertical' onFinish={handleSubmit}>
				{data ? (
					<Fragment>
						<Typography.Text>{t('Accounting provider')}</Typography.Text>
						<Typography.Paragraph strong>
							{data?.accounting_service_provider?.name}
						</Typography.Paragraph>
					</Fragment>
				) : (
					<Form.Item
						label={t('Accounting providers')}
						name='accounting_service_provider'
						rules={[{ required: true, message: t('This field is required!') }]}
					>
						<Radio.Group>
							{providers?.map(({ id, name }) => (
								<Radio key={id} value={id}>
									{name}
								</Radio>
							))}
						</Radio.Group>
					</Form.Item>
				)}
				<Form.Item label={t('Invoice payment account')} name='invoice_payment_account'>
					<Input />
				</Form.Item>
				<Form.Item label={t('Voucher series')} name='voucher_series'>
					<Input />
				</Form.Item>
				<Button htmlType='submit' type='primary' loading={isLoading}>
					{t('Save changes')}
				</Button>
			</Form>
		</Modal>
	);
};
