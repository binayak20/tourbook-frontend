import { createContext, useContext, useState } from 'react';

type Props = {
	bookingInfo: API.BookingSingle;
	setBookingInfo: React.Dispatch<React.SetStateAction<API.BookingSingle>>;
	calculatedPrice: API.BookingCostResponse;
	setCalculatedPrice: React.Dispatch<React.SetStateAction<API.BookingCostResponse>>;
	isDisabled: boolean;
	setDisabled: React.Dispatch<React.SetStateAction<boolean>>;
};

const BookingContext = createContext<Props>(undefined as unknown as Props);

// eslint-disable-next-line @typescript-eslint/ban-types
export const BookingProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
	const [bookingInfo, setBookingInfo] = useState<API.BookingSingle>({} as API.BookingSingle);
	const [calculatedPrice, setCalculatedPrice] = useState<API.BookingCostResponse>(
		{} as API.BookingCostResponse
	);
	const [isDisabled, setDisabled] = useState(false);

	return (
		<BookingContext.Provider
			value={{
				bookingInfo,
				setBookingInfo,
				calculatedPrice,
				setCalculatedPrice,
				isDisabled,
				setDisabled,
			}}
		>
			{children}
		</BookingContext.Provider>
	);
};

export const useBookingContext = () => {
	const context = useContext(BookingContext);

	if (context === undefined) {
		throw new Error('useBookingContext must be used within a BookingProvider');
	}

	return context;
};
