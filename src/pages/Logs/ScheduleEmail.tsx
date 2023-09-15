import { ScheduleEmailsContainer } from '@/containers';
import { AccessBoundary } from 'react-access-boundary';

const ScheduleEmail = () => (
	<AccessBoundary to='VIEW_EMAILLOG' isDefaultFallback>
		<ScheduleEmailsContainer />
	</AccessBoundary>
);

export default ScheduleEmail;
