/*
 *  Power BI Visual CLI
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
'use strict'
import * as d3 from 'd3'
import { ICategoryDataMap } from '../chart/interfaces'
import {
	DateAggregation,
	ICategoryValueMap,
	XDomain,
} from '@essex/react-heat-streams'

function sliceStart(
	date: Date,
	dateAggregation: DateAggregation,
	positionDomain: [Date, Date],
): Date {
	const result = new Date(date)
	result.setUTCMilliseconds(0)
	result.setUTCSeconds(0)
	result.setUTCMinutes(0)

	if (dateAggregation === 'days') {
		result.setUTCHours(0)
	} else if (dateAggregation === 'months') {
		result.setUTCHours(0)
		result.setUTCDate(1)
	} else if (dateAggregation === 'years') {
		result.setUTCHours(0)
		result.setUTCDate(1)
		result.setUTCMonth(1)
	}

	if (
		positionDomain[0] !== undefined &&
		result.getTime() < positionDomain[0].getTime()
	) {
		return positionDomain[0]
	}
	return result
}

export default function coalesceValueSlices(
	data: ICategoryDataMap,
	positionDomain: XDomain,
	dateAggregation: DateAggregation,
) {
	let valueMin: number
	let valueMax: number
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
						: sliceStart(cd.position, dateAggregation, positionDomain as [
								Date,
								Date
							]).toUTCString()

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
				return {
					start,
					value: d3.mean(valuePositions[vp]),
				}
			})
			agg[current] = slices
			return agg
		},
		{} as ICategoryValueMap,
	) as ICategoryValueMap

	return {
		categoryValues: result,
		valueDomain: [valueMin, valueMax] as [number, number],
	}
}
