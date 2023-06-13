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
	reservedCallback,
}: useTFUpdateProps) => {
	return useQuery(['tour'], () => toursAPI.tour(id!), {
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
						key === 'category' ||
						key === 'tour_tag' ||
						key === 'fortnox_cost_center' ||
						key === 'station_type' ||
						key === 'fortnox_project' ||
						key === 'travel_information'
					) {
						const value = data?.[key]?.id;

						if (value) {
							if (key === 'territory' && value) {
								countriesCallback(value);
							} else if (key === 'country' && value) {
								const territory = data.territory.id;
								locationsCallback({ territory, country: value });
							} else if (key === 'station_type' && value) {
								stationsCallback(value);
							}

							acc[key] = value;
						}
					} else if (key === 'is_reserved') {
						reservedCallback(data[key] as boolean);
						acc[key] = data[key];
					} else if (key === 'departure_date' && data[key]) {
						acc[key] = moment(data[key]) as unknown as string;
					} else if (key === 'return_date' && data[key]) {
						acc[key] = moment(data[key]) as unknown as string;
					} else if (key === 'reservation_expiry_date' && data[key]) {
						acc[key] = moment(data[key]) as unknown as string;
					} else {
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-ignore
						acc[key] = data[key];
					}

					return acc;
				}, {} as Omit<API.TourCreatePayload, 'supplements'>);

				form.setFieldsValue(mappedValues);
			}
		},
	});
};
