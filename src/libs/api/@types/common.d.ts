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