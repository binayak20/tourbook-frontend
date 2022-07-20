import { Spin } from '@/components/atoms';
import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { emailSettingsRoutes, LOCATIONS_SETTINGS_ROUTES } from './contstants';

const EmailLayout = lazy(() => import('@/components/layouts/LocationsLayout'));

const SettingsEmail = () => {
	return (
		<Routes>
			<Route path='' element={<EmailLayout />}>
				<>
					<Route index element={<Navigate to={LOCATIONS_SETTINGS_ROUTES.LOCATIONS} />}></Route>
					{emailSettingsRoutes.map(({ path, Component }, i) => (
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

export default SettingsEmail;
