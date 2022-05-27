import { Spin } from 'antd';
import { Suspense } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles } from './assets/styles/styled';
import { ErrorBoundary } from './components/ErrorBoundary';
import { defaultTheme } from './config';
import { BaseRoutes } from './routes';
import { persistor, store } from './store';

const App = () => (
	<Provider store={store}>
		<Suspense fallback={<Spin className='SuspenseLoader' size='large' />}>
			<PersistGate loading={<Spin className='SuspenseLoader' size='large' />} persistor={persistor}>
				<ErrorBoundary>
					<ThemeProvider theme={defaultTheme}>
						<BaseRoutes />
					</ThemeProvider>
					<GlobalStyles />
				</ErrorBoundary>
			</PersistGate>
		</Suspense>
	</Provider>
);

export default App;
