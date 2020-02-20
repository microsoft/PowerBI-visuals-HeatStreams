/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-var-requires */
import powerbi from 'powerbi-visuals-api'
import { TimeDomain, ICategorySelectionMap } from 'react-heat-streams'
import { IChartData } from '../chart/types'
import { IVisualDataOptions } from '../settings/types'
import { convertCategoricalDataView } from './convertCategoricalDataView'
import * as logger from '../logger'

const get = require('lodash/get')
const isEqual = require('lodash/isEqual')

export class DataViewConverter {
	constructor(
		private selectionManager: powerbi.extensibility.ISelectionManager,
	) {} // tslint:disable-line no-empty

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
	): ICategorySelectionMap {
		const selection = this.selectionManager.getSelectionIds()
		const category = get(dataView, 'categorical.categories[0]')

		const selectedCategories: ICategorySelectionMap = {}
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

	public unpackDomainScrub(dataView: powerbi.DataView): TimeDomain | null {
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
