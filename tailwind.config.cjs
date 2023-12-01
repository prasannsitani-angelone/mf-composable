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
		extend: {
			boxShadow: {
				csm: '0px 2px 8px rgba(138, 141, 153, 0.16);',
				clg: '6px 6px 28px rgba(43, 47, 63, 0.100934)',
				fab: '0px 1px 6px rgba(138, 141, 153, 0.24);',
				top: '0px -2px 4px rgba(138, 141, 153, 0.16);'
			},
			colors: {
				...presetsConfig.theme.extend.colors,
				black: {
					title: '#2A394E',
					DEFAULT: '#000',
					neutral: '#1D1E20',
					key: '#181F29',
					bolder: '#425061'
				},
				blue: {
					primary: '#3F5BD9',
					background: '#F4F6FB',
					gradient: '#00198A',
					sell: '#667FFF'
				},
				grey: {
					DEFAULT: '#F4F6FB',
					disabled: '#C2C6CC',
					body: '#6A7582',
					line: '#E8EBF1',
					dark: '#5d5e63',
					light: '#f5f6fa',
					medium: '#919294',
					dashed: '#ADBBD7',
					separator: '#D9D9D9',
					secondary: '#ACB2BD'
				},
				green: {
					buy: '#1EC7B6',
					tinted: '#E0F7F5',
					DEFAULT: '#E4F8F6',
					lite: '#E4F6F5',
					amount: '#008F75',
					teal: '#007560',
					pale: '#F4FCFB'
				},
				red: {
					sell: '#F65E5A',
					error: '#FEECEB',
					tint: '#FDD8D7',
					errorDark: '#D64D4D',
					light: '#FAEAEA'
				},
				white: {
					DEFAULT: '#FFFFFF'
				},
				yellow: {
					primary: '#F9BA4D',
					secondary: '#F9BA4D',
					background: '#FEF7EA'
				},
				purple: {
					primary: '#581DBE',
					glow: '#EBE4F7',
					background: '#E8EBFA',
					light: '#E6E0F6'
				},
				tulip: {
					DEFAULT: '#FF928E'
				}
			},
			spacing: {
				120: '30rem',
				160: '40rem',
				256: '64rem'
			},
			maxWidth: {
				11: '11rem',
				12: '12rem',
				21: '21rem',
				30: '30rem',
				'8xl': '85rem'
			},
			height: {
				15: '3.75rem',
				38: '9.5rem'
			},
			zIndex: {
				60: '60',
				100: '100'
			},
			fontSize: {
				'1xs': '0.6875rem',
				'2xs': '0.6250rem',
				'3xs': '0.5625rem'
			},
			backgroundOpacity: {
				12: '0.12'
			},
			inset: {
				18: '4.5rem'
			},
			bottom: {
				18: '4.5rem'
			},
			gridRowStart: {
				8: '8',
				9: '9',
				10: '10',
				11: '11',
				12: '12'
			},
			gridColumnStart: {
				8: '8',
				9: '9',
				10: '10',
				11: '11',
				12: '12'
			}
		}
	},
	daisyui: {
		themes: false
	},
	plugins: [require('daisyui')]
};
