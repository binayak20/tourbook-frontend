import { toursAPI } from '@/libs/api';
import { FormInstance } from 'antd/lib/form';
import { useQuery } from 'react-query';

type useTTFUpdateProps = {
	form: FormInstance;
	id?: number;
	mode?: 'create' | 'update';
	supplementsCallback: (supplements: API.Supplement[]) => void;
	countriesCallback: (territory: number) => void;
	locationsCallback: ({ territory, country }: { territory: number; country: number }) => void;
	stationsCallback: (type: number) => void;
};

export const useTTFUpdate = ({
	form,
	id,
	mode,
	supplementsCallback,
	countriesCallback,
	locationsCallback,
	stationsCallback,
}: useTTFUpdateProps) => {
	return useQuery(['tourType'], () => toursAPI.tourType(id!), {
		enabled: !!id && mode === 'update',
		onSuccess: (data) => {
			console.log(data);

			if (data && Object.entries(data).length) {
				const mappedValues = (Object.keys(data) as Array<keyof API.TourType>).reduce((acc, key) => {
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
						key === 'territory' ||
						key === 'country' ||
						key === 'location' ||
						key === 'currency' ||
						key === 'tour_type_category' ||
						key === 'fortnox_cost_center' ||
						key === 'station_type'
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
					} else {
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-ignore
						acc[key] = data[key];
					}

					return acc;
				}, {} as Omit<API.TourTypeCreatePayload, 'supplements'>);

				form.setFieldsValue(mappedValues);
			}
		},
	});
};
