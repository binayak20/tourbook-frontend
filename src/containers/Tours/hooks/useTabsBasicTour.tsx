import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import TourBookingList from '../TourBookingList';
import VehiclePassengerList from '../VehiclePassengerList';
import { Tab, TabsType } from '../types';

export const useTabs = () => {
	const { t } = useTranslation();
	const { id } = useParams() as unknown as { id: number };

	const [activeKey, setActiveKey] = useState<TabsType>(TabsType.DOWNLOAD_BOOKING);

	const items = useMemo(() => {
		return [
			{
				key: TabsType.DOWNLOAD_BOOKING,
				label: t('Bookings'),
				children: <TourBookingList Id={id} />,
			},
			{
				key: TabsType.DOWNLOAD_VEHICLE,
				label: t('Vehicles'),
				children: <VehiclePassengerList Id={id} />,
			},
		] as Tab[];
	}, [t, id]);

	const handleActiveKeyChange = (key: string) => {
		setActiveKey(key as TabsType);
	};

	return {
		activeKey,
		handleActiveKeyChange,
		items,
	};
};
