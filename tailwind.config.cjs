/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			boxShadow: {
				csm: '0px 2px 8px rgba(138, 141, 153, 0.16);',
				clg: '6px 6px 28px rgba(43, 47, 63, 0.100934)',
				fab: '0px 1px 6px rgba(138, 141, 153, 0.24);'
			},
			colors: {
				black: {
					title: '#2A394E',
					DEFAULT: '#000',
					neutral: '#1D1E20',
					key: '#181F29'
				},
				blue: {
					primary: '#3F5BD9',
					background: '#F4F6FB'
				},
				grey: {
					DEFAULT: '#F4F6FB',
					disabled: '#C2C6CC',
					body: '#6A7582',
					line: '#E8EBF1',
					dark: '#5d5e63',
					light: '#f5f6fa',
					medium: '#919294'
				},
				green: {
					buy: '#1EC7B6',
					tinted: '#E0F7F5',
					DEFAULT: '#E4F8F6',
					lite: '#E4F6F5'
				},
				red: {
					sell: '#F65E5A',
					error: '#FEECEB',
					tint: '#FDD8D7',
					errorDark: '#D64D4D'
				},
				white: {
					DEFAULT: '#FFFFFF'
				},
				yellow: {
					primary: '#F9BA4D',
					secondary: '#F9BA4D',
					background: '#FEF7EA'
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
				15: '3.75rem'
			},
			zIndex: {
				60: '60'
			},
			backgroundOpacity: {
				12: '0.12'
			}
		}
	},
	plugins: [require('daisyui')]
};
