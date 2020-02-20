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

function arrayOfLen(length: number) {
	const values = []
	for (let i = 0; i < length; i++) {
		values.push(i)
	}
	console.log('values', values)
	return values
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
		() =>
			arrayOfLen(100).map(v => ({
				id: v,
				name: `Category ${v}`,
			})),
		[],
	)
	const categoryValues: ICategoryValueMap = useMemo(() => {
		const ary = arrayOfLen(100)
		return ary.reduce((prev, curr) => {
			prev[curr] = ary.map(v => ({
				start: v,
				end: v + 1,
				value: getRandomArbitrary(0, 100),
			}))
			return prev
		}, {} as ICategoryValueMap)
	}, [])
	const [selections, setSelections] = useState<ICategorySelectionMap>({})

	return (
		<HeatStreamsChart
			axisHeight={30}
			width={900}
			height={400}
			numTicks={20}
			rowHeight={20}
			categories={categories}
			categoryValues={categoryValues}
			dateAggregation={'years'}
			numericAggregation={1}
			colorizer={(value: any) => colorizer.color(value)}
			xDomain={[0, 100]}
			highlightColor={'#FF00FF'}
			selections={selections}
			showValues={true}
			onClickCategory={useCallback(
				(cat: ICategory, ctrl: boolean) => {
					const selection: ICategorySelectionMap = ctrl
						? {
								...selections,
								[cat.id]: !selections[cat.id],
						  }
						: {
								[cat.id]: !selections[cat.id],
						  }
					setSelections(selection)
				},
				[selections],
			)}
		/>
	)
}

export const ToStorybook = () => <InteractiveChart />
ToStorybook.story = {
	name: 'basic example',
}
