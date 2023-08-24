export interface UpdateStausRequest {
	endpoint: string;
	id: number;
	payload: {
		is_active: boolean;
	};
}

export interface UpdateStatusResponse {
	id: number;
	is_active: boolean;
}

export interface Pagination<T> {
	count: number;
	next?: string;
	previous?: string;
	results: T;
}

export interface PaginateParams {
	page?: number;
	limit?: number;
	is_active?: boolean | string | undefined;
}

export interface DEFAULT_LIST_PARAMS extends PaginateParams {
	is_active?: boolean;
}
