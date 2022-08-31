import { Spin } from '@/components/atoms';
import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { CURRENCIES_SETTINGS_ROUTES, currencySettingsRoutes } from './contstants';

const CurrenciesLayout = lazy(() => import('@/components/layouts/CurrenciesLayout'));

const SettingsLocation = () => {
	return (
		<Routes>
			<Route path='' element={<CurrenciesLayout />}>
				<>
					<Route path='' element={<Navigate to={CURRENCIES_SETTINGS_ROUTES.CUURENCIES} />} />
					{currencySettingsRoutes.map(({ path, Component }, i) => (
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
