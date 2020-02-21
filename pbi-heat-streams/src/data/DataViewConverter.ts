/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import powerbiVisualsApi from 'powerbi-visuals-api'
import {
	TimeDomain,
	ICategorySelectionMap,
	CategoryId,
} from 'react-heat-streams'
import { IChartData } from '../chart/types'
import { IVisualDataOptions } from '../settings/types'
import { convertCategoricalDataView } from './convertCategoricalDataView'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const get = require('lodash/get')

export class DataViewConverter {
	constructor(
		private selectionManager: powerbiVisualsApi.extensibility.ISelectionManager,
	) {} // tslint:disable-line no-empty

	public convertDataView(
		dataView: powerbiVisualsApi.DataView,
		options: IVisualDataOptions,
	): IChartData {
		return convertCategoricalDataView(dataView, options)
	}

	/**
	 * Unpack selected categories from the native PowerBI data structure
	 * @param dataView
	 */
	public unpackSelectedCategories(): ICategorySelectionMap {
		const selection = this.selectionManager.getSelectionIds()
		return selection.map(unpackCategoryId).reduce((prev, curr) => {
			prev[curr] = true
			return prev
		}, {})
	}

	public unpackDomainScrub(
		dataView: powerbiVisualsApi.DataView,
	): TimeDomain | null {
		const castScrubPoint = (v: any) => {
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

function unpackCategoryId(
	s: powerbiVisualsApi.extensibility.ISelectionId,
): CategoryId {
	// HAKK: unpack the category id as a powerBI opaque id from the selection id
	return JSON.stringify((<any>s).dataMap[Object.keys((<any>s).dataMap)[0]][0])
}
