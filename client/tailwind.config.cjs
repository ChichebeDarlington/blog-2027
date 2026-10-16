/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: { colors: { ink: '#17243A', electric: '#4361EE', paper: '#F7F8FA' }, fontFamily: { sans: ['Inter', 'ui-sans-serif', 'system-ui'], mono: ['ui-monospace', 'SFMono-Regular', 'monospace'] }, boxShadow: { soft: '0 16px 50px rgba(23, 36, 58, 0.08)' } } },
  daisyui: { themes: ['light', 'dark', { chichebe: { primary: '#4361EE', 'primary-content': '#ffffff', secondary: '#17243A', accent: '#7C91FF', neutral: '#17243A', 'base-100': '#ffffff', 'base-200': '#F7F8FA', 'base-300': '#E6EAF0', 'base-content': '#17243A', info: '#3B82F6', success: '#16845B', warning: '#D97706', error: '#DC2626' } }], darkTheme: 'dark' }, plugins: [require('daisyui'), require('@tailwindcss/typography')]
};
