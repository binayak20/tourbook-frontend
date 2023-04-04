import { Button } from '@/components/atoms';
import { CreateTravelInfo } from '@/libs/api/@types';
import { travelInfoAPI } from '@/libs/api/travelinfoAPI';
import { DEFAULT_LIST_PARAMS } from '@/utils/constants';
import { Col, Form, Input, message, Modal, Row, Select } from 'antd';
import { FC, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

type Props = {
	isVisible: boolean;
	setVisible: (isVisible: boolean) => void;
	travelInfos?: API.TravelInfo[];
	currentTravelInfo?: number;
};

const emptyFormValues = {
	information_text: undefined,
	name: undefined,
	travel_information_type: undefined,
	link: undefined,
};

export const SettingsCreateTravelInformation: FC<Props> = ({
	isVisible,
	setVisible,
	travelInfos,
	currentTravelInfo,
}) => {
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const queryClient = useQueryClient();

	const { isLoading: travelInfoTypeLoading, data } = useQuery(['travel-info-types'], () =>
		travelInfoAPI.getTravelInfoTypeList(DEFAULT_LIST_PARAMS)
	);

	const travelInfo = useMemo(
		() => travelInfos?.find((elem) => elem?.id === currentTravelInfo),
		[currentTravelInfo, travelInfos]
	);

	const informationTypeOptions = useMemo(
		() =>
			data?.results?.map((infoType) => ({
				value: infoType.id,
				label: infoType.name,
			})),
		[data]
	);

	const { mutate: handleSubmit, isLoading } = useMutation(
		(values: CreateTravelInfo) =>
			travelInfo?.id
				? travelInfoAPI.updateTravelInfo(travelInfo?.id, values)
				: travelInfoAPI.createTravelInfo(values),
		{
			onSuccess: () => {
				queryClient.invalidateQueries(['travel-info']);
				form.resetFields();
				message.success(
					travelInfo?.id
						? t('Travel information has been updated!')
						: t('Travel information has been created!')
				);
				setVisible(false);
			},
			onError: (error: Error) => {
				message.error(error.message);
			},
		}
	);

	useEffect(() => {
		if (!travelInfo?.id) form?.setFieldsValue(emptyFormValues);
		else form?.setFieldsValue({ ...travelInfo });
	}, [form, travelInfo]);

	return (
		<Modal
			centered
			maskClosable={false}
			title={travelInfo ? t('Update Travel Information') : t('Create New Travel Information')}
			open={isVisible}
			footer={false}
			onCancel={() => setVisible(false)}
			width='60%'
		>
			<Form form={form} onFinish={handleSubmit} initialValues={travelInfo}>
				<Row gutter={[12, 0]}>
					<Col span={24}>
						<Form.Item label={t('Name')} name='name' labelCol={{ span: 24 }} required>
							<Input />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item
							label={t('Travel information type')}
							name='travel_information_type'
							labelCol={{ span: 24 }}
							required
						>
							<Select
								loading={travelInfoTypeLoading}
								options={informationTypeOptions}
								placeholder={t('Select travel information type')}
							/>
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item label={t('Link')} name='link' labelCol={{ span: 24 }}>
							<Input />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item label={t('Information')} name='information_text' labelCol={{ span: 24 }}>
							<ReactQuill theme='snow' style={{ height: '250px' }} />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Row align='middle' justify='center' className='margin-4-top'>
							<Col span={3}>
								<Button
									block
									type='cancel'
									htmlType='button'
									onClick={() => {
										form?.resetFields();
										setVisible(false);
									}}
								>
									{t('Cancel')}
								</Button>
							</Col>
							<Col span={3} className='margin-4'>
								<Button block type='primary' htmlType='submit' loading={isLoading}>
									{t('Save')}
								</Button>
							</Col>
						</Row>
					</Col>
				</Row>
			</Form>
		</Modal>
	);
};
