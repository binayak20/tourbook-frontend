import config from '@/config';
import { locationsAPI, stationsAPI } from '@/libs/api';
import { FormInstance } from 'antd/lib/form';
import { useCallback } from 'react';
import { useMutation } from 'react-query';

const defaultParams = {
	page: 1,
	limit: config.itemsPerPageMax,
};

export const useInputChange = (form: FormInstance) => {
	// Mutate countries based on the selected territory
	const {
		mutate: mutateCountries,
		data: countries,
		isLoading: isCountriesLoading,
	} = useMutation((territory: number) => locationsAPI.countries({ territory, ...defaultParams }));

	// Mutate locations based on the selected country
	const {
		mutate: mutateLocations,
		data: locations,
		isLoading: isLocationsLoading,
	} = useMutation((params: API.LocationParams) =>
		locationsAPI.list({ ...params, ...defaultParams })
	);

	// Mutate stations based on the selected station type
	const {
		mutate: mutateStations,
		data: stations,
		isLoading: isStationsLoading,
	} = useMutation((stationTypeID: number) =>
		stationsAPI.list({ station_type: stationTypeID, ...defaultParams })
	);

	// Call the countries mutation on territory change
	const handleTerritoryChange = useCallback(
		(value: number) => {
			form.resetFields(['country', 'location']);
			mutateCountries(value);
		},
		[form, mutateCountries]
	);

	// Call the locations mutation on country change
	const handleCountryChange = useCallback(
		(value: number) => {
			form.resetFields(['location']);
			const territory = form.getFieldValue('territory');
			mutateLocations({ territory, country: value });
		},
		[form, mutateLocations]
	);

	// Call the stations mutation on station type change
	const handleStationTypeChange = useCallback(
		(value: number) => {
			form.resetFields(['stations']);
			mutateStations(value);
		},
		[form, mutateStations]
	);

	return {
		handleTerritoryChange,
		handleCountryChange,
		handleStationTypeChange,
		mutateCountries,
		mutateLocations,
		mutateStations,
		isCountriesLoading,
		isLocationsLoading,
		isStationsLoading,
		countries,
		locations,
		stations,
	};
};
