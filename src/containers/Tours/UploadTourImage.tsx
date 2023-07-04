import { Button } from '@/components/atoms';
import { toursAPI } from '@/libs/api';
import { DeleteOutlined, PictureOutlined, UploadOutlined } from '@ant-design/icons';
import { Col, FormInstance, Row, Upload, message } from 'antd';
import { RcFile } from 'antd/lib/upload';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';

const UploadTourImage = ({ form }: { form: FormInstance }) => {
	const { t } = useTranslation();
	const id = useParams<{ id: string }>()?.id;
	const queryClient = useQueryClient();

	const images = useQuery('tour-images', () => toursAPI.images(Number(id)));

	const { mutate: uploadFile } = useMutation(
		({ file }: { file: string | Blob | RcFile }) => {
			const formData = new FormData();
			formData.append('field_name', 'image');
			formData.append('file_object', file);
			return toursAPI.uploadFile(Number(id), formData);
		},
		{
			onSuccess: (data) => {
				form?.setFieldsValue({ image: data?.image });
				message.success(t('Image has been uploaded!'));
				queryClient.invalidateQueries('tour-images');
			},
			onError: (error: Error) => {
				message.error(error.message);
			},
		}
	);

	const { mutate: handleRemoveImage } = useMutation(
		(imageId: number) => toursAPI.removeImages(Number(id), imageId),
		{
			onSuccess: (data) => {
				message.success(data?.detail);
				queryClient.invalidateQueries('tour-images');
			},
			onError: (error: Error) => {
				message.error(error.message);
			},
		}
	);

	const { mutate: handleSetmainImage } = useMutation(
		(imageId: number) => toursAPI.setMainImage(Number(id), imageId),
		{
			onSuccess: (data) => {
				message.success(data?.detail);
				queryClient.invalidateQueries('tour-images');
			},
			onError: (error: Error) => {
				message.error(error.message);
			},
		}
	);

	return (
		<Row gutter={[16, 16]}>
			{images?.data?.map((image, index) => (
				<Col key={index} span={4} className='image-overlay'>
					<img src={image?.image} alt='tour-image' style={{ width: '100%' }} />
					<div className='overlay'>
						{image?.is_main_image ? null : (
							<Button
								type='primary'
								icon={<PictureOutlined />}
								onClick={() => handleSetmainImage(image?.id)}
							/>
						)}
						<Button
							type='primary'
							danger
							icon={<DeleteOutlined />}
							onClick={() => handleRemoveImage(image?.id)}
						/>
					</div>
				</Col>
			))}
			<Col span={24}>
				<Upload
					customRequest={({ file }) => uploadFile({ file })}
					multiple={true}
					showUploadList={false}
					accept='image/*'
				>
					<Button icon={<UploadOutlined />}>{t('Upload')}</Button>
				</Upload>
			</Col>
		</Row>
	);
};

export default UploadTourImage;
