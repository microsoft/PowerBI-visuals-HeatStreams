/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { flatten } from 'lodash'
import { getSliceEnd, XDomain } from 'react-heat-streams'
import { extent } from 'd3-array'
import { IVisualDataOptions } from '../settings/types'
import { ICategoryData, ICategoryDataMap, IChartData } from '../chart/types'
import { aggregateValueSlices } from './aggregateValueSlices'
import { sortCategories } from './sortCategories'
import powerbiVisualsApi from 'powerbi-visuals-api'
import { ICategory, CategoryId } from 'react-heat-streams'

/**
 * Converts a PowerBI dataview into a usable chart-data object
 * @param dataView The PowerBI DataView
 * @param options The visual data interpretation options
 */
export function convertCategoricalDataView(
	dataView: powerbiVisualsApi.DataView,
	options: IVisualDataOptions,
): IChartData {
	const categoryIds = unpackCategoryIds(dataView)
	const categoryNames = unpackCategoryNames(dataView)
	const [rawCategories, categoriesById] = getCategories(
		categoryIds,
		categoryNames,
	)
	const categoryData = unpackCategoryData(dataView, rawCategories)
	const positionDomain = determineXDomain(categoryData, options)

	const [categoryValues, valueDomain] = aggregateValueSlices(
		categoryData,
		positionDomain,
		options.dateAggregation,
		options.numericAggregation,
	)
	const categories = sortCategories(rawCategories, categoryData, options)
	return {
		categories,
		categoriesById,
		categoryData,
		categoryValues,
		valueDomain,
		positionDomain,
	}
}

function unpackCategoryIds(dataView: powerbiVisualsApi.DataView): CategoryId[] {
	return <CategoryId[]>(
		dataView.categorical.categories[0].identity.map(i => JSON.stringify(i))
	)
}

/**
 * Get the category names out of a PowerBI dataview
 * @param dataView The PowerBI DataView containing the categorical data
 */
function unpackCategoryNames(dataView: powerbiVisualsApi.DataView): string[] {
	return (
		dataView?.categorical?.categories[0] &&
		dataView?.categorical?.categories[0].values.map(v => `${v}`)
	)
}

/**
 * Transforms category names (string[]) into a list of category objects and a lookup map by ID
 * @param categoryNames The category names array
 */
function getCategories(
	categoryIds: CategoryId[],
	categoryNames: string[],
): [ICategory[], Record<CategoryId, ICategory>] {
	const categories = categoryNames.map((categoryName, index) => ({
		index,
		id: categoryIds[index],
		name: categoryName,
	}))
	const categoriesById = categories.reduce((prev, curr) => {
		prev[curr.id] = curr
		return prev
	}, <Record<CategoryId, ICategory>>{})
	return [categories, categoriesById]
}

/**
 * Unpacks category data points out of the dataview
 * @param dataView The PowerBI DataView
 * @param categories The category list
 */
function unpackCategoryData(
	dataView: powerbiVisualsApi.DataView,
	categories: ICategory[],
): ICategoryDataMap {
	const categoryData: ICategoryDataMap = {}
	categories.forEach((category: any) => {
		categoryData[category.id] = dataView.categorical.values.map(
			categoricalValue => {
				let position = categoricalValue.source.groupName
				const value = categoricalValue.values[(<any>category).index]
				if (typeof position === 'string') {
					position = new Date(position)
				}
				return <ICategoryData>{ position, value }
			},
		)
	})
	return categoryData
}

/**
 * Gets the X Domain of the categorical data
 * @param data The data map
 * @param options The visual data options
 */
function determineXDomain(
	data: ICategoryDataMap,
	options: IVisualDataOptions,
): XDomain {
	// Compute the per-category domain, flatten those and compute the domain over those values
	const domain: XDomain = <XDomain>(
		extent(
			flatten(
				<any>(
					Object.keys(data).map(category =>
						extent(
							data[category],
							(pv: { position: Date | number }) => pv.position,
						),
					)
				),
			),
		)
	)

	// The actual end should be the end of the final slice based on the aggregation configuration
	domain[1] = getSliceEnd(
		domain[1],
		options.numericAggregation,
		options.dateAggregation,
	)
	return domain
}
