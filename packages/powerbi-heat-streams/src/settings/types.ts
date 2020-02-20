/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DateAggregation } from 'react-heat-streams'
import { SortBy } from '../types'

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
	invertColors: boolean
}

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
