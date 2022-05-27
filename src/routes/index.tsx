import { useStoreSelector } from '@/store';
import { Spin } from 'antd';
import nProgress from 'nprogress';
import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { privateRoutes } from './privateRoutes';
import { publicRoutes } from './publicRoutes';

const SignInLayout = lazy(() =>
	import('@/components/layouts/SignInLayout').then((module) => ({ default: module.SignInLayout }))
);
const DashboardLayout = lazy(() =>
	import('@/components/layouts/DashboardLayout').then((module) => ({
		default: module.DashboardLayout,
	}))
);
const NotFound = lazy(() => import('@/pages/NotFound'));

export const BaseRoutes = () => {
	const { routeChange } = useStoreSelector((state) => state.app);

	useEffect(() => {
		if (routeChange === 'start') {
			nProgress.start();
		} else {
			nProgress.done();
		}
	}, [routeChange]);

	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<SignInLayout />}>
					{publicRoutes.map(({ path, Component }, i) => (
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
				<Route path='dashboard' element={<DashboardLayout />}>
					{privateRoutes.map(({ path, Component }, i) => (
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
				<Route path='*' element={<NotFound />} />
			</Routes>
		</BrowserRouter>
	);
};
