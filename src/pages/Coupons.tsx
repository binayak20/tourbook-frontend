import { CouponContainer } from '@/containers';
import { AccessBoundary } from 'react-access-boundary';

const Coupons = () => {
	return (
		<AccessBoundary to='VIEW_COUPON' isDefaultFallback>
			<CouponContainer />
		</AccessBoundary>
	);
};

export default Coupons;
