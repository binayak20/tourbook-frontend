import { stationsAPI } from '@/libs/api';
import { Card, Form, message, Modal, theme } from 'antd';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { StationForm } from './StationForm';

type Props = {
	id: number;
	isVisible: boolean;
	setVisible: (isVisible: boolean) => void;
	clearId: () => void;
};

export const SettingsStationUpdate: FC<Props> = ({ isVisible, setVisible, id, clearId }) => {
	const { t } = useTranslation();
	const queryClient = useQueryClient();
	const { token } = theme.useToken();
	const { data, isLoading } = useQuery(['settings-station', id], () => stationsAPI.getOne(id!), {
		enabled: !!id,
		staleTime: Infinity,
		cacheTime: 0,
	});

	const handleCancel = () => {
		setVisible(false);
		clearId();
	};

	const { mutate: handleSubmit, isLoading: isSubmitLoading } = useMutation(
		(values: API.StationPayload) => stationsAPI.update(id, values),
		{
			onSuccess: () => {
				setVisible(false);
				queryClient.invalidateQueries('stations');
				message.success(t('Station has been updated!'));
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
			title={t('Edit Station')}
			open={isVisible}
			footer={false}
			onCancel={() => setVisible(false)}
			width='50%'
		>
			<Card
				loading={isLoading}
				bordered={false}
				style={{
					boxShadow: 'none',
				}}
				bodyStyle={{ padding: 0, backgroundColor: token.colorBgElevated }}
			>
				<Form
					name='Station Update Form'
					layout='vertical'
					size='large'
					initialValues={{ ...data, station_type: data?.station_type?.id }}
					onFinish={handleSubmit}
				>
					<StationForm isLoading={isSubmitLoading} onCancel={handleCancel} />
				</Form>
			</Card>
		</Modal>
	);
};
