import { browser } from '$app/environment';

const hexToRgb = (hexColor: string): { r: number; g: number; b: number } => {
	// Remove the '#' if present
	hexColor = hexColor.replace(/^#/, '');

	// Expand short-form hex codes to full-form
	if (hexColor.length === 3) {
		hexColor = hexColor
			.split('')
			.map((char) => char + char)
			.join('');
	}

	// Parse the hex color components
	const r: number = parseInt(hexColor.substring(0, 2), 16);
	const g: number = parseInt(hexColor.substring(2, 4), 16);
	const b: number = parseInt(hexColor.substring(4, 6), 16);

	// Return the RGB values as an object
	return { r, g, b };
};

export const getCssVar = (varName: string) => {
	const elementById = browser ? document?.getElementById('theme-layout') : null;
	if (!elementById) {
		return '';
	}
	return getComputedStyle(elementById).getPropertyValue(varName);
};

export const getRGBACssVar = (varName: string, opacity: number) => {
	const hex = getCssVar(varName);
	const rgb = hexToRgb(hex);

	return `rgba(${rgb.r} ${rgb.g} ${rgb.b} / ${opacity})`;
};
