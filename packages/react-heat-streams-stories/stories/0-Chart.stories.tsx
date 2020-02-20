/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as React from 'react'
import { HeatStreamsChart, ICategoryValueMap } from 'react-heat-streams'
import {
	Colorizer,
	DivergingScaler,
	isDivergingColorScheme,
	LinearScaler,
} from '@essex/d3-coloring-scales'

require('react-heat-streams/style/heat-streams.css')

export default {
	title: 'HeatStreamsChart',
	component: HeatStreamsChart,
}

const colorScheme = 'RdBu'
const valueMin = 0
const valueMid = 50
const valueMax = 100
const isLogScale = false
const scaler = isDivergingColorScheme(colorScheme)
	? new DivergingScaler(valueMin, valueMid, valueMax, isLogScale)
	: new LinearScaler(valueMin, valueMax, isLogScale)
const colorizer = new Colorizer(scaler, colorScheme)
const categories = [
	{ id: 1, name: 'Pikachu' },
	{ id: 2, name: 'Squirtle' },
	{ id: 3, name: 'Evee' },
]
const categoryValues: ICategoryValueMap = {
	'1': [{ start: 0, end: 1, value: 30 }],
	'2': [{ start: 0, end: 1, value: 30 }],
	'3': [{ start: 0, end: 1, value: 30 }],
}

export const ToStorybook = () => (
	<HeatStreamsChart
		axisHeight={30}
		width={900}
		height={600}
		numTicks={20}
		rowHeight={50}
		categories={categories}
		categoryValues={categoryValues}
		dateAggregation={'years'}
		numericAggregation={1}
		colorizer={(value: any) => colorizer.color(value)}
		xDomain={[0, 100]}
		highlightColor={'#FF0000'}
	/>
)

ToStorybook.story = {
	name: 'to Storybook',
}
