import { SettingsLayout } from '@/components/layouts/SettingsLayout';
import { Containers } from '@/containers';
import { PRIVATE_ROUTES } from '@/routes/paths';
import { Navigate, Route, Routes } from 'react-router-dom';

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
		path: `${PRIVATE_ROUTES.AIRPORTS}/${PRIVATE_ROUTES.PARAM_ID}`,
		Component: Containers.SettingsAirportsUpdate,
	},
	{
		path: PRIVATE_ROUTES.CATEGORIES,
		Component: Containers.SettingsCategories,
	},
	{
		path: `${PRIVATE_ROUTES.CATEGORIES}/${PRIVATE_ROUTES.CREATE}`,
		Component: Containers.SettingsCategoriesCreate,
	},
	{
		path: `${PRIVATE_ROUTES.CATEGORIES}/${PRIVATE_ROUTES.PARAM_ID}`,
		Component: Containers.SettingsCategoriesUpdate,
	},
	{
		path: PRIVATE_ROUTES.LOCATIONS,
		Component: Containers.SettingsLocations,
	},
	{
		path: `${PRIVATE_ROUTES.LOCATIONS}/${PRIVATE_ROUTES.CREATE}`,
		Component: Containers.SettingsLocationsCreate,
	},
	{
		path: `${PRIVATE_ROUTES.LOCATIONS}/${PRIVATE_ROUTES.PARAM_ID}`,
		Component: Containers.SettingsLocationsUpdate,
	},
	{
		path: PRIVATE_ROUTES.LOCATIONS_TERRITORY,
		Component: Containers.SettingsTerritories,
	},
	{
		path: `${PRIVATE_ROUTES.LOCATIONS_TERRITORY}/${PRIVATE_ROUTES.CREATE}`,
		Component: Containers.SettingsTerritoriesCreate,
	},
	{
		path: `${PRIVATE_ROUTES.LOCATIONS_TERRITORY}/${PRIVATE_ROUTES.PARAM_ID}`,
		Component: Containers.SettingsTerritoriesUpdate,
	},
	{
		path: PRIVATE_ROUTES.USERS_LIST,
		Component: Containers.SettingsUsersList,
	},
	{
		path: PRIVATE_ROUTES.USER_ROLES,
		Component: Containers.SettingsUserRoles,
	},
	{
		path: PRIVATE_ROUTES.CONFIGURATION,
		Component: Containers.SettingsConfiguration,
	},
];

const Settings = () => {
	return (
		<Routes>
			<Route path='' element={<SettingsLayout />}>
				<>
					<Route index element={<Navigate to={PRIVATE_ROUTES.CONFIGURATION} />} />
					{settingsRoutes.map(({ path, Component }, i) => (
						<Route key={i} path={path} element={<Component />} />
					))}
				</>
			</Route>
		</Routes>
	);
};

export default Settings;
