import useConfigurations from '@/components/providers/useConfigurations';
import { settingsAPI } from '@/libs/api';
import { DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Col, FormInstance, Image, message, Row } from 'antd';
import { useWatch } from 'antd/lib/form/Form';
import Upload, { RcFile } from 'antd/lib/upload';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';

const UploadConfigFile = ({
	form,
	fieldName,
}: {
	form: FormInstance;
	fieldName: keyof API.Configuration;
}) => {
	const { t } = useTranslation();
	const { refetch: refetchGlobalConfig } = useConfigurations();
	const watchValue = useWatch(fieldName, form);
	const { mutate: uploadFile } = useMutation(
		({ file, fieldName }: { file: string | Blob | RcFile; fieldName: keyof API.Configuration }) => {
			const formData = new FormData();
			formData.append('field_name', fieldName);
			formData.append('file_object', file);
			return settingsAPI.uploadFile(formData);
		},
		{
			onSuccess: (data, { fieldName }) => {
				form?.setFieldsValue({ [fieldName]: data[fieldName] });
				refetchGlobalConfig();
				message.success(t('Configuration has been updated!'));
			},
			onError: (error: Error) => {
				message.error(error.message);
			},
		}
	);

	const { mutate: removeFile } = useMutation(
		({ fieldName }: { fieldName: keyof API.Configuration }) => {
			const formData = new FormData();
			formData.append('field_name', fieldName);
			formData.append('file_object', '');
			return settingsAPI.uploadFile(formData);
		},
		{
			onSuccess: (data, { fieldName }) => {
				form?.setFieldsValue({ [fieldName]: '' });
				refetchGlobalConfig();
				message.success(t('Configuration has been updated!'));
			},
			onError: (error: Error) => {
				message.error(error.message);
			},
		}
	);

	return (
		<Row gutter={[4, 8]}>
			<Col span={24}>
				<Image style={{ maxWidth: '96px' }} src={watchValue} />
			</Col>
			<Col>
				<Upload
					customRequest={({ file }) => uploadFile({ file: file, fieldName: fieldName })}
					maxCount={1}
					showUploadList={false}
				>
					<Button size='middle' icon={<UploadOutlined />}>
						Upload
					</Button>
				</Upload>
			</Col>
			{watchValue && (
				<Col>
					<Button
						onClick={() => removeFile({ fieldName: fieldName })}
						size='middle'
						icon={<DeleteOutlined />}
					>
						Remove
					</Button>
				</Col>
			)}
		</Row>
	);
};

export default UploadConfigFile;
