/* eslint-disable @typescript-eslint/ban-types */
import config from '@/config';
import { authService } from '../auth';
import { AirportsResponse } from './@types';
import { HttpAuthService } from './httpService';

class SettingsAPI {
	constructor(private http: HttpAuthService) {}

	airports() {
		return this.http.get<AirportsResponse>('airports/');
	}
}

const httpAuthService = new HttpAuthService(config.apiURL, authService);
export const settingsAPI = new SettingsAPI(httpAuthService);
