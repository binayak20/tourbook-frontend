import { SettingsLayout } from '@/components/layouts/SettingsLayout';
import { Spin } from 'antd';
import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

const settingsRoutes = [
	{
		path: 'airports',
		Component: lazy(() => import('@/pages/SettingsAirports')),
	},
];

const Settings = () => {
	return (
		<Routes>
			<Route path='' element={<SettingsLayout />}>
				{settingsRoutes.map(({ path, Component }, i) => (
					<Route
						key={i}
						path={path}
						element={
							<Suspense fallback={<Spin className='SuspenseLoader' size='large' />}>
								<Component />
							</Suspense>
						}
					/>
				))}
			</Route>
		</Routes>
	);
};

export default Settings;
