/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as React from 'react'
import { HeatStreamsChart } from '../src/index'
import {
	Colorizer,
	DivergingScaler,
	isDivergingColorScheme,
	LinearScaler,
} from '@essex/d3-coloring-scales'

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

export const ToStorybook = () => (
	<HeatStreamsChart
		axisHeight={30}
		width={800}
		height={500}
		numTicks={20}
		rowHeight={30}
		categories={[]}
		categoryValues={{}}
		numericAggregation={1}
		colorizer={colorizer.color}
		xDomain={[0, 100]}
		highlightColor={'#FF0000'}
	/>
)

ToStorybook.story = {
	name: 'to Storybook',
}
