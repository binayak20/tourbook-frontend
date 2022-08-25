import { toursAPI } from '@/libs/api';
import { FormInstance } from 'antd';
import { useMutation } from 'react-query';

type useTourTypeProps = {
	form: FormInstance;
	supplementsCallback: (supplements: API.Supplement[]) => void;
	supplementsClearCallback: () => void;
	countriesCallback: (territory: number) => void;
	locationsCallback: ({ territory, country }: { territory: number; country: number }) => void;
	stationsCallback: (type: number) => void;
	capacityCallback: (capacity: number) => void;
	reservedCallback: (reserved: boolean) => void;
};

export const useTourTypeChange = ({
	form,
	supplementsCallback,
	supplementsClearCallback,
	countriesCallback,
	locationsCallback,
	stationsCallback,
	capacityCallback,
	reservedCallback,
}: useTourTypeProps) => {
	return useMutation((typeID: number) => toursAPI.tourType(typeID), {
		onMutate: (typeID) => {
			if (!typeID) {
				form.resetFields();
				supplementsClearCallback();
				capacityCallback(0);
				reservedCallback(false);

				throw new Error('Tour type not found');
			}
		},
		onSuccess: (data) => {
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
					} else {
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-ignore
						acc[key] = data[key];
					}

					return acc;
				}, {} as Omit<API.TourTypeCreatePayload, 'capacity' | 'supplements'>);

				form.setFieldsValue(mappedValues);
			}
		},
	});
};
