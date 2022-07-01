import { SettingsLayout } from '@/components/layouts/SettingsLayout';
import { Containers } from '@/containers';
import { PRIVATE_ROUTES } from '@/routes/paths';
import { Route, Routes } from 'react-router-dom';

const settingsRoutes = [
	{
		path: PRIVATE_ROUTES.AIRPORTS,
		Component: Containers.SettingsAirports,
	},
	{
		path: `${PRIVATE_ROUTES.AIRPORTS}/${PRIVATE_ROUTES.CREATE}`,
		Component: Containers.SettingsAirportsCreate,
	},
	{
		path: `${PRIVATE_ROUTES.AIRPORTS}/${PRIVATE_ROUTES.UPDATE}/${PRIVATE_ROUTES.PARAM_ID}`,
		Component: Containers.SettingsAirportsUpdate,
	},
	{
		path: PRIVATE_ROUTES.CATEGORIES,
		Component: Containers.SettingsCategories,
	},
	{
		path: PRIVATE_ROUTES.LOCATIONS,
		Component: Containers.SettingsLocations,
	},
	{
		path: PRIVATE_ROUTES.USERS_LIST,
		Component: Containers.SettingsUsersList,
	},
	{
		path: PRIVATE_ROUTES.USER_ROLES,
		Component: Containers.SettingsUserRoles,
	},
];

const Settings = () => {
	return (
		<Routes>
			<Route path='' element={<SettingsLayout />}>
				{settingsRoutes.map(({ path, Component }, i) => (
					<Route key={i} path={path} element={<Component />} />
				))}
			</Route>
		</Routes>
	);
};

export default Settings;
