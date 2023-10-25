import { SIP_HEALTH_SCORE_LIMIT_AVERAGE, SIP_HEALTH_SCORE_LIMIT_GOOD } from './constants';

export const getColorSchemeForScore = (score: number): ColorObject => {
	if (score >= SIP_HEALTH_SCORE_LIMIT_GOOD) return Colors.Green;
	if (score >= SIP_HEALTH_SCORE_LIMIT_AVERAGE) return Colors.Yellow;
	return Colors.Red;
};

type ColorObject = { primary: string; secondary: string };

const Colors: { [name: string]: ColorObject } = {
	Red: { primary: '#D64D4D', secondary: '#F5D4D4' },
	Yellow: { primary: '#F9BA4D', secondary: '#FEEED4' },
	Green: { primary: '#008F75', secondary: '#008F7575' }
};
