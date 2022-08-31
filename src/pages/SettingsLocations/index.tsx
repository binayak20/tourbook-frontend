import { Spin } from '@/components/atoms';
import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { locationSettingsRoutes, LOCATIONS_SETTINGS_ROUTES } from './contstants';

const LocationsLayout = lazy(() => import('@/components/layouts/LocationsLayout'));

const SettingsLocation = () => {
	return (
		<Routes>
			<Route path='' element={<LocationsLayout />}>
				<>
					<Route path='' element={<Navigate to={LOCATIONS_SETTINGS_ROUTES.LOCATIONS} />} />
					{locationSettingsRoutes.map(({ path, Component }, i) => (
						<Route
							key={i}
							path={path}
							element={
								<Suspense fallback={<Spin type='content-centre' size='large' />}>
									<Component />
								</Suspense>
							}
						/>
					))}
				</>
			</Route>
		</Routes>
	);
};

export default SettingsLocation;
