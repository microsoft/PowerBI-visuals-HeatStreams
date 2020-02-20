module.exports = {
	stories: ['../stories/**/*.stories.tsx', '../stories/**/*.stories.ts'],
	addons: [
		'@storybook/preset-typescript',
		'@storybook/addon-actions',
		'@storybook/addon-links',
		'@storybook/addon-a11y',
		'@storybook/addon-knobs',
	],
	webpackFinal: async config => {
		config.module.rules.push({
			test: /\.(ts|tsx)$/,
			use: [
				{
					loader: require.resolve('ts-loader'),
				},
				{
					loader: require.resolve('react-docgen-typescript-loader'),
				},
			],
		})
		config.resolve.extensions.push('.ts', '.tsx')
		return config
	},
}
