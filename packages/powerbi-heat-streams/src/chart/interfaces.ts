/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Colorizer } from '@essex/d3-coloring-scales'
import {
	DateAggregation,
	ICategory,
	ICategoryValueMap,
	XDomain,
	TimeDomain,
} from 'react-heat-streams'

export interface ICategoryData {
	position: Date
	value: number
}

export interface IChartData {
	categories: ICategory[]
	categoryData: ICategoryDataMap
	categoryValues: ICategoryValueMap
	positionDomain: XDomain
	valueDomain: [number, number]
}

export type SortBy = 'name' | 'average' | 'max' | 'density'

export interface IVisualDataOptions {
	valueMin: number | undefined
	valueMax: number | undefined
	scoreSplit: number | undefined
	numericAggregation: number
	dateAggregation: DateAggregation
	isLogScale: boolean
	sortBy: SortBy
	sortInvert: boolean
}

export interface IVisualRenderingOptions {
	highlightColor: string
	rowHeight: number
	categoryTextPercent: number
	axisHeight: number
	rowGap: boolean
	colorScheme: string
	zoomLevel: number
	numTicks: number
	showValues: boolean
	showCategories: boolean
}

export interface IChartProps {
	options: IChartOptions
}

export interface ICategoryDataMap {
	[key: string]: ICategoryData[]
}

export interface IChartOptions {
	renderOptions: IVisualRenderingOptions
	dataOptions: IVisualDataOptions
	data: IChartData
	selections: { [key: string]: ICategory }
	timeScrub: TimeDomain | null
	width: number
	height: number
	colorizer: Colorizer
	element: HTMLElement
}
