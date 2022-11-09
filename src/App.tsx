import { ConfigProvider } from 'antd';
import { Suspense } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import { GlobalStyles } from './assets/styles/styled';
import { Spin } from './components/atoms';
import { ErrorBoundary } from './components/ErrorBoundary';
import ConfigurationsProvider from './components/providers/ConfigurationsProvider';
import { BaseRoutes } from './routes';
import { persistor, store } from './store';

const App = () => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				refetchOnWindowFocus: false,
				retry: false,
			},
		},
	});

	return (
		<Provider store={store}>
			<Suspense fallback={<Spin type='window-centre' size='large' />}>
				<PersistGate loading={<Spin type='window-centre' size='large' />} persistor={persistor}>
					<QueryClientProvider client={queryClient}>
						<ErrorBoundary>
							<ConfigProvider>
								<ConfigurationsProvider loading={<Spin type='window-centre' size='large' />}>
									<BaseRoutes />
								</ConfigurationsProvider>
								<GlobalStyles />
							</ConfigProvider>
						</ErrorBoundary>
					</QueryClientProvider>
				</PersistGate>
			</Suspense>
		</Provider>
	);
};

export default App;
