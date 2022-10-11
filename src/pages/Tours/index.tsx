import { ToursContainer } from '@/containers';
import { AccessBoundary } from 'react-access-boundary';

const Tours = () => (
	<AccessBoundary to='VIEW_TOUR' isDefaultFallback>
		<ToursContainer />
	</AccessBoundary>
);

export default Tours;
