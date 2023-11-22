import { Suspense } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import { GlobalStyles } from './assets/styles/styled';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Spin } from './components/atoms';
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
			<QueryClientProvider client={queryClient}>
				<ConfigurationsProvider loading={<Spin type='window-centre' size='large' noColor />}>
					<Suspense fallback={<Spin type='window-centre' size='large' />}>
						<PersistGate loading={<Spin type='window-centre' size='large' />} persistor={persistor}>
							<ErrorBoundary>
								<BaseRoutes />
								<GlobalStyles />
							</ErrorBoundary>
						</PersistGate>
					</Suspense>
				</ConfigurationsProvider>
			</QueryClientProvider>
		</Provider>
	);
};

export default App;
