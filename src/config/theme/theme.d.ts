import 'styled-components';

type ColorGray = 10;
type Colors = {
	primary: string;
	white: string;
	text: string;
	gray: Record<ColorGray, string>;
};

declare module 'styled-components' {
	export interface DefaultTheme {
		borderRadius: string;
		colors: Colors;
	}
}
