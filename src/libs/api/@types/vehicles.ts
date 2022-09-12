export interface Vehicle {
	id: number;
	name: string;
	vehicle_type: number;
	capacity: number;
	description?: string;
	is_active: boolean;
}

export interface VehiclePayload {
	name: string;
	id: number;
	capacity: number;
}

export interface VehicleType {
	id: number;
	name: string;
	is_active: boolean;
}

export interface VehicleTypePayload {
	name: string;
}
