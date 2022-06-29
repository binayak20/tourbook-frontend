import { PRIVATE_ROUTES, PUBLIC_ROUTES } from './paths';

type publicKeys = keyof typeof PUBLIC_ROUTES;
type privateKeys = keyof typeof PRIVATE_ROUTES;

export const routeNavigate = (path: publicKeys | privateKeys | privateKeys[], parmas?: string) => {
	const NEW_PRIVATE_ROUTES = Object.keys(PRIVATE_ROUTES).reduce((acc, key) => {
		const value = PRIVATE_ROUTES[key as privateKeys];
		acc[key as privateKeys] = `/dashboard${value ? `/${value}` : ''}`;
		return acc;
	}, {} as Record<privateKeys, string>);

	const paths = { ...PUBLIC_ROUTES, ...NEW_PRIVATE_ROUTES };

	const pathname =
		typeof path !== 'object'
			? paths[path]
			: path.reduce(
					(acc, current) => `${acc}/${PRIVATE_ROUTES[current as privateKeys]}`,
					'/dashboard'
			  );
	const pathnameArray = pathname.split('/:');

	if (parmas) {
		return `${pathnameArray[0]}/${parmas}`;
	}

	return pathnameArray[0];
};
