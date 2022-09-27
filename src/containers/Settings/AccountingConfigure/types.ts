export interface AccountsData {
	key?: string;
	id?: number;
	fortnox_event?: number;
	fortnox_scenario?: number;
	type?: 'credit' | 'debit';
	account_number?: string;
	is_active?: boolean;
}
