import { SettingsAccountingConfigureCreateContainer } from '@/containers';
import { AccessBoundary } from 'react-access-boundary';

const SettingsAccountingConfigureCreate = () => (
	<AccessBoundary to='ADD_ACCOUNTINGSERVICEPROVIDERCONFIGURATION' isDefaultFallback>
		<SettingsAccountingConfigureCreateContainer />
	</AccessBoundary>
);

export default SettingsAccountingConfigureCreate;
