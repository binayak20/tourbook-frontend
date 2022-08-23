/* eslint-disable @typescript-eslint/no-explicit-any */
export interface SupplementParmas {
	name?: string;
	supplement_category?: number;
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
	price: number;
	supplement_category: number;
}

export interface SupplementUpdatePayload extends SupplementCreatePayload {
	description?: string;
	quantity?: number;
	unit_type?: string;
	obligatory?: boolean;
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
