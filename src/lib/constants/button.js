export const BUTTON_STYLE = new Map([
	[
		'contained',
		new Map([
			['primary', 'bg-primary hover:bg-primary text-background-alt'],
			['secondary', 'bg-cyan-500 hover:bg-cyan-500 text-title'],
			['success', 'bg-buy hover:bg-buy text-title disabled:bg-opacity-50']
		])
	],
	[
		'outlined',
		new Map([
			[
				'primary',
				'bg-background hover:bg-background !border border-primary hover:border-primary text-primary'
			],
			[
				'secondary',
				'bg-background hover:bg-background !border border-border hover:border-border text-border'
			],
			['success', 'bg-background hover:bg-background !border border-buy hover:border-buy text-buy']
		])
	],
	[
		'transparent',
		new Map([['primary', 'bg-transparent hover:bg-transparent text-sm text-primary']])
	]
]);
