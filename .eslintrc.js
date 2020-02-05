const jsRuleSets = [
	/* Base Rulesets */
	'eslint:recommended',
	'react-app',
	'plugin:jsx-a11y/recommended',
	/* Testing Rules */
	'plugin:jest/recommended',
	'plugin:jest/style',
	/* Disable style-based eslint rules */
	'prettier',
	'prettier/react',
]
module.exports = {
	plugins: [
		'header',
		'@typescript-eslint',
		'jsx-a11y',
		'jest',
	],
	env: {
		node: true,
		browser: true,
		es2020: true,
		jest: true,
	},
	overrides: [
		{
			files: '*.ts*',
			parser: '@typescript-eslint/parser',
			extends: [
				...jsRuleSets,
				/* TypeScript Rules */
				'plugin:@typescript-eslint/recommended',
				/* Disable TypeScript styling rules */
				'prettier/@typescript-eslint',
			],
		},
		{
			files: '*.js*',
			extends: jsRuleSets,
			extends: [...jsRuleSets, 'prettier/babel'],
			parserOptions: {
				parser: 'babel-eslint',
				ecmaVersion: 2018,
				sourceType: 'module',
				ecmaFeatures: {
					jsx: true,
					modules: true,
				},
			},
		},
	],
	rules: {
		'header/header': [2, 'header.js'],

		// Custom Rules
		'@essex/adjacent-await': 'warn',

		// Rules that we don"t find useful
		'no-plusplus': 0,
		'@typescript-eslint/interface-name-prefix': 0,
	},
}
