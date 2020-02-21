/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import powerbiVisualsApi from 'powerbi-visuals-api'
import { TimeDomain, ICategorySelectionMap } from 'react-heat-streams'
import { IChartData } from '../chart/types'
import { IVisualDataOptions } from '../settings/types'
import { convertCategoricalDataView } from './convertCategoricalDataView'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const get = require('lodash/get')

export class DataViewConverter {
	private data: IChartData | undefined
	constructor(
		private selectionManager: powerbiVisualsApi.extensibility.ISelectionManager,
	) {} // tslint:disable-line no-empty

	public convertDataView(
		dataView: powerbiVisualsApi.DataView,
		options: IVisualDataOptions,
	): IChartData {
		const result = convertCategoricalDataView(dataView, options)
		this.data = result
		return result
	}

	/**
	 * Unpack selected categories from the native PowerBI data structure
	 * @param dataView
	 */
	public unpackSelectedCategories(): ICategorySelectionMap {
		const selection = this.selectionManager.getSelectionIds()
		const ids = selection.map((s: any) => {
			return s.dataMap[Object.keys(s.dataMap)[0]][0].identityIndex
		})
		return ids.reduce((prev, curr) => {
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
