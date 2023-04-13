export interface Coupon {
	id: number;
	code: string;
	valid_from: Date;
	valid_to: Date;
	discount: number;
	discount_type: string;
	use_limit: number;
	tours: number[];
	description: string;
	coupon_type: 'all-tour' | 'specific-tour' | null;
	is_active: boolean;
	created_at: Date;
	updated_at: Date;
	email: string;
}

export interface CreateCoupon {
	code: string;
	valid_from: string;
	valid_to: string;
	discount: number;
	discount_type?: string;
	use_limit?: number;
	tours?: number[];
	description?: string;
	coupon_type?: 'all-tour' | 'specific-tour' | null;
}
