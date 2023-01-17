import { TransactionsContainer } from '@/containers';
import { AccessBoundary } from 'react-access-boundary';

const Transactions = () => (
	<AccessBoundary to='VIEW_TRANSACTION'>
		<TransactionsContainer />
	</AccessBoundary>
);

export default Transactions;
