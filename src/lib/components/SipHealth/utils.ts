import { SIP_HEALTH_SCORE_LIMIT_AVERAGE, SIP_HEALTH_SCORE_LIMIT_GOOD } from './constants';
import { getCssVar } from '$lib/utils/colors';

export const getColorSchemeForScore = (score: number): ColorObject => {
	if (score >= SIP_HEALTH_SCORE_LIMIT_GOOD) return Colors.Green;
	if (score >= SIP_HEALTH_SCORE_LIMIT_AVERAGE) return Colors.Yellow;
	return Colors.Red;
};

type ColorObject = { primary: string; secondary: string };

const Colors: { [name: string]: ColorObject } = {
	Red: { primary: getCssVar('--SELL'), secondary: getCssVar('--TINT24-SELL') },
	Yellow: { primary: getCssVar('--SECONDARY'), secondary: getCssVar('--TINT24-SECONDARY') },
	Green: { primary: getCssVar('--BUY'), secondary: getCssVar('--TINT24-BUY') }
};
