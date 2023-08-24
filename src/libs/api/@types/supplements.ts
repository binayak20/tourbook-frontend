import { PaginateParams } from './common';

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface SupplementParams extends PaginateParams {
	name?: string;
	supplement_category?: number;
	is_active?: boolean | string | undefined;
}

export interface SupplementCategoriesParams extends PaginateParams {
	is_active?: boolean | string | undefined;
}

export interface SupplementCategoryCreatePayload {
	name: string;
	parent?: number;
}

interface SupplementCategoryParent {
	id: number;
	name: string;
}

export interface SupplementCategory {
	id: number;
	is_active: boolean;
	name: string;
	slug: string;
	parent?: SupplementCategoryParent;
	created_at: Date;
	updated_at: Date;
}

export interface SupplementCreatePayload {
	name: string;
	description?: string;
	price: number;
	quantity: number;
	unit_type: string;
	supplement_category: number;
	mandatory?: boolean;
	is_calculate?: boolean;
}

export interface Supplement {
	id: number;
	name: string;
	description?: any;
	price: number;
	quantity?: any;
	unit_type: string;
	obligatory: boolean;
	is_calculate: boolean;
	is_mandatory: boolean;
	supplement_category: SupplementCategory;
}
