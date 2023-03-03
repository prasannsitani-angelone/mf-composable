export const BUTTON_STYLE = new Map([
	[
		'contained',
		new Map([
			['primary', 'bg-blue-primary hover:bg-blue-primary text-white disabled:bg-opacity-50'],
			['greenBuy', 'bg-green-buy hover:bg-green-buy text-white disabled:bg-opacity-50'],
			['secondary', 'bg-cyan-500 hover:bg-cyan-700 text-white']
		])
	],
	[
		'outlined',
		new Map([['primary', 'bg-white hover:bg-white border border-blue-primary text-blue-primary']])
	],
	['text', new Map([['primary', 'text-sm font-semibold text-blue-primary p-0']])]
]);
