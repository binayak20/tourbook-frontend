/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Form as AntForm, Button, Col, DatePicker, Input, Row, Space, Tooltip } from 'antd';
import moment from 'moment';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

export const FilterTable = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const { RangePicker } = DatePicker;
	const [form] = AntForm.useForm();

	useEffect(() => {
		form.setFieldsValue({
			coupon_code: searchParams.get('coupon_code') || undefined,
			validity: [
				searchParams.get('coupon_valid_form')
					? moment(searchParams.get('coupon_valid_form'))
					: undefined,
				searchParams.get('coupon_valid_to')
					? moment(searchParams.get('coupon_valid_to'))
					: undefined,
			],
		});
	}, [form, searchParams]);

	const handleReset = useCallback(() => {
		form.resetFields();
		navigate('');
	}, [form, navigate]);

	const handleSearchOrFilter = (key: string, value: string) => {
		searchParams.delete('page');
		searchParams.delete('limit');
		if (value === undefined || value === '') {
			searchParams.delete(key);
		} else {
			searchParams.set(key, value);
		}
		navigate({ search: searchParams.toString() });
	};

	return (
		<Form
			form={form}
			size='large'
			layout='vertical'
			onFinish={(values: any) => {
				handleSearchOrFilter('coupon_code', values?.coupon_code);
			}}
		>
			<Row gutter={12}>
				<Col style={{ width: 'calc(100% - 125px)' }}>
					<Row gutter={12}>
						<Col span={6}>
							<Form.Item name='coupon_code'>
								<Input placeholder={t('Code')} />
							</Form.Item>
						</Col>
						<Col span={'auto'}>
							<Space>
								<Form.Item name='validity'>
									<RangePicker
										placeholder={[t('Valid from'), t('Valid to')]}
										size='large'
										format={['YYYY-MM-DD', 'YYYYMMDD', 'YYMMDD', 'YYYY/MM/DD']}
										onChange={(dates) => {
											console.log(dates);
											handleSearchOrFilter(
												'coupon_valid_form',
												dates
													? (dates[0]?.startOf('day').format('YYYY-MM-DDTHH:mm:ss[Z]') as string)
													: ''
											);
											handleSearchOrFilter(
												'coupon_valid_to',
												dates
													? (dates[1]?.startOf('day').format('YYYY-MM-DDTHH:mm:ss[Z]') as string)
													: ''
											);
										}}
									/>
								</Form.Item>
							</Space>
						</Col>
					</Row>
				</Col>
				<Col>
					<Tooltip title={t('Search')} placement='bottom'>
						<Button ghost type='primary' htmlType='submit'>
							<SearchOutlined />
						</Button>
					</Tooltip>
					<Tooltip title={t('Reset')} placement='bottom'>
						<Button ghost type='primary' style={{ marginLeft: 12 }} onClick={handleReset}>
							<ReloadOutlined />
						</Button>
					</Tooltip>
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
