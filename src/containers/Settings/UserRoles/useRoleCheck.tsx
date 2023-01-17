import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { useCallback, useEffect, useState } from 'react';

type Props = {
	permissions: number[];
	preSelectedItems?: number[];
	onCallback?: (permissions: number[]) => void;
};

export const useRoleCheck = ({ permissions, preSelectedItems, onCallback }: Props) => {
	const [selectedItems, setSelectedItems] = useState<number[]>([]);
	const [isAllChecked, setIsAllChecked] = useState<boolean>(false);
	const [isIndeterminate, setIsIndeterminate] = useState<boolean>(false);

	useEffect(() => {
		if (Array.isArray(preSelectedItems) && preSelectedItems.length > 0) {
			setSelectedItems((prev) => {
				const newPermissions = new Set(prev);
				preSelectedItems.forEach((item) => newPermissions.add(item));
				setIsAllChecked(newPermissions.size === permissions.length);
				setIsIndeterminate(newPermissions.size > 0 && newPermissions.size < permissions.length);
				return Array.from(newPermissions);
			});
		}
	}, [preSelectedItems, permissions]);

	const handleCheckAllChange = useCallback(
		(e: CheckboxChangeEvent) => {
			const { checked } = e.target;
			setIsAllChecked(checked);
			setIsIndeterminate(false);
			setSelectedItems(checked ? permissions : []);
			onCallback?.(checked ? permissions : []);
		},
		[onCallback, permissions]
	);

	const handleCheckChange = useCallback(
		(e: CheckboxChangeEvent, values: number[] | number) => {
			const { checked } = e.target;
			const newPermissions = new Set(selectedItems);

			if (checked) {
				if (Array.isArray(values)) {
					values.forEach((v) => newPermissions.add(v));
				} else {
					newPermissions.add(values);
				}
			} else if (Array.isArray(values)) {
				values.forEach((item) => {
					newPermissions.delete(item);
				});
			} else {
				newPermissions.delete(values);
			}

			onCallback?.(Array.from(newPermissions));
			setSelectedItems([...newPermissions]);
			setIsAllChecked(newPermissions.size === permissions.length);
			setIsIndeterminate(newPermissions.size > 0 && newPermissions.size < permissions.length);
		},
		[onCallback, permissions.length, selectedItems]
	);

	return {
		selectedItems,
		isAllChecked,
		isIndeterminate,
		handleCheckAllChange,
		handleCheckChange,
	};
};
