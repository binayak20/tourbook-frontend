import { routeNavigate } from '@/routes/utils';
import { FC } from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword: FC = () => (
	<div>
		<p>Forgot password</p>
		<Link to={routeNavigate('SIGNIN')}>Back to sing in</Link>
	</div>
);

export default ForgotPassword;
