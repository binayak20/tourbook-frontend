import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
// import { TourCreate } from '../TourCreate';
// import { TourDetails } from '../TourDetails/TourDetails';
import { Tab, TabsType } from '../types';

export const useTabs = () => {
	const { t } = useTranslation();
	const [activeKey, setActiveKey] = useState<TabsType>(TabsType.TOUR_BASICS);

	const items = useMemo(() => {
		return [
			{
				key: TabsType.DOWNLOAD_BOOKING,
				label: t('Bookings'),
				//	children: <TourCreate mode='update' />,
			},
			{
				key: TabsType.DOWNLOAD_VEHICLE,
				label: t('Vehicle'),
				//children: <TourDetails />,
			},
		] as Tab[];
	}, [t]);

	const handleActiveKeyChange = (key: string) => {
		setActiveKey(key as TabsType);
	};

	return {
		activeKey,
		handleActiveKeyChange,
		items,
	};
};
