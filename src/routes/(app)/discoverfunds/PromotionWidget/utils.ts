import type { ScreenedSchemes } from '$lib/types/Screener';

export const getEventMetaData = (
	index: number,
	header: string,
	currentScheme: ScreenedSchemes
) => ({
	page: index + 1,
	heading: header,
	Fundname: currentScheme.schemeName,
	bottommessage: `${currentScheme.noOfClientInvested} people invested in this fund`
});
