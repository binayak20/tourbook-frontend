import { useCallback, useState } from 'react';

export const useSupplements = () => {
	const [supplements, setSupplements] = useState<API.Supplement[]>([]);

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

	return { supplements, handleRemoveSupplement, handleAddSupplement, handleClearSupplements };
};
