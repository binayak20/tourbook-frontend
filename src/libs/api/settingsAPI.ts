/* eslint-disable @typescript-eslint/ban-types */
import config from '@/config';
import { authService } from '../auth';
import { AirporCreateResponse, AirportCreatePayload, AirportsResponse } from './@types';
import { HttpAuthService } from './httpService';

class SettingsAPI {
	constructor(private http: HttpAuthService) {}

	airport(id: number) {
		return this.http.get<API.Airport>(`airports/${id}/`);
	}

	airports() {
		return this.http.get<AirportsResponse>('airports/');
	}

	airportCreate(payload: AirportCreatePayload) {
		return this.http.post<AirporCreateResponse>('airports/', payload);
	}

	airportUpdate(id: number, payload: AirportCreatePayload) {
		return this.http.put<AirporCreateResponse>(`airports/${id}/`, payload);
	}
}

const httpAuthService = new HttpAuthService(config.apiURL, authService);
export const settingsAPI = new SettingsAPI(httpAuthService);
