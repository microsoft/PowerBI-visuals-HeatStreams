/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
const path = require('path')
const packageJson = require(path.join(process.cwd(), 'package.json'))
const browsers = packageJson.browserslist || ['> 0.25%, not dead']

module.exports = {
	presets: [
		[
			'@babel/preset-env',
			{
				modules: false,
				targets: {
					browsers,
				},
        useBuiltIns: 'usage',
        corejs: { version: 3 }
			},
		],
	],
	plugins: [
		'@babel/proposal-class-properties',
		'@babel/proposal-object-rest-spread',
		'@babel/plugin-proposal-optional-chaining',
	],
}
