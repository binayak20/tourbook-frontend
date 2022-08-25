import { useCallback, useState } from 'react';

export const useSupplements = () => {
	const [supplements, setSupplements] = useState<Pick<API.Supplement, 'id' | 'name'>[]>([]);

	// Remove a supplement from the list
	const handleRemoveSupplement = useCallback((ID: number) => {
		setSupplements((prev) => prev.filter((supplement) => supplement.id !== ID));
	}, []);

	// Add a supplement to the list
	const handleAddSupplement = useCallback((values: API.Supplement[]) => {
		setSupplements((prev) => {
			const newArr = [...prev];
			values.forEach(({ id, name }) => {
				if (!newArr.some((s) => s.id === id)) {
					newArr.push({ id, name });
				}
			});

			return newArr;
		});
	}, []);

	// Clear the list
	const handleClearSupplements = useCallback(() => {
		setSupplements([]);
	}, []);

	return { supplements, handleRemoveSupplement, handleAddSupplement, handleClearSupplements };
};
