import { DEFAULT_LIST_PARAMS } from '@/utils/constants';
import { useCallback, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { supplementsAPI } from '../api';

type ActionCallback = (supplements?: (API.Supplement & { selectedquantity: number })[]) => void;

export const useSupplements = (callback?: ActionCallback, currencyCode?: string) => {
	const [list, seList] = useState<API.Supplement[]>([]);
	const [id, setId] = useState<number>();
	const [supplements, setSupplements] = useState<(API.Supplement & { selectedquantity: number })[]>(
		[]
	);

	const { data: categories } = useQuery(['supplementCategoriesParents'], () =>
		supplementsAPI.parentCategories({ ...DEFAULT_LIST_PARAMS, is_active: true })
	);

	const { mutate: mutateSubCategories, data: subCategories } = useMutation((ID: number) =>
		supplementsAPI.subCategories(ID, { ...DEFAULT_LIST_PARAMS, is_active: true })
	);

	const { mutate: mutateSupplements } = useMutation(
		(categoryID: number) =>
			supplementsAPI.listMc({
				supplement_category: categoryID,
				is_active: true,
				...(currencyCode ? { currency_code: currencyCode } : {}),
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
			setId(ID);
			mutateSupplements(ID);
			mutateSubCategories(ID);
		},
		[mutateSubCategories, mutateSupplements]
	);

	const handleSubCategoryChange = useCallback(
		(ID: number) => {
			setId(ID);
			mutateSupplements(ID);
		},
		[mutateSupplements]
	);

	// Remove a supplement from the list
	const handleRemoveSupplement = useCallback(
		(ID: number) => {
			setSupplements((prev) => {
				const newArr = prev.filter((supplement) => supplement.id !== ID);

				callback?.(newArr);
				return newArr;
			});
		},
		[callback]
	);

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

				callback?.(newArr);
				return newArr;
			});
		},
		[callback]
	);

	const handleIncrementQuantity = useCallback(
		(ID: number) => {
			setSupplements((prev) => {
				const newArr = [...prev];
				const index = newArr.findIndex((s) => s.id === ID);
				newArr[index].selectedquantity += 1;

				callback?.(newArr);
				return newArr;
			});
		},
		[callback]
	);

	const handleDecrementQuantity = useCallback(
		(ID: number) => {
			setSupplements((prev) => {
				const newArr = [...prev];
				const index = newArr.findIndex((s) => s.id === ID);
				newArr[index].selectedquantity -= 1;

				callback?.(newArr);
				return newArr;
			});
		},
		[callback]
	);

	// Clear the list
	const handleClearSupplements = useCallback(() => {
		setSupplements([]);
		callback?.([]);
	}, [callback]);

	const refetchSupplements = useCallback(() => {
		mutateSupplements(id!);
	}, [id, mutateSupplements]);

	const handleUpdateSupplementPrice = useCallback(
		(ID: number, price: number) => {
			setSupplements((prev) => {
				const newArr = [...prev];
				const index = newArr.findIndex((s) => s.id === ID);
				newArr[index].price = price;

				callback?.(newArr);
				return newArr;
			});
		},
		[callback]
	);

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
		refetchSupplements,
		handleUpdateSupplementPrice,
	};
};
