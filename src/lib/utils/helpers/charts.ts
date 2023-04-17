import { sm } from '../../constants/screenDimensions';
import { browser } from '$app/environment';
export const getResponsiveFontSize = (fontSize: number) => {
	if (browser) {
		if (window.innerWidth >= sm) {
			return fontSize;
		} else {
			return 0.75 * fontSize;
		}
	}
	return fontSize;
};
