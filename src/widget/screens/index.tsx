import { useWidgetState } from '../libs/WidgetContext';
import Booking from './Booking';
import SearchBar from './SearchBar';
import Success from './Success';
import TourList from './TourList';

const Screens = () => {
	const { state, redirects } = useWidgetState();
	return (
		<>
			{state?.widget_screen !== 'booking' && state?.widget_screen !== 'success' ? (
				<SearchBar />
			) : null}
			{state?.widget_screen === 'list' && !redirects?.searchURL ? <TourList /> : null}
			{state?.widget_screen === 'booking' && !redirects?.bookingURL ? <Booking /> : null}
			{state?.widget_screen === 'success' && !redirects?.successURL ? <Success /> : null}
		</>
	);
};

export default Screens;
