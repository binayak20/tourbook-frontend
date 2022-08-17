/* eslint-disable @typescript-eslint/ban-types */
import config from '@/config';
import { authService } from '../auth';
import {
	ProfileResponse,
	User,
	UserCreatePayload,
	UserRole,
	UsersResponse,
	UserUpdatePayload,
} from './@types';
import { Common } from './common';
import { HttpAuthService } from './httpService';

class UsersAPI extends Common {
	constructor(private http: HttpAuthService) {
		super(config.itemsPerPage);
	}

	profile() {
		return this.http.get<ProfileResponse>('users/me/');
	}

	updatePassword(current_password: string, new_password: string) {
		const payload = { current_password, new_password, re_new_password: new_password };
		return this.http.post<{}>('users/set_password/', payload);
	}

	users(page = 1) {
		const paginateURL = this.getPaginateURL(page, 'users/');
		return this.http.get<UsersResponse>(paginateURL);
	}

	user(ID: number) {
		return this.http.get<User>(`users/${ID}/`);
	}

	updateUser(ID: number, payload: Partial<UserUpdatePayload>) {
		return this.http.put<User>(`users/${ID}/`, payload);
	}

	updateUserStatus(ID: number, is_active: boolean) {
		return this.http.patch<User>(`users/${ID}/update-status/`, { is_active });
	}

	createUser(payload: UserCreatePayload) {
		return this.http.post<User>('users/', payload);
	}

	userFilteredRoles() {
		return this.http.get<UserRole[]>('filtered-auth-group/');
	}

	logout() {
		return this.http.post<ProfileResponse['permissions']>('token/logout/', {});
	}
}

const httpAuthService = new HttpAuthService(config.apiURL, authService);
export const usersAPI = new UsersAPI(httpAuthService);
