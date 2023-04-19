export const BUTTON_STYLE = new Map([
	[
		'contained',
		new Map([
			['primary', 'bg-blue-primary hover:bg-blue-primary text-white'],
			['secondary', 'bg-cyan-500 hover:bg-cyan-500 text-white'],
			['success', 'bg-green-buy hover:bg-green-buy text-white disabled:bg-opacity-50']
		])
	],
	[
		'outlined',
		new Map([
			[
				'primary',
				'bg-white hover:bg-white !border border-blue-primary hover:border-blue-primary text-blue-primary'
			],
			[
				'secondary',
				'bg-white hover:bg-white !border border-grey-line hover:border-grey-line text-grey-line'
			],
			[
				'success',
				'bg-white hover:bg-white !border border-green-buy hover:border-green-buy text-green-buy'
			]
		])
	],
	[
		'transparent',
		new Map([['primary', 'bg-transparent hover:bg-transparent text-sm text-blue-primary']])
	]
]);
