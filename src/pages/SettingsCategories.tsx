import { SettingsCategoriesContainer } from '@/containers';
import { AccessBoundary } from 'react-access-boundary';

const SettingsCategories = () => (
	<AccessBoundary to='VIEW_CATEGORY' isDefaultFallback>
		<SettingsCategoriesContainer />
	</AccessBoundary>
);

export default SettingsCategories;
