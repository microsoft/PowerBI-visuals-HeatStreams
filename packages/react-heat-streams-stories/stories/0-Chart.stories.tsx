/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { useCallback, useState, useMemo } from 'react'
import {
	HeatStreamsChart,
	ICategory,
	ICategoryValueMap,
	ICategorySelectionMap,
} from 'react-heat-streams'
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
function getRandomArbitrary(min: number, max: number) {
	return Math.random() * (max - min) + min
}

function InteractiveChart() {
	const colorizer = useMemo(() => {
		const colorScheme = 'RdBu'
		const isLogScale = false
		const valueMin = 0
		const valueMid = 50
		const valueMax = 100
		const scaler = isDivergingColorScheme(colorScheme)
			? new DivergingScaler(valueMin, valueMid, valueMax, isLogScale)
			: new LinearScaler(valueMin, valueMax, isLogScale)
		return new Colorizer(scaler, colorScheme)
	}, [])
	const categories: ICategory[] = useMemo(
		() => [
			{ id: 1, name: 'Category 1' },
			{ id: 2, name: 'Category 2' },
			{ id: 3, name: 'Category 3' },
		],
		[],
	)
	const categoryValues: ICategoryValueMap = useMemo(() => {
		const values = []
		for (let i = 0; i < 100; i++) {
			values.push(i)
		}
		return {
			'1': values.map(v => ({
				start: v,
				end: v + 1,
				value: getRandomArbitrary(0, 100),
			})),
			'2': values.map(v => ({
				start: v,
				end: v + 1,
				value: getRandomArbitrary(0, 100),
			})),
			'3': values.map(v => ({
				start: v,
				end: v + 1,
				value: getRandomArbitrary(0, 100),
			})),
		}
	}, [])
	const [selections, setSelections] = useState<ICategorySelectionMap>({})

	return (
		<HeatStreamsChart
			axisHeight={30}
			width={900}
			height={600}
			numTicks={20}
			rowHeight={20}
			categories={categories}
			categoryValues={categoryValues}
			dateAggregation={'years'}
			numericAggregation={1}
			colorizer={(value: any) => colorizer.color(value)}
			xDomain={[0, 100]}
			highlightColor={'#FF0000'}
			selections={selections}
			onClickCategory={useCallback((cat: ICategory, ctrl: boolean) => {
				console.log('click cat', cat, ctrl)
				setSelections({ [cat.id]: cat })
			}, [])}
		/>
	)
}

export const ToStorybook = () => <InteractiveChart />
ToStorybook.story = {
	name: 'to Storybook',
}
