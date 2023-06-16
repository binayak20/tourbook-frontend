import { useWidgetState } from '../libs/WidgetContext';
import '../styles/tours.less';

const Booking = () => {
	const { state } = useWidgetState();

	if (state?.widget_screen !== 'booking') return null;

	return <>booking</>;
};

export default Booking;
