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
// tslint:disable no-var-requires

'use strict'
import {
	ICategoryData,
	ICategoryDataMap,
	IChartData,
	IVisualDataOptions,
} from '../chart/interfaces'
import coalesceValueSlices from './coalesceValueSlices'
import determinePositionDomain from './determinePositionDomain'
import sortCategories from './sortCategories'

const get = require('lodash/get')

export default function convertCategoricalDataView(
	dataView: any,
	options: IVisualDataOptions,
): IChartData {
	const { categorical } = dataView

	let categories = get(
		categorical,
		'categories[0].values',
		[],
	).map((t, index) => ({
		id: index,
		name: (t || '').toString(),
	}))

	const categoryData: ICategoryDataMap = {}
	categories.forEach(category => {
		categoryData[category.id] = categorical.values.map(categoricalValue => {
			const position = categoricalValue.source.groupName
			const value = categoricalValue.values[category.id]
			return { position, value } as ICategoryData
		})
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
