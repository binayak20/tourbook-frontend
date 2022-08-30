export * from './theme';

export default {
	siteName: 'React Boilerplate',
	lang: 'en',
	dev: import.meta.env.DEV,
	baseURL: import.meta.env.BASE_URL,
	apiURL: import.meta.env.VITE_BACKEND_API_URL,
	itemsPerPage: 10,
	itemsPerPageMax: 9999,
	dateFormat: 'YYYY-MM-DD',
};
