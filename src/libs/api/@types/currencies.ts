export interface Currency {
	id: number;
	currency_code: string;
	name: string;
	country_name: string;
}

export interface CurrencyFrom {
	id: number;
	is_active: boolean;
	created_at: Date;
	updated_at: Date;
	currency_code: string;
	name: string;
	country_name?: string;
	created_by?: Date;
	updated_by?: Date;
}

export interface CurrencyTo {
	id: number;
	is_active: boolean;
	created_at: Date;
	updated_at: Date;
	currency_code: string;
	name: string;
	country_name?: string;
	created_by?: Date;
	updated_by?: Date;
}

export interface CurrencyConversation {
	id: number;
	currency_from: CurrencyFrom;
	currency_to: CurrencyTo;
	rate: number;
}

export interface CurrencyConversationCreatePayload {
	currency_from: number;
	currency_to: number;
	rate: number;
}
