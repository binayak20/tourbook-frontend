import { stationsAPI } from '@/libs/api';
import { Form, message, Modal } from 'antd';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { StationForm } from './StationForm';
import { DEFAULT_LIST_PARAMS } from '@/utils/constants';

type Props = {
	isVisible: boolean;
	setVisible: (isVisible: boolean) => void;
};

export const SettingsStationCreate: FC<Props> = ({ isVisible, setVisible }) => {
	const { t } = useTranslation();
	const queryClient = useQueryClient();
	const [form] = Form.useForm();

	const { data: stationTypes } = useQuery('station-types', () =>
		stationsAPI.types(DEFAULT_LIST_PARAMS)
	);
	const stations = stationTypes?.results;
	const OtherStationId = stations?.find((station) => station.name == 'Other')?.id ||undefined;

	

	const { mutate: handleSubmit, isLoading } = useMutation(
		(values: API.StationPayload) => stationsAPI.create(values),
		{
			onSuccess: () => {
				setVisible(false);
				form.resetFields();
				queryClient.invalidateQueries('stations');
				message.success(t('Station has been created!'));
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
			title={t('Create New Station')}
			open={isVisible}
			footer={false}
			onCancel={() => setVisible(false)}
			width='50%'
		>
			<Form form={form} initialValues={{station_type: OtherStationId} } layout='vertical' size='large' onFinish={handleSubmit}>
				<StationForm isLoading={isLoading} onCancel={() => setVisible(false)} />
			</Form>
		</Modal>
	);
};
