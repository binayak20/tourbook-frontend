/* eslint-disable @typescript-eslint/ban-types */
import config from '@/config';
import { authService } from '../auth';
import { UpdateStatusResponse, UpdateStausRequest } from './@types';
import { HttpAuthService } from './httpService';

class CommonAPI {
	constructor(private http: HttpAuthService) {}

	updateStatus({ endpoint, id, payload }: UpdateStausRequest) {
		return this.http.patch<UpdateStatusResponse>(`${endpoint}/${id}/update-status/`, payload);
	}
}

const httpAuthService = new HttpAuthService(config.apiURL, authService);
export const commonAPI = new CommonAPI(httpAuthService);
