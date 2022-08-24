// Tour categories
export interface TourCategoriesParams {
	name?: string;
	parent?: number;
	is_active?: boolean;
}

export interface TourCategory {
	id: number;
	parent?: number;
	name: string;
	slug: string;
	is_active: boolean;
}
