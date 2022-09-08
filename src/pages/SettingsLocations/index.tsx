import { Spin } from '@/components/atoms';
import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { locationSettingsRoutes, LOCATIONS_SETTINGS_ROUTES, MENU_ITEMS } from './contstants';

const InnerLayout = lazy(() => import('@/components/layouts/InnerLayout'));

const SettingsLocation = () => {
	return (
		<Routes>
			<Route
				path=''
				element={<InnerLayout MENU_ITEMS={MENU_ITEMS} breadcrumbs={['Settings', 'Locations']} />}
			>
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
