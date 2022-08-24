import config from '@/config';
import { authService } from '../auth';
import { Vehicle } from './@types';
import { HttpAuthService } from './httpService';

class VehiclesAPI {
	constructor(private http: HttpAuthService) {}

	list() {
		return this.http.get<Vehicle[]>('vehicles/');
	}
}

const httpAuthService = new HttpAuthService(config.apiURL, authService);
export const vehiclesAPI = new VehiclesAPI(httpAuthService);
