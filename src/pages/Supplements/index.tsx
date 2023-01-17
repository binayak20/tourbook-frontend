import { SupplementsContainer } from '@/containers';
import { AccessBoundary } from 'react-access-boundary';

const Supplements = () => (
	<AccessBoundary to='VIEW_SUPPLEMENT' isDefaultFallback>
		<SupplementsContainer />
	</AccessBoundary>
);

export default Supplements;
