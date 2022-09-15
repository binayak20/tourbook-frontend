interface CreatedTypes {
	created_at?: string;
	updated_at?: string;
	created_by?: string;
	updated_by?: string;
}

export interface FortnoxCostCenter {
	id: number;
	name: string;
	code: string;
	note: string;
	is_active: boolean;
}

export interface FortnoxEvent extends CreatedTypes {
	id: number;
	name: string;
	slug: string;
	is_active: boolean;
}

export interface FortnoxScenario extends CreatedTypes {
	id: number;
	name: string;
	slug: string;
	is_active: boolean;
}

export interface FortnoxAccountPayload {
	fortnox_event: number;
	fortnox_scenario: number;
	type: 'credit' | 'debit';
	account_number: string;
}

export interface FortnoxAccountResponse {
	fortnox_event: number;
	fortnox_scenario: number;
	type: 'credit' | 'debit';
	account_number: string;
}

export interface FortnoxAccounts extends CreatedTypes {
	id: number;
	is_active?: boolean;
	type: 'debit' | 'credit';
	account_number: string;
	fortnox_event: FortnoxEvent;
	fortnox_scenario: FortnoxScenario;
}
