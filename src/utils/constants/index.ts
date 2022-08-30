import config from '@/config';

export const defaultListParams = {
	page: 1,
	limit: config.itemsPerPageMax,
};

export * from './option.constant';
