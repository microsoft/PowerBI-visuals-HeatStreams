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
import { ICategory } from '@essex/react-heat-streams'
import { IChartData, IVisualDataOptions } from '../chart/interfaces'
import convertCategoricalDataView from './convertCategoricalDataView'

const get = require('lodash/get')
const isEqual = require('lodash/isEqual')
import * as logger from '../logger'

export default class DataViewConverter {
	constructor(private selectionManager: any) {} // tslint:disable-line no-empty

	public convertDataView(
		dataView: powerbi.DataView,
		options: IVisualDataOptions,
	): IChartData {
		// TODO: when we support date-based drilldown, we have to process the matrix-form data view
		return convertCategoricalDataView(dataView, options)
	}

	/**
	 * Unpack selected categories from the native PowerBI data structure
	 * @param dataView
	 */
	public unpackSelectedCategories(
		dataView: powerbi.DataView,
	): { [key: string]: ICategory } {
		const selection = this.selectionManager.getSelectionIds()
		const category = get(dataView, 'categorical.categories[0]')

		const selectedCategories = {}
		if (category) {
			selection.forEach(s => {
				try {
					const selectorData = (s as any).selector.data[0].expr
					if (
						isEqual(
							selectorData.left.source,
							(category as any).source.expr.source,
						)
					) {
						selectedCategories[selectorData.right.value] = true
					}
				} catch (err) {
					logger.error(
						'🐞Error Processing Selected HeatStreams Categories🐞',
						s,
						err,
					)
				}
			})
		}

		return selectedCategories
	}

	public unpackDomainScrub(dataView: powerbi.DataView) {
		const castScrubPoint = v => {
			if (typeof v === 'string') {
				const isNum = /^\d+$/.test(v)
				if (isNum) {
					return Number.parseFloat(v)
				} else {
					return new Date(v)
				}
			}
			return v
		}

		const customFilter = get(dataView, 'metadata.objects.data.filter')
		const cond = get(customFilter, 'whereItems[0].condition')
		const dateScrubStart = castScrubPoint(
			get(
				cond,
				'left.right.arg.value', // PBI Service
				get(cond, 'left.right.value'), // PBI Desktop
			),
		)
		const dateScrubEnd = castScrubPoint(
			get(
				cond,
				'right.right.arg.value', // PBI Service
				get(cond, 'right.right.value'), // PBI Desktop
			),
		)
		const isValidScrub =
			dateScrubStart && dateScrubEnd && +dateScrubStart !== +dateScrubEnd
		return isValidScrub ? [dateScrubStart, dateScrubEnd] : null
	}
}
