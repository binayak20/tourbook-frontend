import { paymentConfigsAPI } from '@/libs/api';
import { useTableFilters } from '@/libs/hooks';
import { DEFAULT_LIST_PARAMS } from '@/utils/constants';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Form as AntForm, Button, Col, Input, Row, Select } from 'antd';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueries } from 'react-query';
import styled from 'styled-components';

const TRANSACTION_STATUS = [
	{ value: 'success', label: 'Success' },
	{ value: 'pending', label: 'Pending' },
];

export const FilterTransactions = () => {
	const { t } = useTranslation();
	const [form] = AntForm.useForm();

	const { handleFilterChange, handleFilterChnageDebounced, handleFilterReset } = useTableFilters({
		initialValues: {
			name: '',
			status: undefined,
			payment_method: undefined,
			booking_reference: '',
		},
		form,
	});

	const [{ data: paymentConfigurations }] = useQueries([
		{
			queryKey: ['paymentConfigurations'],
			queryFn: () => paymentConfigsAPI.paymentConfigurations(DEFAULT_LIST_PARAMS),
		},
	]);

	const paymentMethodOptions = useMemo(() => {
		return (paymentConfigurations?.results || []).map((config) => {
			return { value: config.payment_method.id.toString(), label: config.payment_method.name };
		});
	}, [paymentConfigurations]);

	const handleValuesChange = useCallback(
		(value: Record<string, unknown>) => {
			if (Object.keys(value).includes('name') || Object.keys(value).includes('booking_reference')) {
				handleFilterChnageDebounced(value);
			} else {
				handleFilterChange(value);
			}
		},
		[handleFilterChange, handleFilterChnageDebounced]
	);

	return (
		<Form
			form={form}
			size='large'
			layout='vertical'
			// onFinish={(values) => handleSubmit(values as API.TransactionsParams)}
			onValuesChange={handleValuesChange}
		>
			<Row gutter={12} wrap={true}>
				<Col flex='auto'>
					<Row gutter={12}>
						<Col span={6}>
							<Form.Item name='name'>
								<Input
									allowClear
									placeholder={t('Search by customer name')}
									prefix={<SearchOutlined />}
								/>
							</Form.Item>
						</Col>
						<Col span={6}>
							<Form.Item name='booking_reference'>
								<Input
									allowClear
									placeholder={t('Search by Booking Ref')}
									prefix={<SearchOutlined />}
								/>
							</Form.Item>
						</Col>
						<Col span={6}>
							<Form.Item name='status'>
								<Select allowClear options={TRANSACTION_STATUS} placeholder={t('Status')} />
							</Form.Item>
						</Col>
						<Col span={6}>
							<Form.Item name='payment_method'>
								<Select
									allowClear
									options={paymentMethodOptions}
									placeholder={t('Payment method')}
								/>
							</Form.Item>
						</Col>
					</Row>
				</Col>
				<Col>
					{/* <Button ghost type='primary' htmlType='submit'>
						<SearchOutlined />
					</Button> */}
					<Button ghost type='primary' onClick={handleFilterReset}>
						<ReloadOutlined />
					</Button>
				</Col>
			</Row>
		</Form>
	);
};

const Form = styled(AntForm)`
	.ant {
		&-form {
			&-item {
				margin-bottom: 0;
			}
		}
	}
`;
