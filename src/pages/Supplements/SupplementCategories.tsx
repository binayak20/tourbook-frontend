import { SupplementCategoriesContainer } from '@/containers';
import { AccessBoundary } from 'react-access-boundary';

const SupplementCategories = () => (
	<AccessBoundary to='VIEW_SUPPLEMENTCATEGORY' isDefaultFallback>
		<SupplementCategoriesContainer />
	</AccessBoundary>
);

export default SupplementCategories;
