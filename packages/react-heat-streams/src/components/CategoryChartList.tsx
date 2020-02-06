/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as React from 'react'
import { memo } from 'react'
import {
	ICategory,
	ICategoryValueMap,
	IColorizer,
	IScaler,
	XDomain,
} from '../interfaces'
import { CategoryChart } from './CategoryChart'

export interface ICategoryChartListProps {
	categories: ICategory[]
	categoryValues: ICategoryValueMap
	xScale: IScaler
	colorizer: IColorizer
	rowHeight: number
	showValues: boolean
	width: number
	highlightColor: string
	isCategorySelected: (input: ICategory) => boolean
	categoryY: (input: number) => number
	sliceWidth: number
	xPan: number
	xDomain: XDomain
}

export const CategoryChartList: React.FC<ICategoryChartListProps> = memo(
	({
		categories,
		categoryValues,
		xScale,
		colorizer,
		rowHeight,
		showValues,
		width,
		highlightColor,
		isCategorySelected,
		categoryY,
		sliceWidth,
		xPan,
		xDomain,
	}) => {
		const charts = categories.map((cat, index) => (
			<CategoryChart
				key={cat.id}
				category={cat}
				categoryData={categoryValues[cat.id]}
				colorizer={colorizer}
				xScale={xScale}
				xPan={xPan}
				xDomain={xDomain}
				rowHeight={rowHeight}
				showValues={showValues}
				width={width}
				highlightColor={highlightColor}
				selected={isCategorySelected(cat)}
				y={categoryY(index)}
				sliceWidth={sliceWidth}
			/>
		))
		return <g className="category-charts">{charts}</g>
	},
)
