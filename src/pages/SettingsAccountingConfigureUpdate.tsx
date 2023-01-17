import { SettingsAccountingConfigureCreateContainer } from '@/containers';
import { AccessBoundary } from 'react-access-boundary';

const SettingsAccountingConfigureUpdate = () => (
	<AccessBoundary to='CHANGE_ACCOUNTINGSERVICEPROVIDERCONFIGURATION' isDefaultFallback>
		<SettingsAccountingConfigureCreateContainer />
	</AccessBoundary>
);

export default SettingsAccountingConfigureUpdate;
