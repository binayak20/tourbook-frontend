import config from '@/config';

export const defaultListParams = {
	page: 1,
	limit: config.itemsPerPageMax,
	is_active: true,
};

export * from './option.constant';
