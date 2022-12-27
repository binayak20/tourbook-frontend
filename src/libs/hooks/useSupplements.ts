import { DEFAULT_LIST_PARAMS } from '@/utils/constants';
import { useCallback, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { supplementsAPI } from '../api';

export const useSupplements = () => {
	const [list, seList] = useState<API.Supplement[]>([]);
	const [supplements, setSupplements] = useState<(API.Supplement & { selectedquantity: number })[]>(
		[]
	);

	const { data: categories } = useQuery(['supplementCategories'], () =>
		supplementsAPI.categories({ ...DEFAULT_LIST_PARAMS, is_active: true })
	);

	const { mutate: mutateSubCategories, data: subCategories } = useMutation((ID: number) =>
		supplementsAPI.subCategories(ID, { ...DEFAULT_LIST_PARAMS, is_active: true })
	);

	const { mutate: mutateSupplements } = useMutation(
		(categoryID: number) =>
			supplementsAPI.list({
				supplement_category: categoryID,
				is_active: true,
				...DEFAULT_LIST_PARAMS,
			}),
		{
			onSuccess: (data) => {
				seList(data.results || []);
			},
		}
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
	const handleAddSupplement = useCallback(
		(values: (API.Supplement & { selectedquantity?: number })[]) => {
			setSupplements((prev) => {
				const newArr = [...prev];
				values.forEach((e) => {
					if (!newArr.some((s) => s.id === e.id)) {
						newArr.push({
							...e,
							selectedquantity: e?.selectedquantity || 1,
						});
					}
				});

				return newArr;
			});
		},
		[]
	);

	const handleIncrementQuantity = useCallback((ID: number) => {
		setSupplements((prev) => {
			const newArr = [...prev];
			const index = newArr.findIndex((s) => s.id === ID);
			newArr[index].selectedquantity += 1;
			return newArr;
		});
	}, []);

	const handleDecrementQuantity = useCallback((ID: number) => {
		setSupplements((prev) => {
			const newArr = [...prev];
			const index = newArr.findIndex((s) => s.id === ID);
			newArr[index].selectedquantity -= 1;
			return newArr;
		});
	}, []);

	// Clear the list
	const handleClearSupplements = useCallback(() => {
		setSupplements([]);
	}, []);

	return {
		items: list || [],
		categories,
		subCategories,
		handleCategoryChange,
		handleSubCategoryChange,
		supplements,
		handleClearList: () => seList([]),
		handleRemoveSupplement,
		handleAddSupplement,
		handleClearSupplements,
		handleReplaceSupplements: setSupplements,
		handleIncrementQuantity,
		handleDecrementQuantity,
	};
};
