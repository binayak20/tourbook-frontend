import { toursAPI } from '@/libs/api';
import { FormInstance } from 'antd/lib/form';
import moment from 'moment';
import { useQuery } from 'react-query';

type useTFUpdateProps = {
	form: FormInstance;
	id?: number;
	mode?: 'create' | 'update';
	supplementsCallback: (supplements: API.Supplement[]) => void;
	countriesCallback: (territory: number) => void;
	locationsCallback: ({ territory, country }: { territory: number; country: number }) => void;
	stationsCallback: (type: number) => void;
	capacityCallback: (capacity: number) => void;
	reservedCallback: (reserved: boolean) => void;
};

export const useTFUpdate = ({
	form,
	id,
	mode,
	supplementsCallback,
	countriesCallback,
	locationsCallback,
	stationsCallback,
	capacityCallback,
	reservedCallback,
}: useTFUpdateProps) => {
	return useQuery(['tourType'], () => toursAPI.tour(id!), {
		enabled: !!id && mode === 'update',
		onSuccess: (data) => {
			if (data && Object.entries(data).length) {
				const mappedValues = (Object.keys(data) as Array<keyof API.Tour>).reduce((acc, key) => {
					if (
						key === 'vehicles' ||
						key === 'supplements' ||
						key === 'accommodations' ||
						key === 'stations'
					) {
						if (key === 'supplements') {
							supplementsCallback(data[key] as unknown as API.Supplement[]);
						} else {
							acc[key] = data[key].map(({ id }) => id);
						}
					} else if (
						key === 'tour_type' ||
						key === 'territory' ||
						key === 'country' ||
						key === 'location' ||
						key === 'currency' ||
						// key === 'tour_type_category' ||
						key === 'fortnox_cost_center' ||
						key === 'station_type'
					) {
						const value = data[key].id;
						if (key === 'territory' && value) {
							countriesCallback(value);
						} else if (key === 'country' && value) {
							const territory = data.territory.id;
							locationsCallback({ territory, country: value });
						} else if (key === 'station_type' && value) {
							stationsCallback(value);
						}

						acc[key] = value;
					} else if (key === 'capacity') {
						capacityCallback(data[key]);
					} else if (key === 'is_reserved') {
						reservedCallback(data[key] as boolean);
						acc[key] = data[key];
					} else if (key === 'departure_date') {
						acc[key] = moment(data[key]) as unknown as string;
					} else if (key === 'return_date') {
						acc[key] = moment(data[key]) as unknown as string;
					} else if (key === 'reservation_expiry_date') {
						acc[key] = moment(data[key]) as unknown as string;
					} else {
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-ignore
						acc[key] = data[key];
					}

					return acc;
				}, {} as Omit<API.TourCreatePayload, 'capacity' | 'supplements'>);

				form.setFieldsValue(mappedValues);
			}
		},
	});
};
