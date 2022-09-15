import { Spin } from '@/components/atoms';
import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { MENU_ITEMS, vehiclesSettingsRoutes, VEHICLES_SETTINGS_ROUTES } from './contstants';

const InnerLayout = lazy(() => import('@/components/layouts/InnerLayout'));

const SettingsLocation = () => {
	return (
		<Routes>
			<Route
				path=''
				element={<InnerLayout MENU_ITEMS={MENU_ITEMS} breadcrumbs={['Settings', 'Vehicles']} />}
			>
				<>
					<Route path='' element={<Navigate to={VEHICLES_SETTINGS_ROUTES.VEHICLES} />} />
					{vehiclesSettingsRoutes.map(({ path, Component }, i) => (
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
