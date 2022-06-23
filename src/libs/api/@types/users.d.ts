/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Group {
	id: number;
	name: string;
}

export interface Permission {
	id: number;
	name: string;
	content_type_id: number;
	codename: string;
}

export interface ProfileResponse {
	id: number;
	last_login: Date;
	is_superuser: boolean;
	first_name: string;
	last_name: string;
	email: string;
	is_staff: boolean;
	is_active: boolean;
	date_joined: Date;
	user_permissions: any[];
	groups: Group[];
	permissions: Permission[];
}

export interface UserUpdatePayload {
	first_name: string;
	last_name: string;
	groups: number[];
}

export interface User {
	id: number;
	first_name: string;
	last_name: string;
	email: string;
	is_staff: boolean;
	is_active: boolean;
	groups: number[];
	created_at: Date;
	updated_at: Date;
}

export interface UsersResponse {
	count: number;
	next?: any;
	previous?: any;
	results: User[];
}
