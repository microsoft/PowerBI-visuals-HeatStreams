/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-var-requires */
import {
	ICategoryData,
	ICategoryDataMap,
	IChartData,
	IVisualDataOptions,
} from '../chart/interfaces'
import { coalesceValueSlices } from './coalesceValueSlices'
import { determinePositionDomain } from './determinePositionDomain'
import { sortCategories } from './sortCategories'

const get = require('lodash/get')

export function convertCategoricalDataView(
	dataView: any,
	options: IVisualDataOptions,
): IChartData {
	const { categorical } = dataView

	let categories = get(categorical, 'categories[0].values', []).map(
		(t, index) => ({
			id: index,
			name: (t || '').toString(),
		}),
	)

	const categoryData: ICategoryDataMap = {}
	categories.forEach(category => {
		categoryData[category.id] = categorical.values.map(
			(categoricalValue: any) => {
				const position = categoricalValue.source.groupName
				const value = categoricalValue.values[category.id]
				return { position, value } as ICategoryData
			},
		)
	})

	const positionDomain = determinePositionDomain(categoryData, options)
	const valueSlices = coalesceValueSlices(
		categoryData,
		positionDomain,
		options.dateAggregation,
		options.numericAggregation,
	)

	categories = sortCategories(categories, categoryData, options)
	const result = {
		categories,
		categoryData,
		...valueSlices,
		positionDomain,
	}
	return result
}
