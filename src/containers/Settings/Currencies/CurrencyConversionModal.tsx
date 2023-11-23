import { currenciesAPI } from '@/libs/api';
import { CurrencyConversation, CurrencyConversationCreatePayload } from '@/libs/api/@types';
import { useStoreSelector } from '@/store';
import { DEFAULT_LIST_PARAMS } from '@/utils/constants';
import { Button, Form, Input, Modal, Select, message } from 'antd';
import { FC, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from 'react-query';

type Props = {
	data?: CurrencyConversation;
	isVisible: boolean;
	onHide: () => void;
};

export const CurrencyConversionModal: FC<Props> = (props) => {
	const { data, isVisible, onHide } = props;
	const { t } = useTranslation();
	const queryClient = useQueryClient();
	const [form] = Form.useForm();
	const { currencyID } = useStoreSelector((state) => state.app);
	const [fromSelectID, setFromSelectID] = useState<number>(currencyID);
	const [toSelectID, setToSelectID] = useState<number>();

	useEffect(() => {
		if (data) {
			form.setFieldsValue({
				currency_from: data.currency_from.id,
				currency_to: data.currency_to.id,
				exchange_rate: data.exchange_rate,
			});
			setFromSelectID(data.currency_from.id);
			setToSelectID(data.currency_to.id);
		}
	}, [data, form]);

	const { data: currencies, isLoading: isCurrenciesLoading } = useQuery(['currencies'], () =>
		currenciesAPI.list(DEFAULT_LIST_PARAMS)
	);

	const handleCancel = useCallback(() => {
		onHide();
		form.resetFields();
	}, [form, onHide]);

	const { mutate: handleSubmit, isLoading } = useMutation(
		(payload: CurrencyConversationCreatePayload) =>
			data
				? currenciesAPI.updateCurrencyConversation(data.id, payload)
				: currenciesAPI.createCurrencyConversation(payload),
		{
			onSuccess: () => {
				handleCancel();
				queryClient.invalidateQueries('currencyConversations');
				message.success(t(`Currency conversion has been ${data ? 'updated' : 'created'}!`));
			},
			onError: (error: Error) => {
				message.error(error.message);
			},
		}
	);

	return (
		<Modal
			centered
			maskClosable={false}
			title={t(`${data ? 'Update' : 'Create new'} conversion`)}
			open={isVisible}
			footer={false}
			onCancel={handleCancel}
		>
			<Form
				initialValues={{
					currency_from: currencyID,
				}}
				form={form}
				layout='vertical'
				size='large'
				onFinish={handleSubmit}
			>
				<Form.Item
					label={t('From currency')}
					name='currency_from'
					rules={[{ required: true, message: t('From currency is required!') }]}
				>
					<Select
						disabled
						placeholder={t('Please choose an option')}
						options={currencies?.results?.map((e) => ({
							value: e.id,
							label: e.currency_code,
							disabled: e.id === toSelectID,
						}))}
						onChange={(value) => setFromSelectID(value as number)}
						loading={isCurrenciesLoading}
					/>
				</Form.Item>
				<Form.Item
					label={t('To currency')}
					name='currency_to'
					rules={[{ required: true, message: t('To currency is required!') }]}
				>
					<Select
						disabled={data ? true : false}
						placeholder={t('Please choose an option')}
						options={currencies?.results?.map((e) => ({
							value: e.id,
							label: e.currency_code,
							disabled: e.id === fromSelectID,
						}))}
						onChange={(value) => setToSelectID(value as number)}
						loading={isCurrenciesLoading}
					/>
				</Form.Item>
				<Form.Item
					label={t('Conversion rate')}
					name='exchange_rate'
					rules={[{ required: true, message: t('Conversion rate is required!') }]}
				>
					<Input type='number' />
				</Form.Item>
				<Button type='primary' htmlType='submit' loading={isLoading}>
					{t(data ? 'Update' : 'Create')}
				</Button>
			</Form>
		</Modal>
	);
};
