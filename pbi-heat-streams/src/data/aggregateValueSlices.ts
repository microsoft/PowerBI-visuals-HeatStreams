/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import {
	DateAggregation,
	getSliceEnd,
	ICategoryValueMap,
	XDomain,
} from 'react-heat-streams'
import { mean } from 'd3-array'
import { ICategoryDataMap } from '../chart/types'

/**
 * Aggregates values into buckets using aggregation configs
 * @param data The raw data map
 * @param positionDomain The x domain
 * @param dateAggregation The date aggregation to use (if x is dates)
 * @param numericAggregation The numeric aggregation to use (if x is numbers)
 */
export function aggregateValueSlices(
	data: ICategoryDataMap,
	positionDomain: XDomain,
	dateAggregation: DateAggregation,
	numericAggregation: number,
): [
	ICategoryValueMap,
	/**
	 * value domain
	 */
	[number, number],
] {
	let valueMin = 0
	let valueMax = 0
	const isNumericDomain = typeof positionDomain[0] === 'number'

	const categoryIds = Object.keys(data)
	const result = categoryIds.reduce(
		(agg: ICategoryValueMap, current: string) => {
			// sort the category data ascending
			const categoryData = data[current]

			// Bucket out the values by their aggregated position (within day, within year, etc..)
			const valuePositions: { [dateCode: string]: number[] } = {}
			categoryData.forEach(cd => {
				if (cd.value !== undefined && cd.value !== null) {
					const start = isNumericDomain
						? `${cd.position}`
						: sliceStart(cd.position, dateAggregation).toUTCString()

					if (!valuePositions[start]) {
						valuePositions[start] = []
					}
					if (cd.value !== null) {
						if (valueMin === undefined || cd.value < valueMin) {
							valueMin = cd.value
						}
						if (valueMax === undefined || cd.value > valueMax) {
							valueMax = cd.value
						}
					}
					valuePositions[start].push(cd.value)
				}
			})

			const slices = Object.keys(valuePositions).map(vp => {
				const start = isNumericDomain ? parseInt(vp, 10) : new Date(vp)
				const end = getSliceEnd(start, numericAggregation, dateAggregation)
				return {
					start,
					end,
					value: <number>mean(valuePositions[vp]),
				}
			})
			agg[current] = slices
			return agg
		},
		<ICategoryValueMap>{},
	)

	return [result, [valueMin, valueMax]]
}

function sliceStart(date: Date, dateAggregation: DateAggregation): Date {
	const result = new Date(date)
	result.setUTCMilliseconds(0)
	result.setUTCSeconds(0)
	result.setUTCMinutes(0)

	if (dateAggregation === DateAggregation.Days) {
		result.setUTCHours(0)
	} else if (dateAggregation === DateAggregation.Months) {
		result.setUTCHours(0)
		result.setUTCDate(1)
	} else if (dateAggregation === DateAggregation.Years) {
		result.setUTCHours(0)
		result.setUTCDate(1)
		result.setUTCMonth(1)
	}

	return result
}
