import config from '@/config';
import { authService } from '../auth';
import {
	PaginateParams,
	Pagination,
	Vehicle,
	VehiclePayload,
	VehicleType,
	VehicleTypePayload,
} from './@types';
import { Common } from './common';
import { HttpAuthService } from './httpService';

class VehiclesAPI extends Common {
	constructor(private http: HttpAuthService) {
		super(config.itemsPerPage);
	}

	list(params: PaginateParams = {}) {
		const paginateURL = this.setURL('vehicles/').params(params).getURL();
		return this.http.get<Pagination<Vehicle[]>>(paginateURL);
	}
	// listAssignTour(params: PaginateParams = {}, tour?: string | number | undefined) {
	// 	const paginateURL = this.setURL(`vehicles/?tour=${tour}&`).params(params).getURL();
	// 	return this.http.get<Pagination<Vehicle[]>>(paginateURL);
	// }
	listAssignTour(params: { tour?: number }) {
		const paginateURL = this.setURL(`vehicles/`).params(params).getURL();
		return this.http.get<Pagination<Vehicle[]>>(paginateURL);
	}

	create(payload: VehiclePayload) {
		return this.http.post('vehicles/', payload);
	}

	update(ID: number, payload: VehiclePayload) {
		return this.http.put(`vehicles/${ID}/`, payload);
	}

	types({ page, limit }: PaginateParams = {}) {
		const paginateURL = this.setURL('vehicle-types/').paginate(page, limit).getURL();
		return this.http.get<Pagination<VehicleType[]>>(paginateURL);
	}

	typeCreate(payload: VehicleTypePayload) {
		return this.http.post('vehicle-types/', payload);
	}

	typeUpdate(ID: number, payload: VehicleTypePayload) {
		return this.http.put(`vehicle-types/${ID}/`, payload);
	}
}

const httpAuthService = new HttpAuthService(config.apiURL, authService);
export const vehiclesAPI = new VehiclesAPI(httpAuthService);
