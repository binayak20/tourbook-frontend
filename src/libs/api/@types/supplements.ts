import { PaginateParams } from './common';

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface SupplementParams extends PaginateParams {
	name?: string;
	supplement_category?: number;
	is_active?: boolean;
}

export interface SupplementCategoriesParams extends PaginateParams {
	is_active?: boolean;
}

export interface SupplementCategoryCreatePayload {
	name: string;
	parent?: number;
}

export interface SupplementCategory {
	id: number;
	is_active: boolean;
	name: string;
	slug: string;
	parent?: number;
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
	supplement_category: SupplementCategory;
}
