/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import powerbiVisualsApi from 'powerbi-visuals-api'
import { ICategory, TimeDomain, CategoryId } from 'react-heat-streams'
import { buildDomainScrub } from './data/buildDomainScrub'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const get = require('lodash/get')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const logger = require('./logger')

export class Interactions {
	constructor(
		private host: powerbiVisualsApi.extensibility.visual.IVisualHost,
		private selectionManager: powerbiVisualsApi.extensibility.ISelectionManager,
	) {} // tslint:disable-line no-empty

	public async clearSelections(): Promise<void> {
		logger.info('Handle Clear')
		await this.selectionManager.clear()
		this.applyFilter(null)
		this.persistSelectedCategories([])
	}

	public async selectCategory(
		category: ICategory,
		multiselect: boolean,
		dataView: powerbiVisualsApi.DataView,
	): Promise<void> {
		logger.info('Handle Cat Click', category, multiselect)
		const selection = this.selectionIdForCategory(category, dataView)
		await this.selectionManager.select(selection, multiselect)
		const selectedCategories = this.selectionManager.hasSelection()
			? [(<any>category).index]
			: []
		this.persistSelectedCategories(selectedCategories)
	}

	public async scrub(
		bounds: TimeDomain,
		dv: powerbiVisualsApi.DataView,
	): Promise<void> {
		logger.info('Handle Scrub', bounds)
		if (bounds === null || bounds === undefined || +bounds[0] === +bounds[1]) {
			this.applyFilter(null)
			return
		}
		const column = dv.metadata.columns.find(
			(col: powerbiVisualsApi.DataViewMetadataColumn) => col.roles!.grouping,
		)
		const filter = buildDomainScrub(bounds, column!.identityExprs![0])
		this.applyFilter(filter)
	}

	/**
	 * Event that gets fired when selection should be restored to the given ids.
	 * @param listener The listener for the event
	 */
	public onRestoreSelection(
		listener: (ids: powerbiVisualsApi.extensibility.ISelectionId[]) => void,
	): void {
		this.selectionManager.registerOnSelectCallback(listener)
	}

	private selectionIdForCategory(
		category: ICategory,
		dv: powerbiVisualsApi.DataView,
	): powerbiVisualsApi.visuals.ISelectionId {
		const categoryColumn = get(dv, 'categorical.categories[0]', [])
		return this.host
			.createSelectionIdBuilder()
			.withCategory(categoryColumn, (<any>category).index)
			.createSelectionId()
	}

	private applyFilter(filter: any): void {
		logger.info(
			'Date scrubbing not supported yet in tandem w/ category selection. 🤷‍',
		)
		// this.host.applyJsonFilter(filter, 'data', 'filter')
	}

	private persistSelectedCategories(categories: CategoryId[]): void {
		this.host.persistProperties(<any>{
			merge: [
				{
					objectName: 'data',
					properties: {
						selectedCategories: JSON.stringify(categories),
					},
					selector: null,
				},
			],
		})
	}
}
