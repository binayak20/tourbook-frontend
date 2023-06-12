import { publicAPI } from '@/libs/api/publicAPI';
import { useCallback, useEffect, useState } from 'react';
import { TWidgetState } from './WidgetContext';
import { getQueryParams } from './utills';

export const useSearchOptions = () => {
	const [searchCriteria, setSearchCritera] = useState<API.ISearchCriteria>();
	const [isLoading, setLoading] = useState(false);
	useEffect(() => {
		setLoading(true);
		publicAPI.searchCriteria().then((res) => {
			setSearchCritera(res);
			setLoading(false);
		});
	}, []);
	const categoriesOptions =
		searchCriteria?.categories.map((category) => ({
			value: category.id,
			label: category.name,
		})) || [];
	const remainingCapacityOptions =
		searchCriteria?.remaining_capacity.map((capacity) => ({
			value: capacity,
			label: capacity,
		})) || [];
	const locationsOptions =
		searchCriteria?.locations.map((location) => ({
			value: location.id,
			label: location.name,
		})) || [];
	const countriesOptions =
		searchCriteria?.countries.map((country) => ({
			value: country.id,
			label: country.name,
		})) || [];
	return {
		categoriesOptions,
		remainingCapacityOptions,
		locationsOptions,
		countriesOptions,
		isLoading,
	};
};

export const useTours = (state: TWidgetState) => {
	const [tours, setTours] = useState<API.Tour[]>([]);
	const [pages, setPages] = useState(1);
	const [isLoading, setLoading] = useState(false);

	const fetchTours = useCallback(() => {
		if (state?.widget_screen !== 'list') return;
		setLoading(true);
		publicAPI.tours(getQueryParams(state, true)).then((res) => {
			setTours(res.results);
			setPages(res.count);
			setLoading(false);
		});
	}, [state]);

	useEffect(() => {
		fetchTours();
	}, [fetchTours]);

	return { tours, pages, isLoading };
};
