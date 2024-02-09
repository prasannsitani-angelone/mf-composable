import type { Tags } from './ITags';

export interface CalculatedValue {
	matuarityAmount?: number;
	totalInvestment?: number;
	investedAmount?: number;
	selectedYear?: number;
	selectedDuration?: Tags;
	gainLossPercentage?: number;
	capitalGainSlider?: number;
	capitalGain?: number;
	currentCalculatorMode?: string;
	selectedReturn?: number;
	categoryName?: string;
	isDefaultReturn?: boolean;
}
