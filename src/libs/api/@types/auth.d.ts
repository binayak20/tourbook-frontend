export interface LoginPayload {
	email: string;
	password: string;
}

export interface LoginResponse {
	auth_token: string;
}
