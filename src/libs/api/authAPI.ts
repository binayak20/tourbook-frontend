import config from '@/config';
import { LoginPayload, LoginResponse } from './@types';
import { HttpService } from './httpService';

class AuthAPI {
	constructor(private http: HttpService) {}

	login(payload: LoginPayload) {
		return this.http.post<LoginResponse>('token/login/', payload);
	}
}

const httpService = new HttpService(config.apiURL);
export const authAPI = new AuthAPI(httpService);
