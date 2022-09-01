import { defaultListParams } from '@/utils/constants';
import { useCallback, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { supplementsAPI } from '../api';

export const useSupplements = () => {
	const [supplements, setSupplements] = useState<API.Supplement[]>([]);

	const { data: categories } = useQuery(['supplementCategories'], () =>
		supplementsAPI.categories(defaultListParams)
	);

	const { mutate: mutateSubCategories, data: subCategories } = useMutation((ID: number) =>
		supplementsAPI.subCategories(ID, defaultListParams)
	);

	const { mutate: mutateSupplements, data: supplementsList } = useMutation((categoryID: number) =>
		supplementsAPI.list({ supplement_category: categoryID, ...defaultListParams })
	);

	const handleCategoryChange = useCallback(
		(ID: number) => {
			mutateSupplements(ID);
			mutateSubCategories(ID);
		},
		[mutateSubCategories, mutateSupplements]
	);

	const handleSubCategoryChange = useCallback(
		(ID: number) => {
			mutateSupplements(ID);
		},
		[mutateSupplements]
	);

	// Remove a supplement from the list
	const handleRemoveSupplement = useCallback((ID: number) => {
		setSupplements((prev) => prev.filter((supplement) => supplement.id !== ID));
	}, []);

	// Add a supplement to the list
	const handleAddSupplement = useCallback((values: API.Supplement[]) => {
		setSupplements((prev) => {
			const newArr = [...prev];
			values.forEach((e) => {
				if (!newArr.some((s) => s.id === e.id)) {
					newArr.push(e);
				}
			});

			return newArr;
		});
	}, []);

	// Clear the list
	const handleClearSupplements = useCallback(() => {
		setSupplements([]);
	}, []);

	return {
		items: supplementsList?.results || [],
		categories,
		subCategories,
		handleCategoryChange,
		handleSubCategoryChange,
		supplements,
		handleRemoveSupplement,
		handleAddSupplement,
		handleClearSupplements,
	};
};
