/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo, useMemo, useState, useCallback } from 'react'
import {
	HeatStreamsChart,
	DateAggregation,
	ICategory,
	ICategoryValueMap,
	ICategorySelectionMap,
	XDomain,
} from 'react-heat-streams'
import {
	Colorizer,
	DivergingScaler,
	isDivergingColorScheme,
	LinearScaler,
} from '@essex/d3-coloring-scales'

require('react-heat-streams/style/heat-streams.css')

export interface InteractiveChartProps {
	width: number
	height: number
	valueMin: number
	valueMid: number
	valueMax: number
	rowHeight: number
	axisHeight: number
	numTicks: number
}

export const InteractiveChart: React.FC<InteractiveChartProps> = memo(
	function InteractiveChart({
		width,
		height,
		valueMin,
		valueMid,
		valueMax,
		rowHeight,
		axisHeight,
		numTicks,
	}) {
		const colorizer = useMemo(() => {
			const colorScheme = 'RdBu'
			const isLogScale = false
			const scaler = isDivergingColorScheme(colorScheme)
				? new DivergingScaler(valueMin, valueMid, valueMax, isLogScale)
				: new LinearScaler(valueMin, valueMax, isLogScale)
			return new Colorizer(scaler, colorScheme)
		}, [valueMin, valueMax, valueMid])

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
		const colorizerFn = useCallback((value: any) => colorizer.color(value), [
			colorizer,
		])
		const xDomain = useMemo<XDomain>(() => [0, 100], [])

		return (
			<HeatStreamsChart
				// Required Props
				categories={categories}
				categoryValues={categoryValues}
				width={width}
				height={height}
				colorizer={colorizerFn}
				// Optional Props
				numericAggregation={1}
				dateAggregation={DateAggregation.Days}
				numTicks={numTicks}
				rowHeight={rowHeight}
				axisHeight={axisHeight}
				xDomain={xDomain}
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
	},
)

function getRandomArbitrary(min: number, max: number) {
	return Math.random() * (max - min) + min
}

function arrayOfLen(length: number) {
	const values = []
	for (let i = 0; i < length; i++) {
		values.push(i)
	}
	return values
}
