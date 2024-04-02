import presetsConfig from 'svelte-components/tailwind-config';
/** @type {import('tailwindcss').Config} */
module.exports = {
	presets: [presetsConfig],
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/svelte-components/**/*.{html,js,svelte,ts}'
	],
	safelist: [
		'w-2',
		'h-9',
		'h-20',
		'h-32',
		'row-start-1',
		'row-start-2',
		'row-start-3',
		'row-start-4',
		'row-start-5',
		'row-start-6',
		'row-start-7',
		'row-start-8',
		'row-start-9',
		'row-start-10',
		'row-start-11',
		'row-start-12',
		'row-start-13',
		'row-start-14',
		'row-start-15',
		'row-start-16',
		'row-start-17',
		'row-start-18',
		'row-start-19',
		'row-start-20',
		'col-start-1',
		'col-start-2',
		'col-start-3',
		'col-start-4',
		'col-start-5',
		'col-start-6',
		'col-start-7',
		'col-start-8',
		'col-start-9',
		'col-start-10',
		'col-start-11',
		'col-start-12'
	],
	theme: {
		...presetsConfig.theme,
		extend: {
			...presetsConfig.theme.extend,
			boxShadow: {
				csm: '0px 2px 8px rgba(138, 141, 153, 0.16);',
				clg: '6px 6px 28px rgba(43, 47, 63, 0.100934)',
				fab: '0px 1px 6px rgba(138, 141, 153, 0.24);',
				top: '0px -2px 4px rgba(138, 141, 153, 0.16);'
			},
			colors: {
				...presetsConfig.theme.extend.colors,
				background: 'var(--BACKGROUND)',
				'background-alt': 'var(--BACKGROUND-ALT)'
			},
			spacing: {
				...presetsConfig.theme.extend.spacing,
				120: '30rem',
				160: '40rem',
				256: '64rem'
			},
			maxWidth: {
				...presetsConfig.theme.extend.maxWidth,
				11: '11rem',
				12: '12rem',
				21: '21rem',
				30: '30rem',
				'8xl': '85rem'
			},
			height: {
				...presetsConfig.theme.extend.height,
				15: '3.75rem',
				38: '9.5rem'
			},
			zIndex: {
				...presetsConfig.theme.extend.zIndex,
				60: '60',
				100: '100'
			},
			fontSize: {
				...presetsConfig.theme.extend.fontSize,
				'1xs': '0.6875rem',
				'2xs': '0.6250rem',
				'3xs': '0.5625rem'
			},
			backgroundOpacity: {
				...presetsConfig.theme.extend.backgroundOpacity,
				10: '0.10',
				12: '0.12'
			},
			inset: {
				...presetsConfig.theme.extend.inset,
				18: '4.5rem'
			},
			bottom: {
				...presetsConfig.theme.extend.bottom,
				18: '4.5rem'
			},
			gridRowStart: {
				...presetsConfig.theme.extend.gridRowStart,
				8: '8',
				9: '9',
				10: '10',
				11: '11',
				12: '12',
				13: '13',
				14: '14',
				15: '15',
				16: '16',
				17: '17',
				18: '18',
				19: '19',
				20: '20'
			},
			gridColumnStart: {
				...presetsConfig.theme.extend.gridColumnStart,
				8: '8',
				9: '9',
				10: '10',
				11: '11',
				12: '12'
			},
			keyframes: {
				...presetsConfig.theme.extend.keyframes,
				slideInFromBottom: {
					'0%': {
						position: 'relative',
						top: '100%'
					},
					'100%': {
						position: 'relative',
						top: '0'
					}
				},
				slideOutFromTop: {
					'0%': {
						position: 'relative',
						top: '0'
					},
					'100%': {
						position: 'relative',
						top: '100%'
					}
				}
			},
			animation: {
				...presetsConfig.theme.extend.animation,
				slideUp: '0.5s slideInFromBottom',
				slideDown: '0.5s slideOutFromTop',
				'bounce-2': 'bounce 1s 2.5'
			},
			borderColor: {
				DEFAULT: 'var(--BORDER)'
			},
			flex: {
				0.7: '0.7',
				0.3: '0.3',
				0.2: '0.2',
				0.8: '0.8'
			}
		}
	},
	daisyui: {
		themes: false
	},
	plugins: [require('daisyui')]
};
