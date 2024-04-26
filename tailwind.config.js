import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		screens: Object.fromEntries(
			Object.entries(defaultTheme.screens).filter(([key]) => key !== '2xl')
		),
		extend: {
			fontFamily: {
				sans: ['Lato', ...defaultTheme.fontFamily.sans],
				bebas: ['"Bebas Neue"']
			}
		}
	},
	plugins: []
};
