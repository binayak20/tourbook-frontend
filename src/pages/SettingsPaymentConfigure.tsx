import { PaymentConfigureContainer } from '@/containers';
import { AccessBoundary } from 'react-access-boundary';

const SettingsPaymentConfigure = () => (
	<AccessBoundary to='VIEW_PAYMENTMETHODCONFIGURATION' isDefaultFallback>
		<PaymentConfigureContainer />
	</AccessBoundary>
);

export default SettingsPaymentConfigure;
