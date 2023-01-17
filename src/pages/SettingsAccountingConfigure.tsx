import { SettingsAccountingConfigureContainer } from '@/containers';
import { AccessBoundary } from 'react-access-boundary';

const SettingsAccountingConfigure = () => (
	<AccessBoundary to='VIEW_ACCOUNTINGSERVICEPROVIDERCONFIGURATION' isDefaultFallback>
		<SettingsAccountingConfigureContainer />
	</AccessBoundary>
);

export default SettingsAccountingConfigure;
